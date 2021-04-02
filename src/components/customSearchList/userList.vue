<template>
  <div class="custom-search-list-com">
    <div class="wrapper" v-for="item in searchList" :key="item.uid">
      <div class="details">
        <el-avatar
          class="avatar"
          shape="square"
          :src="IMG_URL + item.photo">
        </el-avatar>
        <div class="info">
          <p class="item primary-font nickname">
            <!--            <router-link :to="`/user/${item.uid}`" tag="span">-->
            <!--              {{item.nickname}}-->
            <!--            </router-link>-->
            <a @click.prevent="lookUserInfo(item)">
              {{item.nickname}}
            </a>
          </p>
          <p class="item secondary-font">{{item.signature}}</p>
        </div>
      </div>
      <div class="operation">
        <el-button
          v-if="!(friends || []).includes(item.uid)"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="showAdditionDialog(item)"
        >添加
        </el-button>
        <el-button
          v-if="(friends || []).includes(item.uid)"
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
        friends: JSON.parse(window.localStorage.getItem('friends')),
        showAdditionMessage: false,
        additionMessage: '',
        selectItem: {},
        loading: false
      }
    },
    methods: {
      showAdditionDialog(item) {
        this.showAdditionMessage = !this.showAdditionMessage
        this.selectItem = item
      },
      async sendApply() {
        this.loading = true
        const validateSysUsr = this.sysUsers.filter(item => item.code === '111111')[0]
        const val = {
          roomId: validateSysUsr.sid + '-' + this.selectItem.uid,
          senderId: this.userInfo.uid,
          senderName: this.userInfo.username,
          senderNickname: this.userInfo.nickname,
          senderAvatar: this.userInfo.photo,
          receiverId: this.selectItem.uid,
          time: fromatTime(new Date()),
          additionMessage: this.additionMessage,
          status: 0,
          validateType: 0
        }
        await this.$http.getValidateMessage({ // 要用同步请求，否则会出错
          roomId: validateSysUsr.sid + '-' + this.selectItem.uid,
          status: 0,  //未处理状态
          validateType: 0
        }).then(res => {
          let validateMessage = res.data.data.validateMessage
          this.loading = false
          this.showAdditionMessage = false
          this.additionMessage = ''
          if (validateMessage && validateMessage.roomId) {
            this.$message({type: 'warning', message: '您已经向' + this.selectItem.username + '发送好友请求了，请勿重复操作！'})
          } else {
            this.$alert('验证消息发送成功！', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
            this.$socket.emit('sendValidateMessage', val)
          }
        })
      },
      lookUserInfo(fInfo) {
        this.$eventBus.$emit('showUserProfile', {
          show: true,
          data: {
            friendInfo: fInfo
          },
        })
      }
    },
    computed: {
      ...mapState('app', {
        sysUsers: 'sysUsers'
      }),
      ...mapState('user', {
        userInfo: 'userInfo'
      }),
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
