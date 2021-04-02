import request from '@/utils/request'

export default {
  /** 获取我的好友列表 */
  getMyFriendsList(userId) {
    return request.get(`/api/goodFriend/getMyFriendsList?userId=${userId}`)
  },
  /** 查询最近的好友列表 */
  getRecentConversationList(data) {
    return request.post(`/api/goodFriend/recentConversationList`, data)
  },
  /** 删除好友 */
  deleteGoodFriend(data) {
    return request.delete(`/api/goodFriend/deleteGoodFriend`, {data: data})
  }
}
