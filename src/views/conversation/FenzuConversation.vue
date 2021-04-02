<template>
  <div class="fenzu-conversation-list">
    <el-collapse v-model="activeFenZu">
      <el-collapse-item
        v-for="(item, index) in fenZu"
        :key="index"
        :name="item"
        :data-title="item">
        <template slot="title">
          <span v-if="currEditFenZu !== item" @contextmenu.prevent="handlerCollapseItemClick($event, item)">
            {{outcomeConversation[item] && `${item}（${fenZuOnlineUserNum[item]}/${outcomeConversation[item].length}）`}}
          </span>
          <el-input
            v-else style="margin-right: 20px"
            v-model="currEditFenZuTo" size="mini"
            @keydown.enter.native="confirmEdit"/>
        </template>
        <conversation-item
          v-for="item in outcomeConversation[item]"
          :key="item.id"
          :conversationInfo="item"
          @click.native="changeCurrentConversation(item)"
          type="fenzu"
        />
      </el-collapse-item>
    </el-collapse>
    <fenzu-menu v-if="showMenu" :top="menuTop" :left="menuLeft"
                @deleteFenZu="deleteFenZuItem" @close="closeFenZuMenu"
                @editFenZu="setEditFenZu"
    />
  </div>
</template>

<script>
  import {saveMyFriendsToLocalStorage} from '@/utils'
  import {conversationTypes} from '@/const'
  import conversationItem from './ConversationItem'
  import fenzuMenu from './FenzuMenu'

  export default {
    props: ['currentConversation', 'setCurrentConversation'],
    data() {
      return {
        conversationList: [],
        activeFenZu: '',
        menuTop: 0,
        menuLeft: 0,
        showMenu: false,
        currClickFenZu: '', // 当前点击的分组
        currEditFenZu: '', // 当前编辑的分组
        currEditFenZuTo: '', // 被编辑分组的新名字
        newFenZu: '' // 新添加分组的名称
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      },
      onlineUserIds() { // 在线用户的id数组
        return this.$store.state.app.onlineUser
      },
      fenZu() { // 用户的分组列表
        return this.newFenZu ? Object.keys(this.userInfo.friendFenZu || {}).concat(this.newFenZu) : Object.keys(this.userInfo.friendFenZu || {})
      },
      beiZhu() { // 备注map
        return this.userInfo.friendBeiZhu || {}
      },
      friendsList() {
        return this.$store.state.app.allFriends
      },
      hasBeiZhuList() { // 给会话列表加上分组
        const conversationList = JSON.parse(JSON.stringify(this.friendsList)) //从全局取出刚刚请求得到的所有好友列表
        const offlineUsers = []
        const onlineUsers = []
        // console.log("给会话列表加上分组1：", conversationList)
        conversationList.forEach(item => {
          item.beiZhu = this.beiZhu[item.id] ? this.beiZhu[item.id] : ''
          this.onlineUserIds.includes(item.id) ? onlineUsers.push(item) : offlineUsers.push(item)
        })
        // console.log("会话列表中在线用户有：", onlineUsers)
        return [...onlineUsers, ...offlineUsers]
      },
      outcomeConversation() { // 根据分组来分类不同的好友
        const conversationList = JSON.parse(JSON.stringify(this.hasBeiZhuList))
        const fenZuMap = this.userInfo.friendFenZu // {分组1: [id1, id2, ...], 分组2: [id3, id4, ...]}
        const fenZuKeys = Object.keys(fenZuMap) // [分组1, 分组2, ...]
        const res = {}
        fenZuKeys.forEach(item => {
          res[item] = []
        })
        for (let i = 0; i < conversationList.length; i++) {
          const item = conversationList[i]
          fenZuKeys.forEach(fenZuItem => {
            if (fenZuMap[fenZuItem].includes(item.id)) {
              res[fenZuItem].push(item)
              conversationList.splice(i, 1)
              i--
            }
          })
        }
        if (conversationList.length) { //删除到最后，剩下的会话列表中的数据就是我的好友这个分组
          res['我的好友'] = [...res['我的好友'], ...conversationList]
        }
        // console.log("分组后的列表为：", res)
        return res
      },
      fenZuOnlineUserNum() { // 计算每个分组的在线用户
        const res = {}
        const obj = this.outcomeConversation
        for (const key in obj) {
          // console.log("计算每个分组的在线用户：", key, obj)
          if (obj.hasOwnProperty(key)) {
            let num = 0
            const itemIds = obj[key].map(item => item.id)
            itemIds.forEach(id => {
              this.onlineUserIds.includes(id) && num++
            })
            res[key] = num
          }
        }
        return res
      }
    },
    methods: {
      /** 获取所有的好友 */
      async getMyFriends() {
        const uid = this.userInfo.uid
        const {data, status} = await this.$http.getMyFriendsList(uid)
        if (data.code === 2000 && (100 <= status <= 400)) {
          let myFriendsList = data.data.myFriendsList
          myFriendsList.forEach(item => {
            item.conversationType = conversationTypes.friend
            item.myNickname = this.userInfo.nickname
            item.myId = this.userInfo.uid
            item.myAvatar = this.userInfo.photo
          })
          this.conversationList = myFriendsList
          this.$store.dispatch('app/SET_ALL_CONVERSATION', myFriendsList) //合并全局会话列表
          this.$store.dispatch('app/SET_ALL_FRIENDS', { //在全局设置所有好友的数据
            resource: myFriendsList,
            type: 'init'
          })
          // 把好友的id保存到本地，可能会用到
          const saveLocalData = myFriendsList.map(item => {
            return item.id
          })
          saveMyFriendsToLocalStorage(saveLocalData)
          //重新更新一下分组人数的统计
          const uInfo = await this.$http.getUserInfo(this.userInfo.uid)
          // console.log("获取所有的好友中当前登录的用户信息为：", uInfo.data.data.userInfo)
          this.$store.dispatch('user/LOGIN', uInfo.data.data.userInfo)
        }
      },
      changeCurrentConversation(item) {
        this.$emit('setCurrentConversation', item)
      },
      joinChatRoom() {
        this.conversationList.forEach(item => { //将好友列表的roomId添加到当前客户端的房间中
          this.$socket.emit("join", item)
        })
      },
      handlerCollapseItemClick(e, item) {
        e.preventDefault()
        const {button} = e
        if (button !== 2) return
        this.showMenu = true
        this.menuLeft = e.pageX
        this.menuTop = e.pageY
        this.currClickFenZu = item
      },
      closeFenZuMenu() {
        this.showMenu = false
      },
      async deleteFenZuItem() {
        if (this.currClickFenZu === '我的好友') {
          return this.$message({
            message: '该分组是默认分组，不能删除',
            type: 'warning'
          })
        }
        const params = {fenZuName: this.currClickFenZu, userId: this.userInfo.uid}
        await this.$http.deleteFenZu(params)
        const res = await this.$http.getUserInfo(this.userInfo.uid)
        this.$store.dispatch('user/LOGIN', res.data.data.userInfo)
      },
      setEditFenZu() {
        this.currEditFenZu = this.currEditFenZuTo = this.currClickFenZu
      },
      async confirmEdit() {
        if (this.currEditFenZu === '我的好友') {
          this.currEditFenZu = ''
          return this.$message({type: 'warning', message: '默认分组不能修改！'})
        }
        const {data} = await this.$http.editFenZu({
          oldFenZu: this.currEditFenZu,
          newFenZu: this.currEditFenZuTo,
          userId: this.userInfo.uid
        })
        if (data.code === 2000) {
          //重新更新用户信息
          const res = await this.$http.getUserInfo(this.userInfo.uid)
          this.$store.dispatch('user/LOGIN', res.data.data.userInfo)
          this.$message({type: 'success', message: '修改成功！'})
        } else {
          this.$message({type: 'error', message: '修改失败！'})
        }
      }
    },
    watch: {
      conversationList: {
        handler() {
          this.joinChatRoom()
        }, deep: true, immediate: true
      },
    },
    components: {
      conversationItem,
      fenzuMenu
    },
    mounted() {
      this.$eventBus.$on("getMyFriends", () => {
        this.getMyFriends()
      })
    },
    beforeDestroy() {
      this.$eventBus.$off("getMyFriends")
    },
    created() {
      this.getMyFriends()
      document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('el-input__inner')) {
          this.currEditFenZu = ''
        }
        if (!e.target.classList.contains('el-popover__reference')) {
          this.showMenu = false
        }
      })
    },
  }
</script>

<style lang="scss">
  .fenzu-conversation-list {
    height: 461px;
    overflow-x: hidden;
  }
</style>
