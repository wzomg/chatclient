<template>
  <div class="oper-menu">
    <el-dropdown placement="left">
      <span class="el-dropdown-link">
        <el-badge is-dot :value="validateUnReadCount" :hidden="!validateUnReadCount">
          <i class="oper-item el-icon-s-operation"></i>
        </el-badge>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link to="/chat/setting" class="aside-menu-link">
            <el-button type="text">个人设置</el-button>
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-badge
            :value="validateUnReadCount"
            :hidden="!validateUnReadCount">
            <router-link to="/chat/system" class="aside-menu-link">
              <el-button type="text">系统消息</el-button>
            </router-link>
          </el-badge>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button type="text" @click="setShowTheme(true)">主题设置</el-button>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button type="text" @click="showFeedBackDialog">反馈</el-button>
          <!--          <router-link to="/chat/feedback" class="aside-menu-link">-->
          <!--            <el-button type="text">反馈</el-button>-->
          <!--          </router-link>-->
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button type="text" @click="logout">退出登录</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="反馈面板"
      :visible.sync="showFeedBack"
      width="60%">
      <div v-loading="loading">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入反馈内容"
          v-model="feedBackContent">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="showFeedBack = false">取 消</el-button>
      <el-button type="primary" @click="feedBack">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import {removeCookie} from '@/utils/token'

  export default {
    data() {
      return {
        showFeedBack: false,
        loading: false,
        feedBackContent: ''
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      },
      unreadNews() {
        return this.$store.state.news.unreadNews
      },
      validateUnReadCount() {
        const validateSysUser = (this.$store.state.app.sysUsers || []).find(item => item.code === '111111')
        const key = (validateSysUser || {}).sid + '-' + (this.userInfo || {}).uid
        return this.unreadNews[key]
      }
    },
    methods: {
      logout() {
        this.$confirm("确认登出", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$message({
            type: "success",
            message: "登出成功！",
          });
          this.$router.replace("/login");
          this.$socket.emit("leave");
          this.$store.dispatch("user/LOGOUT");
          removeCookie(); //删除客户端的 token
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消登出！",
          });
        });
      },
      setShowTheme(flag) {
        this.$emit('setShowTheme', flag)
      },
      showFeedBackDialog() {
        this.showFeedBack = !this.showFeedBack
      },
      feedBack() {
        if (this.feedBackContent === '') {
          this.$message({type: 'error', message: '请输入反馈内容！'})
        } else {
          this.loading = true
          this.$http.addFeedBack({
            userId: this.userInfo.uid,
            username: this.userInfo.username,
            feedBackContent: this.feedBackContent
          }).then(res => {
            this.loading = false
            this.showFeedBack = false
            this.feedBackContent = ''
            this.$alert('感谢您的反馈！', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            })
          })
        }
      }
    },
  }
</script>

<style lang="scss">
  .oper-menu {
    .menu-item {
      display: block;
    }
  }
</style>
