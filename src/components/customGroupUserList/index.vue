<template>
  <div class="custom-group-user-list-com">
    <header class="header">
      <span class="title">群成员（{{groupOnlineUser.length}}/{{userList.length}}）</span>
    </header>
    <div class="user-list">
      <div class="user-item" v-for="item in outcomeUserList" :key="item.id">
        <el-avatar
          :class="(onlineUser || []).includes(item.userInfo.uid) ? '' : 'offline'"
          :size="20"
          :src="IMG_URL + item.userInfo.photo"
          @error="() => true">
          <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
        </el-avatar>
        <div class="user-detail">
          <span class="normal-font detail-item ellipsis">
            {{item.userInfo.beiZhu ? item.userInfo.beiZhu : item.userInfo.nickname}}
          </span>
          <span class="is-holder secondary-font" v-if="item.holder">· 群主</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GroupUserListComponent",
    props: {
      userList: Array
    },
    data() {
      return {
        IMG_URL: process.env.IMG_URL
      }
    },
    computed: {
      onlineUser() { // 所有的在线用户
        return this.$store.state.app.onlineUser
      },
      groupOnlineUser() {
        return this.userList.filter(item => {
          return (this.onlineUser || []).includes(item.userInfo.uid)
        })
      },
      beiZhu() { // 备注Map {好友id1: 备注1, 好友id2: 备注2}
        return this.$store.state.user.userInfo.friendBeiZhu || {}
      },
      outcomeUserList() {
        const userList = JSON.parse(JSON.stringify(this.userList))
        return userList.map(item => {
          if (item.userInfo) {
            item.userInfo.beiZhu = this.beiZhu[item.userInfo.uid] ? this.beiZhu[item.userInfo.uid] : ''
          }
          return item
        }).sort((a, b) => {
          return b.holder - a.holder //倒序排，群主在最前面
        })
      }
    },
  };
</script>

<style lang="scss">
  .custom-group-user-list-com {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 5px;

    .header {
      width: 100%;
      padding: 5px 0;
    }

    .user-list {
      flex: 1;
      overflow: scroll;

      .user-item {
        padding: 5px 0;
        display: flex;
        align-items: center;

        .user-detail {
          width: 70%;
          margin-left: 5px;

          .is-holder {
            position: absolute;
            right: 5px;
          }
        }
      }
    }
  }
</style>

