// const localData = window.localStorage.getItem('unreadnewslist')
// const initState = localData ? JSON.parse(localData) : []
/**
 * unreadNewsList: {roomId: count1, roomId: count2, ...}
 */
import {SET_UNREAD_NEWS_TYPE_MAP} from './../constants'

const state = {
  unreadNews: {},
  lastNews: {}, // 好友之间最后发送的一条消息 {roomId1: {}, roomId2: {}}
  userIsReadMsg: { // 好友是否已读你发送的消息
  }
}

/**
 * 提交data的格式：{roomId: '标识消息对应的房间id', count: '标识未读数', type: 'ADD\CLEAR\REPLACE'}
 */
const mutations = {
  setUnreadNews(state, data) {
    const {roomId, count, type} = data
    // console.log("设置未读消息：", data, "其类型为：", type, "数量为：", count)
    if (type === SET_UNREAD_NEWS_TYPE_MAP.add) { //未读消息加1
      const oldCount = state.unreadNews[roomId] === undefined ? 0 : state.unreadNews[roomId]
      const item = {[roomId]: oldCount + 1}
      state.unreadNews = Object.assign({}, state.unreadNews, item)
    } else if (type === SET_UNREAD_NEWS_TYPE_MAP.clear) { //清除未读消息
      const item = {[roomId]: 0}
      state.unreadNews = Object.assign({}, state.unreadNews, item)
    } else { //其余情况，默认 roomId -> count
      const item = {[roomId]: count}
      state.unreadNews = Object.assign({}, state.unreadNews, item)
    }
  },
  setLastNews(state, data) {
    // console.log("设置最后一条信息：", data.res, "其类型为：", data.type)
    if (data.type === 'init') {
      state.lastNews = data.res
    } else if (data.type === 'concat') {
      state.lastNews = Object.assign({}, state.lastNews, data.res)
    } else if (data.type === 'edit') {
      const {roomId, news} = data.res
      const item = {[roomId]: news}
      state.lastNews = Object.assign({}, state.lastNews, item)
    } else if (data.type === 'default') { // 判断是否为新添加的会话
      const {roomId} = data
      if (roomId in state.lastNews) return
      const item = {[roomId]: {time: Date.now(), messageType: 'text', message: ''}}
      state.lastNews = Object.assign({}, state.lastNews, item)
    }
  },
  setUserIsReadMsg(state, data) {
    const {roomId, status} = data
    const newData = {...state.userIsReadMsg} || {}
    for (const key in newData) {
      if (newData.hasOwnProperty(key)) {
        newData[key] = false
      }
    }
    // console.log("全局设置用户已读消息：", newData)
    newData[roomId] = status
    state.userIsReadMsg = newData
  }
}

const actions = {
  SET_UNREAD_NEWS({commit}, data) {
    commit('setUnreadNews', data)
  },
  SET_LAST_NEWS({commit}, data) {
    commit('setLastNews', data)
  },
  SET_USER_IS_READ_MSG({commit}, data) {
    commit('setUserIsReadMsg', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
