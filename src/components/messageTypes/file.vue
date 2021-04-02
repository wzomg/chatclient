<template>
  <div class="fileMessageBox">
    <img src="../../assets/img/file.png" alt="" class="fileImage">
    <span class="fileWord">
      <div :title="message.fileRawName">{{message.fileRawName.lastIndexOf('.') > 12 ? message.fileRawName.slice(0, 12) +
        '...' + message.fileRawName.slice(message.fileRawName.lastIndexOf('.')) : message.fileRawName}}</div>
      <div class="fileMessageSendSuccess">
        发送成功
      <i class="el-icon-success"></i>
      </div>
    </span>
  </div>
</template>

<script>
  import './../../../static/iconfont/iconfont.css'

  export default {
    props: ['message']
  }
</script>
<style lang="scss">
  .fileMessageBox {
    display: flex;
    justify-content: flex-start;
    align-content: center;

    .fileImage {
      width: 30%;
    }

    .fileWord {
      margin-left: 10px;

      .fileMessageSendSuccess {
        color: rgba(0, 0, 0, 0.5);
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }

</style>
