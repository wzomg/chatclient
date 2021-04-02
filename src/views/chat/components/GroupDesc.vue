<template>
  <div class="group-desc-com">
    <div class="notice">
      <span>
        富强、民主、文明、和谐、自由、平等、公正、法治，倡导爱国、敬业、诚信、友善
      </span>
    </div>
    <div class="member">
      <group-user-list :userList="groupMembers"/>
    </div>
  </div>
</template>

<script>
  import GroupUserList from '@/components/customGroupUserList'

  export default {
    name: "GroupDescComponent",
    props: ["currentConversation"],
    data() {
      return {
        groupMembers: []
      }
    },
    methods: {
      async fetchGroupInfo() {
        if (this.currentConversation.conversationType === 'GROUP') {
          // console.log("会话消息为：", this.currentConversation)
          const groupId = this.currentConversation.groupInfo.gid
          const {data} = await this.$http.getGroupInfo(groupId)
          const groupInfo = data.data.users
          // console.log("返回的用户信息为：", groupInfo)
          if (data.code === 2000) {
            this.groupMembers = groupInfo
          }
        }
      }
    },
    components: {
      GroupUserList
    },
    created() {
      this.fetchGroupInfo()
    },
  }
</script>

<style lang="scss">
  .group-desc-com {
    height: 100%;
    width: 100%;
    border-left: 1px solid #cccccc;

    .notice {
      height: 50%;
      border-bottom: 1px solid #cccccc;
    }

    .member {
      height: 50%;
    }
  }
</style>
