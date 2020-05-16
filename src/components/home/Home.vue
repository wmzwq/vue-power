<template>
  <div class="">
    <router-view />
    <van-tabbar v-model="active" route class="footer">
      <van-tabbar-item name="home" replace to="/main">
        <van-icon class="iconfont homeshouye" />
        <p class="text">我的</p>
      </van-tabbar-item>
      <van-tabbar-item name="search" v-fb @click="goCamera">
        <div class="add">
          <div class="cross"></div>
          <div class="vertical"></div>
        </div>
      </van-tabbar-item>
      <van-tabbar-item name="friends" replace to="/my">
        <van-icon class="iconfont homeProfile" />
        <p class="text">我的</p>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      active: 'home'
    }
  },
  methods: {
    goCamera () {
      // 新建一个webview来启动扫一扫，不再$router.push()的跳转
      let h = location.href
      const n = h.indexOf('#')
      const r = h.substr(n)
      h = h.replace(r, '#/Scan')
      // eslint-disable-next-line no-undef
      const ws = plus.webview.create(h)
      ws.show()
    }
  }
}
</script>
<style scoped lang="less">
.van-tabbar-item--active {
  color: #41b6b1;
}
@supports (bottom: env(safe-area-inset-bottom)){
    body,
    .footer{
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
}
.text {
  font-size: 10px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
}
.add {
  position: relative;
  width: 48px;
  height: 48px;
  background: rgba(100, 205, 200, 1);
  border-radius: 24px;
  z-index: 999;
  margin-bottom: 34px;
}
.cross {
  position: absolute;
  width: 18px;
  height: 3px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  top: 22px;
  left: 15px;
}
.vertical {
  position: absolute;
  width: 3px;
  height: 18px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  top: 15px;
  left: 23px;
}
</style>
