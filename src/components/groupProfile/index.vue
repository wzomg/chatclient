<template>
  <div class="group-profile all0">
    <transition name="fade" v-if="device !== 'Mobile'">
      <el-dialog
        :title="groupInfo.title"
        :visible.sync="visible"
        width="30%"
        class="groupInfoTitle"
        :before-close="handleClose">
        <div style="height: 150px;vertical-align: center;text-align: left">
          <span class="groupInfoSpan">
            <img
              :src="IMG_URL + groupInfo.img"
              alt="群头像"
              class="groupInfoImg"
            />
          </span>
          <span class="groupInfoText">
            <div>群号码：{{ groupInfo.code }}</div>
            <div>群名称：{{ groupInfo.title }}</div>
            <div>群主账号：{{ groupInfo.holderName }}</div>
            <div>群人数：{{ groupInfo.userNum }}</div>
            <div>群描述：{{ groupInfo.desc }}</div>
            <div>本群创建于{{ groupInfo.createDate | formatDateToZH }}</div>
          </span>
        </div>
      </el-dialog>
    </transition>
    <transition name="fade" v-else-if="device === 'Mobile'">
      <el-dialog
        :title="groupInfo.title"
        :visible.sync="visible"
        class="groupInfoTitleMobile"
        :before-close="handleClose">
        <div style="vertical-align: center;text-align: center">
          <span class="groupInfoSpanMobile">
            <img
              :src="IMG_URL + groupInfo.img"
              alt="群头像"
              class="groupInfoImgMobile"/>
          </span>
          <span class="groupInfoTextMobile">
            <div>群号码：{{ groupInfo.code }}</div>
            <div>群名称：{{ groupInfo.title }}</div>
            <div>群主账号：{{ groupInfo.holderName }}</div>
            <div>群人数：{{ groupInfo.userNum }}</div>
            <div>群描述：{{ groupInfo.desc }}</div>
            <div>本群创建于{{ groupInfo.createDate | formatDateToZH }}</div>
          </span>
        </div>
      </el-dialog>
    </transition>
  </div>
</template>

<script>
  import {formatDateToZH} from '@/utils'

  export default {
    props: ["groupInfo", "visible"],
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
        this.$eventBus.$emit('showGroupProfile', {
          data: {},
          visible: false
        })
      }
    },
    filters: {
      formatDateToZH(val) {
        return formatDateToZH(val)
      }
    },
  }
</script>

<style lang="scss">
  .el-dialog__body {
    padding-top: 0;
  }

  .el-dialog {
    width: 65%;
  }

  .group-profile {
    position: fixed;
    background-color: rgba(0, 0, 0, .2);
    z-index: 1007;
    text-align: center;

    .groupInfoTitle {

      .groupInfoSpan {
        display: inline-block;
        border-radius: 50%;
        height: 130px;

        vertical-align: center;

        .groupInfoImg {
          height: 100%;
        }
      }

      .groupInfoText {
        display: inline-block;
        padding-left: 30px;
        width: 60%;
        text-align: left;

        div {
          margin-top: 3px;
        }
      }
    }

    .groupInfoTitleMobile {
      width: 100%;

      .groupInfoSpanMobile {
        width: 100px;
        height: 100px;
        display: block;
        border-radius: 50%;
        vertical-align: center;
        margin: auto;


        .groupInfoImgMobile {
          margin: 0 auto;
          height: 100%;
        }
      }

      .groupInfoTextMobile {
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

