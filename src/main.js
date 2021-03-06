import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/vant.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import md5 from 'js-md5'
import BaiduMap from 'vue-baidu-map'
import VueDND from 'awe-dnd'
import vueTouch from 'kim-vue-touch'
import qs from 'qs'
import 'lib-flexible'
// 添加Fastclick移除移动端点击延迟
import FastClick from 'fastclick'
// 移动端触摸反馈指令
import vueFeedback from 'vue-feedback'
// 物理返回键
import mui from 'vue-awesome-mui'
// 手写签名
import vueSignature from 'vue-signature'
import { loading, clear } from '../src/utils/index'
import echarts from 'echarts'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// 转场动画
import vueg from 'vueg'
// axios.defaults.baseURL = '/api'
axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://122.228.89.215:8897/'
// 请求拦截器
axios.interceptors.request.use(function (config) {
  var configUrl = config.url.slice(config.url.indexOf('/') + 1)
  if (config.method === 'post' && configUrl !== 'InspectionIsGlasow' && configUrl !== 'InspectionIsPicture' && configUrl !== 'Picture' && configUrl !== 'Glasow' && configUrl !== 'PersonInfoPicture' && configUrl !== 'PersonalEmergencyRepairReport' && configUrl !== 'DefectPicture' && configUrl !== 'DefectGlasow') {
    config.data = 'loginMark=' + localStorage.getItem('loginMark') + '&token=' + localStorage.getItem('token') + '&' + config.data
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应成功拦截器
axios.interceptors.response.use(config => {
  return config
})
FastClick.attach(document.body)
Vue.use(BaiduMap, {
  /* 需要注册百度地图开发者来获取你的ak */
  ak: 'BUUWGn8LdqbjlQG9Rm37h2piIdXTOZBW'
})

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
Vue.prototype.$echarts = echarts
Vue.prototype.$loading = loading
Vue.prototype.$clear = clear
Vue.use(vueSignature)
Vue.use(mui)
Vue.use(vueFeedback)
Vue.use(vueTouch)
Vue.use(VueDND)
Vue.prototype.$qs = qs
Vue.prototype.$md5 = md5
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
const options = {
  duration: '0', // 转场动画时长，默认为0.3，单位秒
  firstEntryDisable: false, // 值为true时禁用首次进入应用时的渐现动画，默认为false
  firstEntryDuration: '.6', // 首次进入应用时的渐现动画时长，默认为.6
  forwardAnim: 'fadeInRight', // 前进动画，默认为fadeInRight
  backAnim: 'fadeInLeft', // 后退动画，默认为fedeInLeft
  sameDepthDisable: false, // url深度相同时禁用动画，默认为false
  tabs: [{
    name: 'Main'
  }, {
    name: 'My'
  }], // 默认为[]，name对应路由的name,以实现类似app中点击tab页面水平转场效果，如tab[1]到tab[0]，会使用backAnim动画，tab[1]到tab[2]，会使用forwardAnim动画
  tabsDisable: false, // 值为true时，tabs间的转场没有动画，默认为false
  disable: false // 禁用转场动画，默认为false，嵌套路由默认为true
}
Vue.use(vueg, router, options)
