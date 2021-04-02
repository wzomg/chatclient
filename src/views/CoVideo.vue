<template>
  <div
    class="audio-video"
    v-loading="loading"
    element-loading-spinner="el-icon-loading">
    <div class="video-container" v-show="isToPeer && webRtcType === 'video'">
      <div>
        <video src id="rtcA" controls autoplay></video>
        <el-button type="danger" @click="hangup">挂断</el-button>
      </div>
      <div>
        <video src id="rtcB" controls autoplay></video>
      </div>
    </div>
    <div class="audio-container" v-if="webRtcType === 'audio'">
      <el-tooltip class="item" effect="dark" content="点击关闭通话" placement="top">
        <i class="icon el-icon-mic" @click="hangup"></i>
      </el-tooltip>
      <span class="secondary-font" style="display: block">语音通话中</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: "CoVideo",
    props: ["currentconversation", "state", "webRtcType"],
    data() {
      return {
        localStream: '', //本地视频流
        conversation: {},
        loading: false,
        loadingText: "呼叫中",
        isToPeer: false, // 是否建立了 P2P 连接
        peer: null,
        offerOption: {
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 1
        },
        iceServers: {
          iceServers: [
            {
              url: 'turn:xxxxx:3478', // xxxxx 为域名
              credential: '123456', // 密码
              username: 'admin' // 账号
            },
          ],
          sdpSemantics: 'plan-b'
        },
      }
    },
    sockets: {
      async reply(data) {
        this.loading = false
        // console.log(data)
        if (data.type && (data.type === 'disagree' || data.type === 'busy')) return
        // 对方同意之后创建自己的 peer
        await this.createP2P(data)
        // 并给对方发送 offer
        this.createOffer(data)
      },
      '1v1answer'(data) {
        this.onAnswer(data)
      },
      '1v1offer'(data) {
        this.onOffer(data)
      },
      '1v1ICE'(data) {
        this.onIce(data)
      },
      '1v1hangup'(data) {
        this.localStream.getTracks().forEach(function (track) {
          track.stop()
        })
        this.$message({message: "聊天结束~", type: "warning"})
        this.peer.close()
        this.peer = null
        this.isToPeer = false
        this.$store.dispatch('app/SET_IS_VIDEOING', false)
        this.$store.dispatch('app/SET_IS_AUDIOING', false)
        this.$eventBus.$emit('hangup') // 关闭连接后将webRTCState初始化为apply
      }
    },
    methods: {
      hangup() {
        // 挂断通话
        // 关闭摄像头
        this.localStream.getTracks().forEach(function (track) {
          track.stop()
        })
        this.$message({message: "聊天结束~", type: "warning"})
        this.$socket.emit("1v1hangup", {...this.conversation, webRtcType: this.webRtcType})
        this.peer.close()
        this.peer = null
        this.isToPeer = false
        this.$store.dispatch('app/SET_IS_VIDEOING', false)
        this.$store.dispatch('app/SET_IS_AUDIOING', false)
        this.$eventBus.$emit('hangup') // 关闭连接后将webRTCState初始化为apply
      },
      apply() {
        this.loading = true
        this.loadingText = "呼叫中"
        this.$socket.emit("apply", {...this.conversation, webRtcType: this.webRtcType})
      },
      reply() {
        this.$socket.emit("reply", {...this.conversation, webRtcType: this.webRtcType})
      },
      async createP2P(data) {
        const that = this;
        that.loading = true
        that.loadingText = "正在建立通话连接"
        await this.createMedia(data)
      },
      async createMedia(data) { // 保存本地流到全局
        const that = this;
        try {
          const webRtcType = that.webRtcType
          let constraints = null
          if (webRtcType === 'video') {
            constraints = {
              audio: true,
              video: true
            }
          } else {
            constraints = {
              audio: true,
              video: false
            }
          }
          console.log("start prepare localStream origin")
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            that.$message.error("设备不支持")
            console.log('getUserMedia is not support!')
          }
          let streamTep = null;
          await navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
            // console.log("mediaStream：", mediaStream)
            streamTep = mediaStream
          }).catch(error => {
            console.log("获取媒体设备异常：", error)
            that.$message.warning("获取媒体设备异常")
          })
          that.localStream = streamTep
          let video = document.querySelector("#rtcA")
          video.srcObject = streamTep
        } catch (e) {
          console.log("getUserMedia: ", e)
        }
        await this.initPeer(data) // 获取到媒体流后，调用函数初始化 RTCPeerConnection
      },
      initPeer(data) { // 创建输出端 PeerConnection
        const that = this;
        console.log('创建输出端 PeerConnection...')
        let PeerConnection =
          window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection
        that.peer = new PeerConnection(that.iceServers)
        // console.log('localStream：', that.localStream)
        that.peer.addStream(that.localStream) // 添加本地流
        // 监听ICE候选信息 如果收集到，就发送给对方
        that.peer.onicecandidate = function (event) {
          // console.log("监听ice候选信息：", event.candidate)
          if (event.candidate) {
            // console.log("sdp：", event.candidate)
            that.$socket.emit("1v1ICE", {
              ...data,
              sdp: event.candidate
            })
          } else {
            console.log("ICE收集已经完成")
          }
        }
        that.peer.onaddstream = event => {
          // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
          // console.log("监听到语音加入 onaddstream：", event)
          that.isToPeer = true
          that.loading = false
          let video = document.querySelector("#rtcB")
          video.srcObject = event.stream
          // console.log("video srcObject：", video.srcObject)
        }
      },
      async createOffer(data) {
        // 创建并发送 offer
        try {
          // 创建offer
          let offer = await this.peer.createOffer(this.offerOption)
          // 呼叫端设置本地 offer 描述
          await this.peer.setLocalDescription(offer)
          // 给对方发送 offer
          this.$socket.emit("1v1offer", {
            ...data,
            sdp: offer
          })
        } catch (e) {
          console.log("createOffer: ", e)
        }
      },
      async onOffer(data) {
        // 接收offer并发送 answer
        try {
          // 接收端设置远程 offer 描述
          await this.peer.setRemoteDescription(data.sdp)
          // 接收端创建 answer
          let answer = await this.peer.createAnswer()
          // 接收端设置本地 answer 描述
          await this.peer.setLocalDescription(answer)
          // 给对方发送 answer
          this.$socket.emit("1v1answer", {
            ...data,
            sdp: answer
          })
        } catch (e) {
          console.log("onOffer: ", e)
        }
      },
      async onAnswer(data) {
        // 接收answer
        try {
          await this.peer.setRemoteDescription(data.sdp) // 呼叫端设置远程 answer 描述
        } catch (e) {
          console.log("onAnswer: ", e)
        }
      },
      async onIce(data) {
        // 接收 ICE 候选
        try {
          await this.peer.addIceCandidate(data.sdp) // 设置远程 ICE
        } catch (e) {
          console.log("onAnswer: ", e)
        }
      }
    },
    async mounted() {
      this.conversation = this.currentconversation
      if (this.state === 'apply') { // 如果是主动请求就发起apply
        this.apply()
      } else if (this.state === 'reply') { // 如果是接收到请求就发起reply
        console.log('接收端回复初始化开始...')
        await this.createP2P({...this.conversation, webRtcType: this.webRtcType}) // 同意之后创建自己的 peer 等待对方的 offer
        console.log('接收端初始化结束，开始回复...')
        this.reply()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .audio-video {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .audio-container {
    text-align: center;

    .icon {
      font-size: 30px;
      color: hsla(201, 100%, 55%, 1);
      margin-bottom: 5px;
    }
  }

  .video-container {
    display: flex;
    justify-content: center;

    video {
      width: 400px;
      height: 300px;
      margin-left: 20px;
      background-color: #ddd;
    }
  }
</style>
