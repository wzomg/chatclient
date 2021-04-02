<template>
  <div class="schedule-page">
    <full-calendar
      ref="calendar"
      :events="events"
      locale="zh-cn"
      lang="zh"
      @changeMonth="changeMonth"
      @eventClick="eventClick"
      @dayClick="dayClick"
      @moreClick="moreClick">
      <template slot="fc-header-left">
        <div>
          <p>日程管理</p>
        </div>
      </template>
      <template slot="fc-event-card" slot-scope="p">
        <el-popover
          placement="bottom"
          :title="p.event.title"
          width="200"
          trigger="click">
          <p style="border-top: 2px solid green;font-size: 0.5rem;font-family: 'Times New Roman', Times, serif;padding-top: 5px">
            时间：{{formatTime(p.event.start)}} 至 {{formatTime(p.event.end)}}
            <div style="text-align: right;padding-right: 3px">
               <i class="el-icon-delete" style="cursor:pointer" :size="14" @click="delTodo(p.event['_id'])"></i>
            </div>
          </p>
          <p slot="reference" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap">
            <span>{{p.event.title}}</span>
          </p>
        </el-popover>
      </template>
    </full-calendar>
    <el-dialog
      title="请输入待办事项"
      :visible.sync="showAddEvent"
      :width="device === 'Mobile' ? '100%' : '35%'"
      center>
      <el-form :model="eventForm" :rules="rules" ref="eventForm" label-width="100px">
        <el-form-item label="事项名称" prop="title" required>
          <el-input v-model="eventForm.title"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="start" required>
          <el-date-picker type="date" placeholder="选择日期" v-model="eventForm.start" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="eventForm.end"
            :picker-options="endOptions"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="事项级别" class="matter-level">
          <el-tag
            class="item"
            v-for="item in matterLevels"
            :key="item.label"
            :type="item.type"
            :effect="eventForm.cssClass === item.type ? 'dark' : 'plain'"
            @click="handleClick(item.type)">
            {{ item.label }}
          </el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddEvent">取 消</el-button>
        <el-button type="primary" @click="addEvent('eventForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { fromatTime } from '@/utils'
  export default {
    data() {
      return {
        events: [],
        showAddEvent: false,
        eventForm: {
          title: '',
          start: '',
          end: '',
          cssClass: 'normal'
        },
        rules: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          start: [
            {  required: true, message: '请选择日期', trigger: 'change' }
          ]
        },
        matterLevels: [
          { type: 'danger', label: '紧急事项' },
          { type: 'warning', label: '重要事项' },
          { type: 'normal', label: '一般事项' },
          { type: 'info', label: '不重要事项' },
        ]
      }
    },
    computed: {
      endOptions() {
        const that = this
        return {
          disabledDate(time) { //设置的结束时间不能小于开始时间
            return time.getTime() < new Date(that.eventForm.start).getTime()
          },
        }
      },
      device() {
        return this.$store.state.device.deviceType
      }
    },
    methods: {
      delTodo(id) {
        this.$confirm('确认删除该日程记录吗？', '确认信息')
          .then(() => {
            this.events = this.events.filter(v => id !== v['_id']);
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            window.localStorage.setItem('todo', JSON.stringify(this.events))
          }).catch(action => {
        });
      },
      formatTime(t) {
        return fromatTime(new Date(t), false);
      },
      addEvent(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const item = {...this.eventForm}
            this.events = [...this.events, item]
            // console.log("当前所有日程信息为：", this.events)
            this.showAddEvent = false
            this.eventForm.title = this.eventForm.start = this.eventForm.end = ""
            window.localStorage.setItem('todo', JSON.stringify(this.events))
          } else {
            this.showAddEvent = true
          }
        })
      },
      cancelAddEvent() {
        this.eventForm.title = this.eventForm.start = this.eventForm.end = ""
        this.showAddEvent = false
      },
      changeMonth(e) {
        // console.log('changeMonth', e)
      },
      eventClick(e) {
        //监听打开的事件
        // console.log('eventClick', e)
      },
      dayClick(e) {
        // console.log("日期的e：", e)
        this.eventForm.start = e //设置表单时间的起始时间
        this.showAddEvent = true
      },
      moreClick(e) {
        // console.log('moreClick', e)
      },
      handleClick(type) {
        this.eventForm.cssClass = type
      }
    },
    created() {
      const accept = JSON.parse(window.localStorage.getItem('accept'))
      if (!accept) {
        this.$confirm('你的代办日程保存在本地，并不会同步到后端', '提示', {
          confirmButtonText: '我已了解并使用',
          cancelButtonText: '我不接受使用',
          type: 'warning'
        }).then(() => {
          window.localStorage.setItem('accept', true)
          const events = JSON.parse(window.localStorage.getItem('todo'))
        }).catch(() => {
          this.$router.go(-1)
          window.localStorage.setItem('accept', false)
        });
      }
      const events = JSON.parse(window.localStorage.getItem('todo')) || []
      this.events = events
    },
  }
</script>

<style lang="scss">
  .schedule-page {
    width: 100%;
    height: calc(100vh - 60px);
    overflow: hidden;
    .danger {
      background-color: #f56c6c !important;
      color: #ffffff !important;
    }
    .warning {
      background-color: #e6a23c !important;
      color: #ffffff !important;
    }
    .normal {
      background-color: #409eff !important;
      color: #ffffff !important;
    }
    .info {
      background-color: #909399;
      color: #ffffff !important;
    }
    .el-dialog__body {
      .matter-level {
        .item {
          cursor: pointer;
          margin-right: 10px;
        }
      }
    }


    .todoInfo{
      font-size: 12px;
      color: #323232;
      font-family: "Times New Roman", Times, serif;
      margin-bottom: 5px;
    }

    .todoTitle { // 单行文字超出省略号
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>


