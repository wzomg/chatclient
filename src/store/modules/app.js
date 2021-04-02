const state = {
  sysUsers: '' || JSON.parse(window.localStorage.getItem('sysUsers')),
  isToCoArtBoard: false, // 是否在白板协作
  isVideoing: false, //是否正在视频通话
  isAudioing: false, //是否正在语音通话
  currentConversation: {}, // 当前的会话，在白板协作、音视频通话会使用
  agreeFriendValidate: false, // 同意好友申请
  recentConversation: [], // 最近的会话列表
  onlineUser: [], // 在线用户
  allConversation: [], // 所有会话
  allFriends: [], // 所有的好友
}

const mutations = {
  setSysUsers(state, data) {
    state.sysUsers = data
    const dataStr = JSON.stringify(data)
    // console.log("store下的系统用户为：", dataStr)
    window.localStorage.setItem('sysUsers', dataStr)
  },
  setIsToCoArtBoard(state, data) {
    state.isToCoArtBoard = data
  },
  setIsAudioing(state, data) {
    state.isAudioing = data
  },
  setIsVideoing(state, data) {
    state.isVideoing = data
  },
  setCurrentConversation(state, data) {
    state.currentConversation = data
  },
  setAgreeFriendValidate(state, data) {
    state.agreeFriendValidate = data
  },
  setRecentConversation(state, data) {
    const res = data.data
    // console.log("vuex全局保存最近会话列表信息：", res, "其类型为：", data.type)
    // console.log("当前全局会话列表信息为：", state.recentConversation)
    if (data.type === 'init') {
      state.recentConversation = res
    } else if (data.type === 'add') {
      // console.log("vuex全局保存最近会话列表信息：", state.recentConversation)
      const ids = state.recentConversation.map(item => item.id)
      const newData = !ids.includes(res.id) ? [...state.recentConversation, res] : [...state.recentConversation] //判断是否重复
      // console.log("vuex全局保存最近会话列表信息（add）：", newData)
      state.recentConversation = newData
    } else if (data.type === 'delete') {
      const newData = JSON.parse(JSON.stringify(state.recentConversation))
      let index;
      if (res.groupInfo && res.groupInfo.gid) { //若是群聊，则根据roomId来过滤
        index = state.recentConversation.findIndex(item => item.roomId === res.roomId)
      } else {
        index = state.recentConversation.findIndex(item => item.id === res.id)
      }
      index !== -1 && newData.splice(index, 1)
      // console.log("待删除的会话在全局最近会话列表中的位置为：", index)
      // console.log("vuex全局保存最近会话列表信息（delete）：", newData)
      state.recentConversation = newData
    }
  },
  setOnlineUser(state, data) {
    state.onlineUser = data
  },
  setAllConversation(state, data) {
    state.allConversation = [...state.allConversation, ...data]
    // console.log("所有会话为：", state.allConversation)
  },
  setAllFriends(state, data) {
    const {resource, type} = data
    // console.log("setAllFriends：", resource, "type：", type)
    if (type === 'init') {
      // resourece === [{...}, {...}, ...]
      state.allFriends = resource
    } else if (type === 'delete') { //删除的时候resource带的是好友id
      // resource === 删除被好友ID
      state.allFriends = (state.allFriends || []).filter(item => item.id !== resource)
    }
  }
}

const actions = {
  SET_SYS_USERS({commit}, data) {
    commit('setSysUsers', data)
  },
  SET_ISTOCOARTBOARD({commit}, data) {
    commit('setIsToCoArtBoard', data)
  },
  SET_IS_AUDIOING({commit}, data) {
    commit('setIsAudioing', data)
  },
  SET_IS_VIDEOING({commit}, data) {
    commit('setIsVideoing', data)
  },
  SET_CURRENT_CONVERSATION({commit}, data) {
    commit('setCurrentConversation', data)
  },
  SET_AGREE_FRIEND_VALIDATE({commit}, data) {
    commit('setAgreeFriendValidate', data)
  },
  SET_RECENT_CONVERSATION({commit}, data) {
    commit('setRecentConversation', data)
  },
  SET_ONLINE_USER({commit}, data) {
    commit('setOnlineUser', data)
  },
  SET_ALL_CONVERSATION({commit}, data) {
    commit('setAllConversation', data)
  },
  SET_ALL_FRIENDS({commit}, data) {
    commit('setAllFriends', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
