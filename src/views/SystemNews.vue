<template>
  <div class="system-page" :style="device === 'Mobile' ? {width: '100%'} : {}">
    <p class="title">我的系统消息</p>
    <validate-news :validateNewsList="validateNewsList" @changeValidateNewsStatus="changeValidateNewsStatus"/>
  </div>
</template>

<script>
  import validateNews from '@/components/validateNews'

  export default {
    name: "System",
    data() {
      return {
        validateNewsList: []
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      },
      device() {
        return this.$store.state.device.deviceType
      }
    },
    methods: {
      async fetchMyValidateNews() {
        const userId = this.userInfo.uid
        const {data} = await this.$http.getMyValidateMessageList(userId)
        let validateMessageList = data.data.validateMessageList
        if (data.code === 2000) {
          this.validateNewsList = validateMessageList
        }
      },
      changeValidateNewsStatus(item, status) {
        const {roomId, senderId, receiverId} = item
        this.validateNewsList.forEach(item => {
          if (item.roomId === roomId && item.senderId === senderId && item.receiverId === receiverId) {
            item.status = status //不用重新请求数据
          }
        })
      }
    },
    components: {
      validateNews
    },
    sockets: {
      receiveValidateMessage(data) { //这里是停留在系统消息页面时，组装刚添加的验证消息
        // console.log('在system页面接收新的验证消息：', data)
        this.validateNewsList = [...this.validateNewsList, data]
      }
    },
    created() {
      this.fetchMyValidateNews()
    },
  }
</script>

<style lang="scss">
  .system-page {
    .title {
      margin-top: 0;
    }

    width: 70%;
    height: 100%;
    margin: 0 auto;
    padding: 20px 10px;
  }
</style>
