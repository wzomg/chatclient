<template>
  <div class="chat-area__message-list__com" ref="msglist">
    <div class="top-operations" ref="tips" :key="Date.now()">
      <!-- <span>没有更多消息了</span> -->
      <span v-if="hasmore">
        <span class="secondary-font operation-text" @click="loadMore">点击加载更多...</span>
        <i class="el-icon-loading" v-if="isloading"></i>
      </span>
      <span class="no-more secondary-font" v-else>没有更多了~</span>
    </div>
    <div class="top-operation" v-if="showTopOperation">
    </div>
    <transition-group appear name="hro-scroll">
      <!-- <transition-group appear :name="useanimation ? 'hro-scroll' : ''"> -->
      <message-item
        v-for="item in messagelist"
        :key="item.time"
        :messageitem="item"
        :img-type-msg-list="imgTypeMsgList"
        :currentConversation="currentConversation"
        :last-enter-time="lastEnterTime"
        :set-last-enter-time="setLastEnterTime"/>
    </transition-group>
    <div class="flag"></div>
  </div>
</template>

<script>
  import messageItem from "./MessageItem"
  import {debounce} from '@/utils'

  export default {
    // props: ["messagelist", "scrollbottom", "hasmore", "isloading", "useanimation", "currentConversation"],
    props: {
      messagelist: {
        type: Array
      },
      scrollbottom: {
        type: Boolean
      },
      hasmore: {
        type: Boolean
      },
      isloading: {
        type: Boolean
      },
      useanimation: {
        type: Boolean
      },
      currentConversation: {
        type: Object
      },
      lastEnterTime: {
        type: Number
      },
      setLastEnterTime: {
        type: Function
      }
    },
    data() {
      return {
        currentImgUrl: '',
        showTopOperation: false
      }
    },
    computed: {
      imgTypeMsgList() {
        return (this.messagelist || []).filter(item => item.messageType === 'img')
      }
    },
    methods: {
      loadMore() {
        this.$emit('load-message', true)
      },
      handlerScroll: debounce(function () {
        const scrollTop = this.$refs['msglist'].scrollTop
        if (scrollTop < 5) {
          this.$emit('load-message', true)
        }
      }, 500)
    },
    components: {
      messageItem
    },
    watch: {
      messagelist: {
        handler() {
          if (this.scrollbottom) {
            this.$nextTick(() => {
              setTimeout(() => {
                // this.$refs['msglist'].scrollTop = this.$refs['msglist'].scrollHeight + 200
                const lastItem = document.querySelector('.chat-area__message-item__com:last-child')
                lastItem && lastItem.scrollIntoView()
                setTimeout(() => {
                  this.$refs['tips'].style.opacity = "1"
                }, 100)
              }, 0)
            })
          }
        }, deep: true, immediate: true
      }
    },
  };
</script>

<style lang="scss">
  @import './../../../../static/css/animation.scss';

  .chat-area__message-list__com {
    .top-operations {
      text-align: center;
    }

    box-sizing: border-box;
    height: 100%;
    overflow-y: scroll;
    padding: 10px;
  }
</style>

