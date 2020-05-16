<template>
  <div class="">
    <van-nav-bar
      title="GIS定位"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="addressKeyword" :options="option" @change="change"/>
      </van-dropdown-menu>
    </div>
    <baidu-map
      class="map"
      @ready="handler"
      :center="location"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      :map-click="false"
    >
      <bm-view class="bmView"></bm-view>
      <!--比例尺控件-->
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_LEFT" :showAddressBar="true" :autoLocation="true" @locationSuccess="locationSuccess"></bm-geolocation>
      <!--缩放控件-->
      <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
      <!-- <bm-local-search :keyword="addressKeyword" :auto-viewport="true" style="display: none"></bm-local-search> -->
      <bml-marker-clusterer :averageCenter="true">
        <div v-for="(marker, i) of markers" :key="i">
          <bm-marker
            :position="{ lng: marker.lng, lat: marker.lat }"
            @click="infoWindowOpen(marker)"
          >
            <bm-info-window
              class="marker"
              :position="{ lng: marker.lng, lat: marker.lat }"
              :show="marker.showFlag"
              @close="infoWindowClose(marker)"
              @open="infoWindowOpen(marker)"
            >
              <div class="marker_t">
                <p>{{marker.companyName}}</p>
                <p>{{marker.transformerRoom}}</p>
              </div>
              <div class="marker_b" @click.stop="openMap(marker.location,marker.companyName)" v-fb>导航</div>
            </bm-info-window>
          </bm-marker>
        </div>
      </bml-marker-clusterer>
    </baidu-map>
  </div>
</template>

<script>
// 按需引入点聚合
import { BmlMarkerClusterer } from 'vue-baidu-map'
import BmView from 'vue-baidu-map/components/map/MapView.vue'
// 引入marker
import BmMarker from 'vue-baidu-map/components/overlays/Marker'
export default {
  name: 'Bmaptrace',
  components: {
    BmlMarkerClusterer,
    BmView,
    BmMarker
  },
  data () {
    return {
      location: {
        lng: 120.665673,
        lat: 27.979261
      },
      zoom: 5,
      BMap: '',
      map: '',
      markers: [],
      show: false,
      addressKeyword: '',
      lat: '',
      lon: '',
      gis: '',
      address: '',
      option: []
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.option = JSON.parse(localStorage.getItem('option'))
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    locationSuccess (point) {
      this.location.lat = point.point.lat
      this.location.lng = point.point.lng
      console.log(point)
    },
    handler ({ BMap, map }) {
      map.enableScrollWheelZoom(true)
      //   map.centerAndZoom('青岛市', 13)
      // 赋值，方便调用，本节没用到
      this.BMap = BMap
      this.map = map
    },
    // 关闭信息窗口 @close 自带的方法
    infoWindowClose (marker) {
      marker.showFlag = false
      //   console.log(marker)
    },
    // 首先点击marker时开启信息窗口，其实没必要在 bm-info-window 上写 @open 因为如果是关闭状态根本就点不到，所以就无法触发 @open
    // 如果在 bm-info-window 上写了 @open 在点击marker时会触发两次infoWindowOpen函数，而且可以很明显的看到有延时
    infoWindowOpen (marker) {
      marker.showFlag = true
      //   console.log(marker)
    },
    async getList () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/GetLocationVerify',
        this.$qs.stringify({
          data: "{'AppCustomId':'" + this.addressKeyword + "'} "
        })
      ).catch(error => {
        console.log(error.message)
        this.show = false
        this.$toast({
          message: '请求超时，请检查网络',
          className: 'error'
        })
      })
      if (res.code === 200) {
        this.markers = []
        res.data.forEach(item => {
          if (item.location !== null) {
            this.markers.push({ location: item.location, lng: item.location.split(',')[0], lat: item.location.split(',')[1], showFlag: false, companyName: item.companyName, transformerRoom: item.transformerRoom })
          }
        })
        console.log(this.markers)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
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
    },
    change () {
      this.$loading()
      this.getList()
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .van-dropdown-menu {
  width: 335px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin-top: 15px;
  font-size: 12px;
  z-index: 999;
}
/deep/.van-dropdown-menu__title {
  font-size: 12px;
  margin-right: 152px;
  max-width: 180px;
  min-width: 160px;
}
/deep/.van-dropdown-menu__title::after {
  left: 300px;
}
/deep/.van-dropdown-menu__title {
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
}
.marker_t {
  display: inline-block;
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
  p{
    max-width: 150px;
  }
}
.marker_b {
  width: 50px;
  height: 26px;
  border-radius: 14px;
  border: 1px solid rgba(82, 190, 183, 1);
  color: #52beb7;
  font-size: 12px;
  text-align: center;
  line-height: 26px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;
}
.marker {
  width: 200px;
}
/deep/ .BMap_noprint {//隐藏左下角百度地图logo
bottom: 70px !important;
}
.bmView{
  width: 100%; height:100%; flex: 1;position:absolute;top:46px
}
</style>
