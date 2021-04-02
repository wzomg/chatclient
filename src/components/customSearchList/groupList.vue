<template>
  <div class="custom-search-list-com">
    <div class="wrapper" v-for="item in searchList" :key="item.gid">
      <div class="details">
        <el-avatar
          class="avatar"
          shape="square"
          :src="IMG_URL + item.img">
        </el-avatar>
        <div class="info">
          <p class="item primary-font nickname">
            <span @click="lookGroupInfo(item)">
              {{item.title}}
            </span>
          </p>
          <p class="item secondary-font">{{item.desc}}</p>
        </div>
      </div>
      <div class="operation">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          v-if="!(groups || []).includes(item.gid)"
          @click="showAdditionDialog(item)">添加
        </el-button>
        <el-button
          v-else-if="(groups || []).includes(item.gid)"
          type="primary"
          size="small"
        >已添加
        </el-button>
        <el-dialog
          title="附加消息"
          :visible.sync="showAdditionMessage"
          width="60%">
          <div v-loading="loading">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="additionMessage">
            </el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAdditionMessage = false">取 消</el-button>
            <el-button type="primary" @click="sendApply()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {fromatTime} from "@/utils"

  export default {
    props: ["searchList"],
    data() {
      return {
        IMG_URL: process.env.IMG_URL,
        groups: JSON.parse(window.localStorage.getItem('groups')),
        showAdditionMessage: false,
        additionMessage: '',
        selectItem: {},
        loading: false
      }
    },
    methods: {
      lookGroupInfo(gInfo) {
        this.$eventBus.$emit('showGroupProfile', {
          show: true,
          data: {
            groupInfo: gInfo
          },
        })
      },
      showAdditionDialog(item) {
        this.showAdditionMessage = !this.showAdditionMessage
        this.selectItem = item
      },
      async sendApply() {
        this.loading = true
        const validateSysUsr = this.sysUsers.filter(item => item.code === '111111')[0]
        const val = {
          roomId: validateSysUsr.sid + '-' + this.selectItem.holderUserInfo.uid,
          senderId: this.userInfo.uid,
          senderName: this.userInfo.username,
          senderNickname: this.userInfo.nickname,
          senderAvatar: this.userInfo.photo,
          receiverId: this.selectItem.holderUserInfo.uid,
          groupId: this.selectItem.gid,
          time: fromatTime(new Date()),
          additionMessage: this.additionMessage,
          status: 0,
          validateType: 1
        }
        await this.$http.getValidateMessage({
          roomId: validateSysUsr.sid + '-' + this.selectItem.holderUserInfo.uid,
          status: 0, //未处理状态
          validateType: 1
        }).then(res => {
          let validateMessage = res.data.data.validateMessage
          // console.log("查询到的验证消息为：", validateMessage)
          this.loading = false
          this.showAdditionMessage = false
          this.additionMessage = ''
          if (validateMessage && validateMessage.roomId) {
            this.$message({
              type: 'warning',
              message: '您已经向群主 ' + this.selectItem.holderUserInfo.username + ' 发送添加群聊请求了，请等待群主验证！'
            })
          } else {
            // console.log("发送成功！")
            this.$alert('验证消息发送成功！', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.$socket.emit('sendValidateMessage', val)
          }
        })
      }
    },
    computed: {
      ...mapState('app', {
        sysUsers: 'sysUsers'
      }),
      ...mapState('user', {
        userInfo: 'userInfo'
      })
    },
  }
</script>

<style lang="scss">
  .custom-search-list-com {

    .wrapper {
      border-top: 1px solid #C0C4CC;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;

      &:last-child {
        border-bottom: 1px solid #C0C4CC;
      }

      .details {
        display: flex;
        align-items: center;

        .avatar {
          width: 100px;
          height: 100px;
        }

        .info {
          margin-left: 27px;

          .item {
            font-family: "Helvetica, Arial, sans-serif";
            margin: 0;

            &:last-child {
              margin-top: 5px;
            }
          }

          .nickname {
            cursor: pointer;
            color: hsla(230, 84%, 63%, 1);

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
</style>
