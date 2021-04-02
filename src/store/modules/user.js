
const state = {
  isLogin: JSON.parse(window.sessionStorage.getItem('isLogin') || "false"),
  userInfo: JSON.parse(window.localStorage.getItem('userInfo') || '{}')
}

const mutations = {
  login(state, data) {
    state.isLogin = true
    state.userInfo = data
    let dataString = JSON.stringify(data)
    // console.log("存放在store的用户信息为：", dataString)
    window.localStorage.setItem('userInfo', dataString)
    window.sessionStorage.setItem('isLogin', true)
  },
  logout(state) {
    state.isLogin = false
    state.userInfo = ''
    window.localStorage.setItem('userInfo', '')
    window.sessionStorage.setItem('isLogin', false)
  }
}

const actions = {
  LOGIN({commit}, data) {
    commit('login', data)
  },
  LOGOUT({commit}, data) {
    commit('logout', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
