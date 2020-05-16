<template>
  <div class>
    <van-nav-bar title="客户信息" left-arrow @click-left="onClickLeft">
      <template #right>
        <div class="nav_right">{{text}}</div>
      </template>
    </van-nav-bar>
    <div class="header" v-for="(v, index) in list" :key="index" @click="goDetails(v)">
      <div class="header_l">
        <div class="header_h">
          <div class="header_t fl">{{v.F_FullName}}</div>
          <div class="header_btn fl" v-if="v.F_PowerType!==null">{{v.F_PowerType}}</div>
        </div>
        <div class="header_f">
          <span>负责人：{{v.F_SmsName1}}</span>
          <p>联系方式：{{v.F_SmsNumber1}}</p>
        </div>
      </div>
      <div class="line"></div>
      <div class="header_r" @click.stop="openMap(v.F_CustomAddressGis,v.F_CustomAddress)" v-fb>
        <img src="../../assets/img/Map.png" alt />
        定位
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      list: [],
      text: 0,
      show: false,
      lat: '',
      lon: '',
      gis: '',
      address: ''
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.list = JSON.parse(localStorage.getItem('custorm'))
    this.text = this.list.length
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goDetails (item) {
      this.$router.push({
        path: '/infoDetails',
        query: {
          info: JSON.stringify(item)
        }
      })
    },
    openMap (gis, address) {
      this.gis = gis
      this.address = address
      if (this.gis === null || this.gis === '') {
        // eslint-disable-next-line no-undef
        this.$toast({
          message: '暂无定位',
          className: 'error'
        })
        return false
      }
      this.lon = this.gis.slice(0, this.gis.indexOf(','))
      this.lat = this.gis.slice(this.gis.indexOf(',') + 1)
      var url = ''
      // eslint-disable-next-line no-undef
      if (plus.os.name === 'Android') {
        // eslint-disable-next-line no-undef
        var hasBaiduMap = plus.runtime.isApplicationExist({ pname: 'com.baidu.BaiduMap', action: 'baidumap://' })
        // eslint-disable-next-line no-undef
        var hasAmap = plus.runtime.isApplicationExist({ pname: 'com.autonavi.minimap', action: 'androidamap://' })
        // eslint-disable-next-line no-undef
        var urlBaiduMap = 'baidumap://map/marker?location=' + this.lat + ',' + this.lon + '&title=' + this.address + '&src=Hello%20uni-app'
        var urlAmap = 'androidamap://viewMap?sourceApplication=Hello%20uni-app&poiname=' + this.address + '&lat=' + this.lat + '&lon=' + this.lon + '&dev=0'
        if (hasAmap && hasBaiduMap) {
          // eslint-disable-next-line no-undef
          plus.nativeUI.actionSheet({ title: '选择地图应用', cancel: '取消', buttons: [{ title: '百度地图' }, { title: '高德地图' }] }, (e) => {
            switch (e.index) {
              case 1:
                // eslint-disable-next-line no-undef
                plus.runtime.openURL(urlBaiduMap)
                break
              case 2:
                // eslint-disable-next-line no-undef
                plus.runtime.openURL(urlAmap)
                break
            }
          })
        } else if (hasAmap) {
          // eslint-disable-next-line no-undef
          plus.runtime.openURL(urlAmap)
        } else if (hasBaiduMap) {
          // eslint-disable-next-line no-undef
          plus.runtime.openURL(urlBaiduMap)
        } else {
          url = 'geo:' + this.lat + ',' + this.lon + '?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82'
          // eslint-disable-next-line no-undef
          plus.runtime.openURL(url) // 如果是国外应用，应该优先使用这个，会启动google地图。这个接口不能统一坐标系，进入百度地图时会有偏差
        }
      } else {
        // iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）
        // eslint-disable-next-line no-undef
        plus.nativeUI.actionSheet({ title: '选择地图应用', cancel: '取消', buttons: [{ title: 'Apple地图' }, { title: '百度地图' }, { title: '高德地图' }] }, (e) => {
          console.log('e.index: ' + e.index)
          switch (e.index) {
            case 1:
              url = 'http://maps.apple.com/?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82&ll=' + this.lat + ',' + this.lon + '&spn=0.008766,0.019441'
              break
            case 2:
              url = 'baidumap://map/marker?location=' + this.lat + ',' + this.long + '&title=' + this.address + '&src=Hello%20uni-app'
              break
            case 3:
              url = 'iosamap://viewMap?sourceApplication=Hello%20uni-app&poiname=' + this.address + '&lat=' + this.lat + '&lon=' + this.lon + '&dev=0'
              break
            default:
              break
          }
          if (url !== '') {
            // eslint-disable-next-line no-undef
            plus.runtime.openURL(url, (e) => {
              // eslint-disable-next-line no-undef
              this.$toast({
                message: '本机未安装指定的地图应用',
                className: 'error'
              })
            })
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
.nav_right {
  width: 30px;
  height: 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 11px;
  border: 1px solid rgba(188, 188, 188, 1);
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: rgba(188, 188, 188, 1);
  top: 50%;
  position: relative;
  transform: translateY(-50%);
}
.header {
  position: relative;
  width: 335px;
  height: 120px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
  overflow: hidden;
  .header_l {
    width: 252px;
    margin: 15px 15px 0;
    .header_h {
      .header_t {
        max-width: 135px;
        word-wrap: break-word;
        font-size: 10px !important;
        color: rgba(47, 47, 47, 1);
      }
      .header_btn {
        width: 90px;
        height: 22px;
        font-size: 10px;
        background: #dff5ee;
        border-radius: 14px;
        color: #51ad8e;
        margin-left: 10px;
        text-align: center;
        line-height: 22px;
      }
    }
    .header_f {
      margin-top: 10px;
      clear: both;
      span,
      p {
        font-size: 10px;
        color: rgba(137, 145, 155, 1);
      }
      p {
        margin-top: 6px;
      }
    }
  }
  .line {
    position: absolute;
    width: 1px;
    height: 71px;
    background: #ededed !important;
    right: 81px;
    top: 50%;
    transform: translateY(-50%);
  }
  .header_r {
    position: absolute;
    width: 58px;
    height: 25px;
    border-radius: 13px;
    border: 1px solid rgba(63, 183, 175, 1);
    text-align: center;
    line-height: 25px;
    color: rgba(61, 150, 144, 1);
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    img {
      float: left;
      margin: 6px -6px 0 9px;
    }
  }
}
.content {
  padding: 16px;
  text-align: center;
}
</style>
