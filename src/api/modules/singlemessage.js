import request from '@/utils/request'

export default {
  /**
   * 获取最近的单聊消息
   */
  getRecentSingleMessages(data) {
    const {roomId, pageIndex, pageSize} = data
    return request.get(`/api/singleMessage/getRecentSingleMessages?roomId=${roomId}&pageIndex=${pageIndex}&pageSize=${pageSize}`)
  },

  /**
   * 获取好友之间的最后一条聊天记录
   */
  getLastMessage(roomId) {
    return request.get(`/api/singleMessage/getLastMessage?roomId=${roomId}`)
  },

  /**
   * 当用户在切换会话阅读消息后，标记该消息已读
   */
  userIsReadMessage(data) {
    return request.post(`/api/singleMessage/isRead`, data)
  },

  /**
   * 获取单聊历史记录
   */
  getSingleHistoryMessages(data) {
    return request.post(`/api/singleMessage/historyMessage`, data)
  }
}
