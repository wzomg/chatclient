// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSocketIO from 'vue-socket.io'
import ClientSocketIO from 'socket.io-client'
import 'normalize.css/normalize.css'
import App from './App'
import router from './router'
import Toast from './components/toast/main.js'
import axios from './api'
import store from './store'
import directives from './directives'
import './../static/css/base.scss'
import './../static/css/var.scss'
import './../static/css/theme.scss'

let fullCalendar = require('./libs/fullCalendar/fullCalendar');

Vue.use(ElementUI)
Vue.component('full-calendar', fullCalendar.VueFullcalendar)

// socket连接
Vue.use(new VueSocketIO({
  // debug: true,
  connection: ClientSocketIO.connect(process.env.SOCKET_URL, {
    transports: ['websocket']
  }),
}))

// 注册全局指令
Object.keys(directives).forEach(i => Vue.directive(i, directives[i]))

Vue.config.productionTip = false
Vue.prototype.$toast = Toast
Vue.prototype.$http = axios
Vue.prototype.$eventBus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
