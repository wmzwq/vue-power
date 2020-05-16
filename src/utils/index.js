import Vue from 'vue'
// 导入有赞轻提示
import { Toast } from 'vant'
import 'vant/lib/index.css'
Vue.use(Toast)
export const loading = () => {
  Toast.loading({
    // mask: true, //蒙层
    duration: 0, // 持续展示 toast
    forbidClick: true, // 禁用背景点击
    loadingType: 'spinner',
    message: '加载中...'
  })
}
export const clear = () => {
  Toast.clear()
}
