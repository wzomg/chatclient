import request from '@/utils/request'

export default {
  getMyValidateMessageList(userId) {
    return request.get(`/api/validate/getMyValidateMessageList?userId=${userId}`)
  },
  getValidateMessage(data) {
    const {roomId, status, validateType} = data
    return request.get(`/api/validate/getValidateMessage?roomId=${roomId}&status=${status}&validateType=${validateType}`)
  }
}
