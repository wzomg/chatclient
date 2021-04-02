import request from '@/utils/request'

export default {
  /**
   * 根据用户名获取其对应的群聊，用户名在user实体中对应name字段
   */
  getMyGroupList(username) {
    return request.get(`/api/group/getMyGroupList?username=${username}`)
  },
  /**
   * 根据id获取群聊详情
   */
  getGroupInfo(groupId) {
    return request.get(`/api/group/getGroupInfo?groupId=${groupId}`)
  },
  /**
   * 根据条件搜索群聊
   */
  preFetchGroup(data) {
    return request.post(`/api/group/preFetchGroup`, data)
  },
  /**
   * 创建群聊
   */
  createGroup(data) {
    return request.post(`/api/group/createGroup`, data)
  },
  /** 获取最近的群聊 */
  getRecentGroup(data) {
    return request.post(`/api/group/recentGroup`, data)
  },
  /**
   * 获取最近的群消息
   */
  getRecentGroupMessages(data) {
    const {roomId, pageIndex, pageSize} = data
    return request.get(`/api/groupMessage/getRecentGroupMessages?roomId=${roomId}&pageIndex=${pageIndex}&pageSize=${pageSize}`)
  },
  /**
   * 获取群聊历史记录
   */
  getGroupHistoryMessages(data) {
    return request.post(`/api/groupMessage/historyMessages`, data)
  },
  /**
   * 获取群最后一条消息
   */
  getGroupLastMessage(roomId) {
    return request.get(`/api/groupMessage/lastMessage?roomId=${roomId}`)
  },
  /**
   * 退出或解散群聊
   */
  quitGroup(data) {
    return request.post(`/api/group/quitGroup`, data)
  }
}
