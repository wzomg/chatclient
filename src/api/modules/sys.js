import request from '@/utils/request'

export default {
  //获取系统用户
  getSysUsers() {
    return request.get(`/api/sys/getSysUsers`)
  },
  // 获取天气信息
  getWeather(city) {
    return request.get(`http://wthrcdn.etouch.cn/weather_mini?city=${city}`)
  },
  /** 获取注册时的头像 */
  getFaceImages() {
    return request.get(`/api/sys/getFaceImages`)
  },
  /**上传文件 */
  uploadFile(data) {
    return request.post(`/api/sys/uploadFile`, data)
  },
  /** 获取图片的真实路径 */
  getRealFilePath(fileId) {
    return request.get(`/api/sys/getRealFilePath?fileId=${fileId}`)
  },
  /** 添加反馈信息 */
  addFeedBack(data) {
    return request.post(`/api/sys/addFeedBack`, data)
  },
  /** 搜索好友或加过的群聊 */
  topSearch(keyword) {
    return request.get(`/api/sys/topSearch?keyword=${keyword}`)
  },
  /** 过滤发送的消息 */
  filterMessage(message) {
    return request.get(`/api/sys/filterMessage?message=${message}`)
  }
}
