<template>
  <div class="group-conversation-list">
    <el-collapse v-model="activeFenZu">
      <el-collapse-item
        v-for="item in groupCategory"
        :key="item.id"
        :title="`${item.text}（${groupCategoryMap[item.category].length}）`"
        :name="item.category">
        <conversation-item
          v-for="item in groupCategoryMap[item.category]"
          :key="item.id"
          :conversationInfo="item"
          type="fenzu"
          @click.native="changeCurrentConversation(item)"/>
      </el-collapse-item>
    </el-collapse>
    <div class="create">
      <i
        title="创建群聊"
        class="el-icon-circle-plus box-shadow1 circle"
        @click="createGroup"
      />
    </div>
  </div>
</template>

<script>
  import {conversationTypes} from '@/const'
  import {saveMyGroupToLocalStorage} from '@/utils'
  import conversationItem from './ConversationItem'

  export default {
    props: ['currentConversation', 'setCurrentConversation'],
    data() {
      return {
        conversationList: [],
        activeFenZu: '',
        groupCategory: [
          {id: 0, category: 'myHolderGroup', text: '我创建的群聊'},
          {id: 1, category: 'myManagerGroup', text: '我管理的群聊'},
          {id: 2, category: 'myJoinGroup', text: '我加入的群聊'}
        ]
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      },
      myHolderGroup() {
        return this.conversationList.filter(item => item.holder)
      },
      myManagerGroup() {
        return this.conversationList.filter(item => item.manager)
      },
      myJoinGroup() {
        return this.conversationList.filter(item => !item.holder && !item.manager)
      },
      groupCategoryMap() {
        return {
          myHolderGroup: this.myHolderGroup,
          myManagerGroup: this.myManagerGroup,
          myJoinGroup: this.myJoinGroup
        }
      }
    },
    methods: {
      async getMyGroup() {
        const userName = this.userInfo.username
        const {data, status} = await this.$http.getMyGroupList(userName)
        if (data.code === 2000 && (100 <= status <= 400)) {
          let myGroupList = data.data.myGroupList
          // console.log("返回结果的群聊列表为：", myGroupList)
          myGroupList.forEach(item => {
            item.conversationType = conversationTypes.group
            item.isGroup = true
            item.roomId = item.groupInfo.gid //房间id就是群id
          })
          this.conversationList = myGroupList
          this.$store.dispatch('app/SET_ALL_CONVERSATION', this.conversationList)
          const saveLocalData = myGroupList.map(item => item.groupInfo.gid)
          saveMyGroupToLocalStorage(saveLocalData)
        }
      },
      createGroup() {
        this.$eventBus.$emit('toggleCreateGroup', {show: true})
      },
      changeCurrentConversation(item) {
        // console.log("当前的子会话为：", item)
        this.$emit('setCurrentConversation', item)
      },
      joinChatRoom() {
        // console.log("准备加入房间时的会话列表为：", this.conversationList)
        this.conversationList.forEach(item => {
          this.$socket.emit("join", item) //此处有添加到房间号
        })
      }
    },
    watch: {
      conversationList: { //获取我的群聊列表时，将gid添加到房间中
        handler() {
          this.joinChatRoom()
        }, deep: true, immediate: true
      },
    },
    components: {
      conversationItem
    },
    mounted() {
      this.$eventBus.$on('getMyGroups', () => { //添加好友后，重新请求一下数据
        this.getMyGroup()
      })
    },
    beforeDestroy() {
      this.$eventBus.$off("getMyGroups")
    },
    created() {
      this.getMyGroup()
      this.$eventBus.$on('createGroupSuccess', () => { //创建群聊之后，重新请求一下数据
        this.getMyGroup()
      })
    },
  }
</script>

<style lang="scss">
  .group-conversation-list {
    height: 510px;
    overflow-x: hidden;

    .create {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 40px;
      color: hsla(201, 100%, 55%, 1);
      cursor: pointer;
    }
  }
</style>
