import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/vant.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import md5 from 'js-md5'
axios.defaults.baseURL = '/api'
// 在request中展示进度条， NProgress.start()
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$md5 = md5
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
