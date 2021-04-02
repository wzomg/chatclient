<template>
  <div class="conversation-item-menu box-shadow1">
    <span class="menu-item operation-text" v-if="type === 'recent'" @click.stop="remove">关闭会话</span>
    <span class="menu-item operation-text" @click.stop="viewProfile">查看资料</span>
    <span class="menu-item operation-text" @click.stop="modifyBeiZhu">修改备注</span>
    <span class="menu-item operation-text" @click.stop="switchFenZu">切换分组</span>
    <el-popover
      placement="top"
      width="160"
      v-model="showDelPop">
      <p>删除好友后聊天记录等信息也会被删除，是否删除？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="showDelPop = false">取消</el-button>
        <el-button type="primary" size="mini" @click.stop="deleteFriend">确定</el-button>
      </div>
      <span slot="reference" class="menu-item operation-text" @click.stop="()=>{}">删除好友</span>
    </el-popover>
  </div>
</template>

<script>
  export default {
    props: ['conversation', 'type'],
    data() {
      return {
        showDelPop: false,
        friendInfo: {}
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      }
    },
    methods: {
      remove() {
        this.$emit('hiddenMenu')
        this.$emit('remove')
      },
      async viewProfile() {
        await this.$http.getUserInfo(this.conversation.id).then(res => {
          // console.log("查询返回的用户信息为：", res.data.data.userInfo)
          if (res.data.code === 2000) {
            this.friendInfo = res.data.data.userInfo
          }
        })
        this.$eventBus.$emit('showUserProfile', {
          show: true,
          data: {
            friendInfo: this.friendInfo
          },
        })
        this.$emit('hiddenMenu')
      },
      switchFenZu() {
        this.$eventBus.$emit('toggleFenZuModal', {
          show: true,
          data: {
            currentConversation: this.conversation
          }
        })
        this.$emit('hiddenMenu')
      },
      modifyBeiZhu() {
        this.$eventBus.$emit('toggleBeiZhuModal', {
          show: true,
          data: {
            currentConversation: this.conversation
          }
        })
        this.$emit('hiddenMenu')
      },
      async deleteFriend() {
        const {data} = await this.$http.deleteGoodFriend({
          userM: this.userInfo.uid,
          userY: this.conversation.id,
          roomId: this.conversation.roomId
        })
        if (data.code === 2000) {
          this.$socket.emit("sendDelGoodFriend", this.conversation); //传递当前会话
          //删除的这一方还要更新一下本地好友id列表，之际重新请求我的好友一遍即可
          this.$eventBus.$emit("getMyFriends")
          this.remove() //更新最近会话列表
          console.log("删除好友成功！")
          this.$store.dispatch('app/SET_ALL_FRIENDS', {
            resource: this.conversation.id,
            type: 'delete'
          })
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: data.message,
            type: 'error'
          })
        }
        this.$emit('hiddenMenu') //关闭菜单
      }
    },
  }
</script>

<style lang="scss">
  .conversation-item-menu {
    padding: 5px;

    .menu-item {
      display: block;
      margin-top: 10px;
    }

    > .menu-item {
      &:first-child {
        margin-top: 0;
      }
    }
  }
</style>
