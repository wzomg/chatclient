<template>
  <div class="layout-page" v-css="{'background-image': 'url(' + bgImgUrl + ')'}">
    <div v-if="!device === 'Mobile'" class="toggle" @click.stop="setShowMain" title="切换聊天区域是否显示">
      <i class="icon el-icon-thumb"></i>
    </div>
    <transition name="fade">
      <main v-show="showMain" class="co-messager-layout">
        <my-header></my-header>
        <!-- filter-bgc是用于设置背景虚化的，因为使用了filter以及transform后fixed会改变 -->
        <div
          v-if="!device === 'Mobile'"
          class="filter-bgc"
          v-css="{
            'filter': 'blur(' + blur + 'px)',
            'background-image': 'url(' + bgImgUrl + ')'
          }"/>
        <el-main
          :class="device === 'Mobile' ? 'co-messager-main mobile' : 'co-messager-main'"
          v-css=" opacity !== 1 ? {'opacity': opacity} : {}">
          <audio :src="NotifyAudio" ref="audio" muted></audio>
          <transition name="slide-left">
            <div
              :class="device === 'Mobile' ? 'co-messager-aside mobile' : 'co-messager-aside'"
              v-css="device === 'Mobile' ? {'transform': 'translateX(' + asideTranslateX + 'px)'} : ''">
              <my-aside :set-show-theme="setShowTheme"/>
            </div>
          </transition>
          <div :class="device === 'Mobile' ? 'co-messager-content mobile' : 'co-messager-content'">
            <keep-alive :include="include">
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </div>
        </el-main>
      </main>
    </transition>
    <transition name="fade">
      <theme v-if="showTheme" @setShowTheme="setShowTheme"/>
    </transition>
    <!-- 在移动端下点击展示左边菜单 -->
    <!--<div
      v-show="device === 'Mobile' && asideTranslateX === -70 && $route.path === '/chat/home' && currentUI === 'conversation'"
      class="mobile-menu"
      @click.stop="toggleAside">
      <img :src="IMG_URL + userInfo.photo" alt="" srcset="">
    </div>-->
    <div
      v-show="device === 'Mobile'"
      :class="asideTranslateX ? 'mobile-menu el-icon-d-arrow-right' : 'mobile-menu el-icon-d-arrow-left' "
      @click.stop="toggleAside">
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import myHeader from './components/Header'
  import myAside from './components/Aside'
  import {APP_VERSION} from '@/const'
  import {saveRecentConversationToLocal, arrUnique} from '@/utils'
  import {SET_UNREAD_NEWS_TYPE_MAP} from '@/store/constants'
  import theme from '@/components/theme'
  import NotifyAudio from './../../../static/audio/notify.mp3'

  const systemPictureMap = {
    abstract: require('./../../../static/image/theme/abstract.jpg'),
    city: require('./../../../static/image/theme/city.jpg'),
    ocean: require('./../../../static/image/theme/ocean.jpg')
  }
  const notifySoundMap = {
    default: require('./../../../static/audio/default.mp3'),
    apple: require('./../../../static/audio/apple.mp3'),
    pcqq: require('./../../../static/audio/pcqq.mp3'),
    momo: require('./../../../static/audio/momo.mp3'),
    huaji: require('./../../../static/audio/huaji.mp3'),
    mobileqq: require('./../../../static/audio/mobileqq.mp3'),
    none: ''
  }
  export default {
    name: 'Layout',
    data() {
      return {
        include: ['Home'], // keepAlive缓存相关
        bgImgUrl: '',
        NotifyAudio: '',
        // notifySound: '',
        showTheme: false,
        showMain: true, // 聊天区域是否展示
        asideTranslateX: -70,
        IMG_URL: process.env.IMG_URL
      }
    },
    computed: {
      ...mapState('user', {
        userInfo: 'userInfo'
      }),
      ...mapState('theme', {
        opacity: 'opacity',
        blur: 'blur',
        bgImg: 'bgImg',
        notifySound: 'notifySound',
        customBgImgUrl: 'customBgImgUrl'
      }),
      currentConversation() {
        return this.$store.state.app.currentConversation
      },
      recentConversationList() { //最近的所有会话列表
        return this.$store.state.app.recentConversation
      },
      allConversation() {
        return this.$store.state.app.allConversation
      },
      device() {
        return this.$store.state.device.deviceType
      },
      currentUI() {
        return this.$store.state.device.currentUI
      }
    },
    watch: {
      userInfo: {
        handler(newVal, oldVal) {
          this.userGoOnline()
        },
        deep: true,
        immediate: true
      },
      bgImg: {
        handler(bgImg) {
          if (bgImg === 'custom') {
            this.bgImgUrl = this.customBgImgUrl ? this.customBgImgUrl : this.IMG_URL + 'img/0072.jpg';
          } else {
            this.bgImgUrl = systemPictureMap[bgImg]
          }
        }, deep: true, immediate: true
      },
      customBgImgUrl: { //监听切换的背景图片
        handler(newVal) {
          if (!newVal || newVal === '') return
          this.bgImgUrl = newVal
        }, deep: true, immediate: true
      },
      notifySound: {
        handler(notifySound) {
          this.NotifyAudio = notifySoundMap[notifySound]
        }, deep: true, immediate: true
      },
      $route(to, from) {
        const include = this.include
        //如果 要 to(进入) 的页面是需要 keepAlive 缓存的，把 name push 进 include数组
        if (to.meta.keepAlive) {
          // !include.includes('Layout') && include.push('Layout')
          !include.includes(to.name) && include.push(to.name)
        }
        //如果 要 form(离开) 的页面是 keepAlive缓存的，
        //再根据 deepth 来判断是前进还是后退
        //如果是后退
        if (from.meta.keepAlive && to.meta.deepth < from.meta.deepth) {
          const index = include.indexOf(from.name)
          index !== -1 && include.splice(index, 1)
        }
      }
    },
    components: {
      myHeader,
      myAside,
      theme
    },
    sockets: {
      connect: function () {
        console.log('socket connected：', this.$socket.id)
      },
      onlineUser(data) {
        // console.log('当前在线用户列表：', data)
        //const onlineUserIdArr = Object.values(data).map(item => item.uid)
        this.$store.dispatch('app/SET_ONLINE_USER', data)
      },
      receiveMessage(news) {
        this.$refs['audio'].play()
        // console.log('收到新消息：', news)
        //判断一下输出的类型，若不是text类型，则截取 fileRawName
        let wenben = ''
        if (news.messageType !== 'text') {
          wenben = news.fileRawName ? news.fileRawName.slice(0, 10) : ''
        } else {
          wenben = news.message ? news.message.slice(0, 10) : ''
        }
        this.$notify({
          title: '收到新消息',
          message: wenben,
          type: 'success'
        })
        this.$store.dispatch('news/SET_UNREAD_NEWS', {
          roomId: news.roomId,
          count: 1,
          type: 'ADD'
        })
        const senderConversation = this.allConversation.find(item => item.roomId === news.roomId)
        this.$store.dispatch('app/SET_RECENT_CONVERSATION', {
          type: 'add',
          data: senderConversation
        })
        this.$store.dispatch('news/SET_LAST_NEWS', {
          type: 'edit',
          res: {
            roomId: news.roomId,
            news: news
          }
        })
        saveRecentConversationToLocal(news.senderId)
      },
      receiveValidateMessage(news) { //同时向系统消息页面发送未读消息
        this.$refs['audio'].play()
        // console.log('收到新的验证消息', news)
        this.$store.dispatch('news/SET_UNREAD_NEWS', {
          roomId: news.roomId,
          count: 1,
          type: SET_UNREAD_NEWS_TYPE_MAP.add
        })
      },
      async receiveAgreeFriendValidate(data) {
        // console.log('receiveAgreeFriendValidate：', data)
        //这里要重新请求获取一下我的好友列表，以及更新一下分组人数
        this.$eventBus.$emit("getMyFriends")
      },
      receiveAgreeGroupValidate(data) {
        // console.log('接受群聊验证：receiveAgreeGroupValidate：', data)
        this.$eventBus.$emit("getMyGroups")
      },
      receiveDelGoodFriend(oldVal) {
        // console.log("转发消息成功 --> receiveDelGoodFriend，会话信息为：", oldVal)
        //重新请求一下我的好友列表
        this.$eventBus.$emit("getMyFriends")
        //更新一下被删好友最近会话列表
        this.removeRecentFriendConversation(oldVal)
      },
      receiveQuitGroup(oldVal) { //接收拒绝群聊
        // console.log("接收到退群时的会话消息为：", oldVal)
        //重新获取我的群聊
        this.$eventBus.$emit("getMyGroups")
        //若是群主解散群聊，则还需在本地更新一下我的最近群会话列表
        // console.log("是否为群主？", oldVal.holder)
        if (oldVal.holder === 1) {
          this.removeRecentGroupConversation(oldVal)
        }
      },
      conversationList(list) {
      },
      /**
       * 发送的消息被对方读取了
       */
      isReadMsg(val) {
        // console.log('切换会话时，该会话的所有消息都已经被读取了，isReadMsg：', val)
        const {roomId, status} = val
        this.$store.dispatch('news/SET_USER_IS_READ_MSG', {
          roomId,
          status
        })
      }
    },
    methods: {
      removeRecentFriendConversation(delConversationInfo) { //关闭最近的一个被删除会话，更新本地缓存内容
        const recentFriendIdsStr = window.localStorage.getItem('coMessager-recentConversation-friend') || ''
        const recentFriendIds = arrUnique(recentFriendIdsStr.split(',')).filter(item => item) // 去重
        const index = recentFriendIds.findIndex(item => item === delConversationInfo.id)
        index !== -1 && recentFriendIds.splice(index, 1)
        // console.log("进来删除该好友后本地好友id列表为：", recentFriendIds)
        window.localStorage.setItem('coMessager-recentConversation-friend', recentFriendIds.join())

        this.$store.dispatch('app/SET_RECENT_CONVERSATION', {type: 'delete', data: delConversationInfo})
        // console.log("进来删除好友的当前会话为：", this.currentConversation)
        // console.log("进来删除好友的待删除会话为：", delConversationInfo)
        if (delConversationInfo.id === this.currentConversation.id) {
          const conversationList = this.recentConversationList.filter(item => Object.keys(item).length > 0) //相当于取出最近会话列表中第一个，被删除的好友会话已经关闭
          this.$store.dispatch('app/SET_CURRENT_CONVERSATION', conversationList[0] || {}) //切换会话时设置一下全局的当前会话，就算是打开着被删除好友的会话窗口也会被切换
          //或者将全局的当前会话设置为空，这样就不会展示了（不能这样做，因为当前会话被监听了，第一个判断语句被执行了直接返回，前端这样写不是很好）
          //this.$store.dispatch('app/SET_CURRENT_CONVERSATION', {})
        }
      },
      removeRecentGroupConversation(delConversationInfo) {
        const recentGroupIdsStr = window.localStorage.getItem('coMessager-recentConversation-group') || ''
        const recentGroupIds = arrUnique(recentGroupIdsStr.split(',')).filter(item => item) // 去重
        const index = recentGroupIds.findIndex(item => item === delConversationInfo.roomId)
        // console.log("进来删除群聊后待查找的下标为：", index)
        index !== -1 && recentGroupIds.splice(index, 1)
        // console.log("进来删除群聊后本地群聊id列表为：", recentGroupIds)
        window.localStorage.setItem('coMessager-recentConversation-group', recentGroupIds.join())

        this.$store.dispatch('app/SET_RECENT_CONVERSATION', {type: 'delete', data: delConversationInfo})
        // console.log("进来删除群聊的当前会话为：", this.currentConversation)
        // console.log("进来删除群聊的待删除会话为：", delConversationInfo)
        if (delConversationInfo.roomId === this.currentConversation.roomId) { //比较的是房间id
          // console.log("全局的最近会话列表为：", this.recentConversationList)
          const conversationList = this.recentConversationList.filter(item => Object.keys(item).length > 0) //相当于取出最近会话列表中第一个，被删除的好友会话已经关闭
          this.$store.dispatch('app/SET_CURRENT_CONVERSATION', conversationList[0] || {}) //切换会话时设置一下全局的当前会话，就算是打开着被删除好友的会话窗口也会被切换
          //或者将全局的当前会话设置为空，这样就不会展示了（不能这样做，因为当前会话被监听了，第一个判断语句被执行了直接返回，前端这样写不是很好）
          //this.$store.dispatch('app/SET_CURRENT_CONVERSATION', {})
        }
      },
      userGoOnline() {
        if (this.userInfo) { // 有用户信息时才发送给后端进行保存
          // console.log("开始发送在线用户信息，goOnline，用户信息为：", this.userInfo)
          this.$socket.emit('goOnline', this.userInfo)
        }
      },
      /**
       * 获取系统用户，比如发送验证消息的系统用户，然后加入会话列表
       */
      async sysUserJoinSocket() {
        const {data} = await this.$http.getSysUsers()
        const sysUserList = data.data.sysUsers
        if (data.code === 2000) {
          sysUserList.forEach(item => {
            this.$store.dispatch('app/SET_SYS_USERS', sysUserList)
            const val = {
              roomId: item.sid + '-' + this.userInfo.uid
            }
            this.$socket.emit('join', val) //将当前用户id与每个系统用户关联，创建一个房间号，用于传送加好友加群消息
          })
        }
      },
      setShowTheme(flag) {
        this.showTheme = flag
      },
      setShowMain() {
        console.log("触发")
        this.showMain = !this.showMain
      },
      toggleAside() {
        this.asideTranslateX === 0 ? this.asideTranslateX = -70 : this.asideTranslateX = 0
      }
    },
    mounted() {
      if (this.device === 'Mobile') {
        document.addEventListener('click', () => {
          this.asideTranslateX = -70
        })
      }
      this.sysUserJoinSocket()
      console.log(
        `%c ChatClient V${APP_VERSION} Started %c Contact: sharezzw@163.com %c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent'
      )
      this.$eventBus.$on("removeRecentGroup", (e) => {
        this.removeRecentGroupConversation(e.delCon)
      })
    },
    beforeDestroy() {
      this.$eventBus.$off("removeRecentGroup")
    },
  }
</script>

<style lang="scss">
  .layout-page {
    @import './../../../static/css/var.scss';
    @import './../../../static/css/animation.scss';
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    background-color: #e9ebee;
    position: relative;
    transition: all .4s ease-out;

    .toggle {
      position: fixed;

      .icon {
        padding: 5px;
        font-size: 20px;
        color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 50%;
      }
    }

    .co-messager-layout {
      box-sizing: border-box;
      height: 100%;
      width: 100%;

      .filter-bgc {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -336px 0 0 -510px;
        width: 1020px;
        height: 672px;
        filter: blur(10px);
        background-repeat: no-repeat;
        background-size: cover;
        background-attachment: fixed;
      }

      .co-messager-main {
        display: flex;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -336px 0 0 -510px;
        width: 1020px;
        height: 672px;
        background-color: #e9ebee;
        color: #333;
        border-radius: 5px;
        padding: 0;
        opacity: .8;
        /*针对移动端做特殊处理*/
        &.mobile {
          left: 0;
          top: 0;
          margin: 0;
          width: 100%;
          height: 100%;
          border-radius: 0px;
        }

        .co-messager-aside {
          width: 7%;
          height: 100%;
          border-right: 1px solid #cccccc;

          &.mobile {
            position: absolute;
            z-index: 1001;
            width: 70px;
          }
        }

        .co-messager-content {
          width: 93%;

          &.mobile {
            width: 100%;
          }
        }
      }
    }

    /*.mobile-menu {
      position: fixed;
      z-index: 1003;
      left: 5px;
      top: 10px;
      width: 40px;
      height: 40px;
      overflow: hidden;
      border-radius: 10px;
      background-color: #f2f2f2;

      img {
        width: 100%;
        height: 100%;
      }
    }*/
    .mobile-menu {
      position: fixed;
      z-index: 1003;
      left: -1px;
      top: 50px;
      background-color: #fff;
      padding: 3px;
      opacity: 0.6;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
</style>
