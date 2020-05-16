<template>
  <div id="app" v-cloak>
    <transition :name="transitionName">
      <router-view v-if="isRouterAlive"></router-view>
    </transition>
  </div>
</template>

<script>
import BMap from 'BMap'
export default {
  name: 'app',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      transitionName: 'van-slide-right',
      checked1: false,
      checked: false,
      timer: '',
      F_UserId: ''
    }
  },
  destroyed () {
    clearInterval(this.timer)
    this.websock.close() // 离开路由之后断开websocket连接
  },
  async mounted () {
    if (localStorage.getItem('checked1') === 'true') {
      this.checked1 = true
      this.timer = setInterval(this.getLocation, 30000)
    }
    if (localStorage.getItem('checked') === 'true') {
      this.checked = true
      const { data: res } = await this.$http
        .post(
          'UserAppInfo/GetPageListAPP'
        )
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        this.F_UserId = res.data.rows[0].F_UserId
        this.initWebSocket()
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    }
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.matched.length
      const fromDepth = from.matched.length
      this.transitionName = toDepth < fromDepth ? 'van-slide-right' : 'van-slide-left'
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    getLocation () {
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition((r) => {
        // eslint-disable-next-line no-unused-vars
        var map = new BMap.Map('')
        var pointA = new BMap.Point(
          parseFloat(r.point.lng),
          parseFloat(r.point.lat)
        )
        var ggPoint = new BMap.Point(pointA.lng, pointA.lat)
        var pointArr = []
        pointArr.push(ggPoint)
        var convertor = new BMap.Convertor()
        convertor.translate(pointArr, 1, 5, async data => { // 回调函数
          if (data.status === 0) {
            console.log(data)
            var MaintenanceMap = data.points[0].lng + ',' + data.points[0].lat
            const { data: res } = await this.$http
              .post(
                'MaintenanceMapTrack/SaveForm',
                this.$qs.stringify({
                  data: "{\"strEntity\":\"{'F_MaintenanceMap':'" + MaintenanceMap + "'}\"}"
                })
              )
              .catch(error => {
                console.log(error.message)
                this.$toast({
                  message: '请求超时，请检查网络',
                  className: 'error'
                })
              })
            if (res.code === 200) {
            } else {
              this.$toast({
                message: res.info,
                className: 'error'
              })
            }
            console.log(res)
          }
        })
      })
    },
    initWebSocket () { // 初始化weosocket
      const wsuri = 'ws://122.228.89.215:8182/echo'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      console.log('websocketonopen')
      var senddata = '{"Cmd":"powerregister","UserId":"' + this.F_UserId + '","Type":"alarmplus,repair"}'
      this.websocketsend(senddata)
    },
    websocketonerror () { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
      var msg = { title: redata.Message.HardwareInfo.F_CustomName, content: redata.Message.Talarminformation }
      this.createLocalPushMsg(msg)
      console.log(redata)
    },
    websocketsend (Data) { // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
    },
    // 创建本地消息
    createLocalPushMsg (msg) {
      var options = { cover: false }
      // eslint-disable-next-line no-undef
      plus.push.createMessage(msg.content, 'LocalMSG', options)
      // eslint-disable-next-line no-undef
      if (plus.os.name === 'iOS') {
        // eslint-disable-next-line no-undef
        outLine(
          '*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!'
        )
      }
    }
  }
}
</script>

<style scope lang="less">
[v-cloak] {
  display: none !important;
}
</style>
