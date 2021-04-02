<template>
  <div class="pop-ups">
    <user-profile v-if="isShowUserProfile" :friend-info="friendInfo" :visible="isShowUserProfile"/>
    <group-profile v-if="isShowGroupProfile" :group-info="groupInfo" :visible="isShowGroupProfile"/>
    <fenzu-modal
      v-if="isShowFenZuModal"
      :current-conversation="currentConversation"
      @hidden-fenzu="hiddenFenZuModal"/>
    <beizhu-modal
      v-if="isShowBeiZhuModal"
      :current-conversation="currentConversation"/>
    <transition name="fade">
      <bearing-modal
        v-if="showModal && isShowCreateGroup"
        @close="$eventBus.$emit('toggleCreateGroup', { show: false })"
        title="创建群聊"
        :width="400">
        <template slot="body">
          <create-group/>
        </template>
      </bearing-modal>
    </transition>
    <message-text-menu
      v-if="isShowMsgTextMenu"
      :message="currentMessage"
      :left="msgTextMenuLeft"
      :top="msgTextMenuTop"
    />
  </div>
</template>

<script>
  import './../static/css/animation.scss'
  import userProfile from '@/components/userProfile'
  import groupProfile from '@/components/groupProfile'
  import fenzuModal from '@/components/fenzuModal'
  import beizhuModal from '@/components/beizhuModal'
  import createGroup from '@/components/createGroup'
  import bearingModal from '@/components/bearingModal'
  import messageTextMenu from '@/components/messageTypes/messageTextMenu'

  export default {
    data() {
      return {
        showModal: false,
        isShowUserProfile: false,
        isShowGroupProfile: false,
        isShowFenZuModal: false,
        isShowBeiZhuModal: false,
        isShowCreateGroup: false,
        isShowMsgTextMenu: false,
        friendInfo: {}, //好友信息
        groupInfo: {}, //群聊信息
        currentConversation: {}, // 当前操作的会话
        currentMessage: {}, // 当前操作的消息
        msgTextMenuLeft: 0,
        msgTextMenuTop: 0

      }
    },
    methods: {
      hiddenFenZuModal() {
        this.isShowFenZuModal = false
      },
      close() {
        this.showModal = false
      }
    },
    created() {
      this.$eventBus.$on('showUserProfile', (e) => {
        const {show, data} = e
        this.isShowUserProfile = show
        this.friendInfo = data.friendInfo
      })
      this.$eventBus.$on('showGroupProfile', (e) => {
        const {show, data} = e
        this.isShowGroupProfile = show
        this.groupInfo = data.groupInfo
      })
      this.$eventBus.$on('toggleFenZuModal', (e) => {
        const {show, data} = e
        this.isShowFenZuModal = show
        this.currentConversation = data.currentConversation || {}
      })
      this.$eventBus.$on('toggleBeiZhuModal', (e) => {
        const {show, data} = e
        this.isShowBeiZhuModal = show
        this.currentConversation = data.currentConversation || {}
      })
      this.$eventBus.$on('toggleCreateGroup', (e) => {
        const {show} = e
        this.showModal = show
        this.isShowCreateGroup = show
      })
      this.$eventBus.$on('toggleMsgTextMenu', (e) => {
        const {show, data, left, top} = e
        this.isShowMsgTextMenu = show
        this.currentMessage = data
        this.msgTextMenuLeft = left
        this.msgTextMenuTop = top
      })
    },
    components: {
      userProfile,
      groupProfile,
      fenzuModal,
      beizhuModal,
      createGroup,
      messageTextMenu,
      bearingModal
    }
  }
</script>
