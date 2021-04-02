<template>
  <div class="beizhu-modal-cmp all0">
    <div class="beizhu hor-ver-center" v-loading="confirmLoading">
      <span class="p-r-t el-icon-close" @click="close"></span>
      <div class="header">
        <span class="title">修改备注姓名</span>
      </div>
      <div class="body">
        <el-input v-model="beiZhu"/>
      </div>
      <div class="footer">
        <el-button @click="ok" size="mini" type="success">确认</el-button>
        <el-button @click="close" size="mini" type="danger">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['currentConversation'],
    data() {
      return {
        confirmLoading: false,
        beiZhu: this.currentConversation.beiZhu
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      }
    },
    methods: {
      async ok() {
        this.confirmLoading = true
        const params = {
          userId: this.userInfo.uid,
          friendId: this.currentConversation.id,
          friendBeiZhuName: this.beiZhu
        }
        await this.$http.modifyFriendBeiZhu(params)
        const uInfo = await this.$http.getUserInfo(this.userInfo.uid)
        this.$store.dispatch('user/LOGIN', uInfo.data.data.userInfo)
        this.$eventBus.$emit('toggleBeiZhuModal', {
          show: false,
          data: {}
        })
        this.confirmLoading = false
      },
      close() {
        this.$eventBus.$emit('toggleBeiZhuModal', {
          show: false,
          data: {
            currentConversation: {}
          }
        })
      }
    },
  }
</script>

<style lang="scss">
  .beizhu-modal-cmp {
    position: fixed;
    z-index: 1006;
    background-color: rgba(0, 0, 0, .2);

    .beizhu {
      width: 300px;
      padding: 10px 20px;
      background-color: #fff;
      border-radius: 10px;

      .body {
        margin: 10px 0;
      }
    }
  }
</style>
