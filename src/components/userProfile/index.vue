<template>
  <div class="user-profile all0">
    <transition name="fade" v-if="device !== 'Mobile'">
      <el-dialog
        :title="friendInfo.username + ' 的个人资料'"
        :visible.sync="visible"
        width="30%"
        class="userInfoTitle"
        :before-close="handleClose">
        <div style="height: 150px;vertical-align: center;text-align: left">
          <span class="userInfoSpan">
            <img
              :src="IMG_URL + friendInfo.photo"
              alt="用户头像"
              class="userInfoImg"
            />
          </span>
          <span class="userInfoText">
            <div>昵称：{{ friendInfo.nickname }}</div>
            <div>个性签名：{{ friendInfo.signature === '' ? '这个人很懒，什么都没有留下..': friendInfo.signature }}</div>
            <div>性别：{{ friendInfo.sex === 0 ? "男" : friendInfo.sex === 1 ? "女" : "保密"}}</div>
            <div>年龄：{{ friendInfo.age }}</div>
            <div>省份：{{ friendInfo.province && friendInfo.province.name }}</div>
            <div>城市：{{ friendInfo.city && friendInfo.city.name }}</div>
            <div>城镇：{{ friendInfo.town && friendInfo.town.name }}</div>
            <div v-if="friendInfo.email">邮箱：{{ friendInfo.email }}</div>
          </span>
        </div>
      </el-dialog>
    </transition>
    <transition name="fade" v-else-if="device === 'Mobile'">
      <el-dialog
        :title="friendInfo.username + ' 的个人资料'"
        :visible.sync="visible"
        width="80%"
        class="userInfoTitleMobile"
        :before-close="handleClose">
        <div style="vertical-align: center;text-align: center">
          <span class="userInfoSpanMobile">
            <img
              :src="IMG_URL + friendInfo.photo"
              alt="用户头像"
              class="userInfoImgMobile"
            />
          </span>
          <span class="userInfoTextMobile">
            <div>昵称：{{ friendInfo.nickname }}</div>
            <div>个性签名：{{ friendInfo.signature === '' ? '这个人很懒，什么都没有留下..': friendInfo.signature }}</div>
            <div>性别：{{ friendInfo.sex === 0 ? "男" : friendInfo.sex === 1 ? "女" : "保密"}}</div>
            <div>年龄：{{ friendInfo.age }}</div>
            <div>省份：{{ friendInfo.province && friendInfo.province.name }}</div>
            <div>城市：{{ friendInfo.city && friendInfo.city.name }}</div>
            <div>城镇：{{ friendInfo.town && friendInfo.town.name }}</div>
            <div v-if="friendInfo.email">邮箱：{{ friendInfo.email }}</div>
          </span>
        </div>
      </el-dialog>
    </transition>
  </div>
</template>

<script>

  export default {
    props: ["friendInfo", "visible"],
    data() {
      return {
        IMG_URL: process.env.IMG_URL,
      }
    },
    computed: {
      device() {
        return this.$store.state.device.deviceType
      },
    },
    methods: {
      handleClose() {
        this.$eventBus.$emit('showUserProfile', {
          data: {},
          visible: false
        })
      }
    }
  }
</script>

<style lang="scss">
  .el-dialog__body {
    padding-top: 0;
  }

  .user-profile {
    position: fixed;
    background-color: rgba(0, 0, 0, .2);
    z-index: 1007;
    text-align: center;

    .userInfoTitle {

      .userInfoSpan {
        display: inline-block;
        border-radius: 50%;
        height: 130px;

        vertical-align: center;

        .userInfoImg {
          height: 100%;
        }
      }

      .userInfoText {
        display: inline-block;
        padding-left: 30px;
        width: 60%;
        text-align: left;

        div {
          margin-top: 3px;
        }
      }
    }

    .userInfoTitleMobile {
      width: 100%;

      .userInfoSpanMobile {
        width: 100px;
        height: 100px;
        display: block;
        border-radius: 50%;
        vertical-align: center;
        margin: auto;

        .userInfoImgMobile {
          margin: 0 auto;
          height: 100%;
        }
      }

      .userInfoTextMobile {
        margin-top: 16px;
        display: block;
        width: 100%;
        text-align: left;

        div {
          margin-top: 3px;
        }
      }
    }
  }
</style>

