import request from '@/utils/request'

export default {
  /**登录 */
  login(data) {
    return request.post(`/api/user/login`, data)
  },
  /**获取验证码 */
  getCVCode() {
    return request.get(`/api/user/getCode`)
  },
  /** 用户注册 */
  register(data) {
    return request.post(`/api/user/register`, data)
  },
  /**获取用户详情 */
  getUserInfo(uid) {
    return request.get(`/api/user/getUserInfo?uid=${uid}`)
  },
  /**获取用户（搜索） */
  preFetchUser(data) {
    return request.post(`/api/user/preFetchUser`, data)
  },
  /**添加分组 */
  addNewFenZu(data) {
    return request.post(`/api/user/addFenZu`, data)
  },
  /**修改好友所在的分组 */
  modifyFriendFenZu(data) {
    return request.post(`/api/user/modifyFriendFenZu`, data)
  },
  /**修改好友的备注 */
  modifyFriendBeiZhu(data) {
    return request.post(`/api/user/modifyFriendBeiZhu`, data)
  },
  /** 删除分组 */
  deleteFenZu(data) {
    return request.delete(`/api/user/delFenZu`, {data: data}) //todo：待测试，参数只能放在data中
  },
  /** 编辑分组 */
  editFenZu(data) {
    return request.post(`/api/user/editFenZu`, data)
  },
  /**更新用户相关信息 */
  updateUserInfo(data) {
    return request.post(`/api/user/updateUserInfo`, data)
  },
  /**更新用户密码 */
  updateUserPwd(data) {
    return request.post(`/api/user/updateUserPwd`, data)
  },
  /** 更新用户的一些配置信息 */
  updateUserConfigure(data) {
    return request.post(`/api/user/updateUserConfigure`, data)
  }
}
