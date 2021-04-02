<template>
  <div class="conversation-top-search-cmp">
    <search placeholder="请输入搜索内容" @search="search">
    </search>
  </div>
</template>

<script>
  import search from '@/components/search'

  export default {
    data() {
      return {
        group: [], /**搜索出来的群聊（已加入的） */
        friendList: [], /**搜索出来的好友 */
      }
    },
    methods: {
      async search(keyword) {
        this.$message({type: 'info', message: '搜索好友或群聊功能尚未开发，敬请期待！'})
        console.log(keyword)
        // const {data} = await this.$http.topSearch({
        //   pageSize: 0,
        //   pageIndex: 0,
        //   type: 'code',
        //   searchContent: '1'
        // })
        // console.log(data)
      },
    },
    components: {
      search
    }
  }
</script>
