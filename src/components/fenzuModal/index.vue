<template>
  <div class="fenzhu-modal-cmp all0">
    <div class="switch-fenzu hor-ver-center" v-loading="confirmLoading">
      <div class="header">
        <span class="p-l-t">
          <span class="secondary-font">&nbsp;&nbsp;&nbsp;所有分组如下：</span>
        </span>
        <span class="p-r-t el-icon-close" @click="close"></span>
      </div>
      <div class="fenzu-list">
        <el-radio-group v-model="selectFenZu" @change="modifyFenZu">
          <el-radio
            v-for="(item, index) in fenZuKeys"
            :key="index" class="item"
            :label="item"
            v-model="selectFenZu">
            {{item}}（{{userInfo.friendFenZu[item].length}}）
          </el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['currentConversation'],
    data() {
      return {
        selectFenZu: "",
        confirmLoading: false,
        isShowAddFenZu: false
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      },
      fenZuKeys() {
        return Object.keys(this.userInfo.friendFenZu)
      },
      currentFenZu() {
        const fenZuIdsMap = this.userInfo.friendFenZu
        let res = ''
        this.fenZuKeys.forEach(item => {
          if ((fenZuIdsMap[item] || []).includes(this.currentConversation.id)) {
            res = item
          }
        })
        return res
      }
    },
    methods: {
      async modifyFenZu() {
        if (!this.selectFenZu) return
        this.confirmLoading = true
        const params = {
          userId: this.userInfo.uid,
          friendId: this.currentConversation.id,
          newFenZuName: this.selectFenZu
        }
        const fenZuRes = await this.$http.modifyFriendFenZu(params)
        if (fenZuRes.data.code === 2000) {
          const res = await this.$http.getUserInfo(this.userInfo.uid)
          this.$store.dispatch('user/LOGIN', res.data.data.userInfo)
          this.confirmLoading = false
        }
      },
      close() {
        this.$emit('hidden-fenzu')
      }
    },
    mounted() {
      this.selectFenZu = this.currentFenZu
    },
  }
</script>

<style lang="scss">
  .v-modal {
    display: none;
  }

  .fenzhu-modal-cmp {
    position: fixed;
    z-index: 2003;
    background-color: rgba(0, 0, 0, .2);

    .switch-fenzu {
      width: 300px;
      padding: 40px 20px 20px;
      background-color: #fff;
      border-radius: 10px;

      .fenzu-list {
        .item {
          display: block;
          margin-top: 20px;
          position: relative;

          &:first-child {
            margin-top: 0;
          }

          .oper {
            position: absolute;
            left: 100%;
          }
        }
      }

      .footer {
        margin-top: 20px;
      }
    }
  }
</style>

