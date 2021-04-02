<template>
  <div class="uploadPopover">
    <el-popover
      placement="top"
      width="250"
      trigger="manual"
      v-model="visible">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/api/sys/uploadFile"
        :limit="1"
        :headers="headers"
        :multiple="false"
        :file-list="fileList"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">传输</el-button>
        <div slot="tip" class="el-upload__tip">文件大小不超过1MB</div>
      </el-upload>
      <span slot="reference">
        <slot></slot>
    </span>
    </el-popover>
  </div>
</template>

<script>
  import {getCookie} from '@/utils/token'

  /**
   * 上传文件到云服务器
   */
  export default {
    props: ['visible'],
    data() {
      return {
        fileList: []
      };
    },
    computed: {
      headers() {
        return {
          "Authorization": getCookie() // 直接从本地获取token就行
        }
      }
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleSuccess(res, file) {
        this.$emit('handleSuccess', res, file);
        this.$refs.upload.clearFiles();
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$message.error('上传文件大小不能超过 1MB!');
        }
        return isLt1M;
      },
      handleError(err) {
        this.$message.error('文件上传失败!');
      }
    },
  }
</script>

<style lang="scss">
</style>
