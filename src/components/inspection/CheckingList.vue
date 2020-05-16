<template>
  <div class="">
    <van-nav-bar title="巡检列表" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <div class="distance">
        <van-dropdown-menu>
          <van-search v-model="value1" placeholder="请输入搜索内容" @search="searchGoods" @cancel="onCancel"/>
          <van-dropdown-item v-model="value" :options="option" @change="change"/>
        </van-dropdown-menu>
      </div>
    </div>
    <div class="flex" v-for="(v, i) in checkingList" :key="i" @click="goInfo(v.F_Status,v.F_Id)">
      <div class="main">
        <div class="top">
            <img src="../../assets/img/xjlb.png" v-if="v.F_Status===2" />
            <img src="../../assets/img/xjlb2.png" v-else />
          <div class="top_t">
            <p class="p1">{{v.F_FullName}}</p>
            <p class="p2">{{v.F_Number}}</p>
          </div>
          <div class="top_b" @click.stop="openMap(v.F_Location,v.F_FullName)" v-fb>定位</div>
        </div>
        <div class="line"></div>
        <div class="fl">
          <div class="fl box">
            <img src="../../assets/img/xjsj.png" alt="" />
            <span>{{v.F_CreateDate}}</span>
          </div>
          <div class="fl box">
            <img src="../../assets/img/ic_type.png" alt="" />
               <span v-if="v.F_DispatchType==='2'">临时巡检</span>
            <span v-if="v.F_DispatchType==='1'">定期巡检</span>
          </div>
          <div class="fl box">
            <img src="../../assets/img/ic_status.png" v-if="v.F_Status===2" />
            <img src="../../assets/img/ic_finish.png" v-else/>
            <span v-if="v.F_Status===0">未领取</span>
            <span v-if="v.F_Status===1">待完成</span>
            <span v-if="v.F_Status===2">已完成</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  created () {
    this.$loading()
    this.getCheckingList('')
  },
  // inject: ['reload'],
  data () {
    return {
      checkingList: [],
      isRouterAlive: true,
      show: false,
      value1: '',
      value: '',
      lat: '',
      lon: '',
      gis: '',
      address: '',
      option: [
        {
          value: '',
          text: '全部'
        },
        {
          value: '0',
          text: '未领取'
        },
        {
          value: '1',
          text: '待完成'
        },
        {
          value: '2',
          text: '已完成'
        }
      ]
    }
  },
  beforeUpdate () {
    this.$clear()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    searchGoods () {
      this.$loading()
      this.getCheckingList(this.value1)
      this.$clear()
    },
    loacate () {
      this.show = true
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
    async getCheckingList (query) {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/CheckingList',
          this.$qs.stringify({
            data: "{'AppCustomId':'" + this.$route.query.id + "','Type':'" + this.value + "','AppQuery':'" + query + "'} "
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
        this.checkingList = res.data
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    goInfo (status, id) {
      if (status === 0) {
        this.$router.push({
          path: '/checkingInformation',
          query: {
            id: id
          }
        })
      } else if (status === 1) {
        this.$router.push({
          path: '/performed',
          query: {
            id: id
          }
        })
      } else {
        this.$router.push({
          path: '/checkingHistory',
          query: {
            id: id
          }
        })
      }
    },
    change () {
      this.$loading()
      this.getCheckingList()
    },
    onCancel () {
      this.value1 = ''
    }
  }
}
</script>
<style scoped lang="less">
.van-search {
  position: absolute;
  width: 270px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
}
.van-search__content {
  background-color: #fff;
}
/deep/ .van-dropdown-menu {
  width: 335px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin-top: 15px;
  font-size: 12px;
}
/deep/.van-dropdown-menu__title {
  font-size: 12px;
  margin-left: 270px;
  z-index: 9999;
  min-width:40px;
  text-align: right;

}
.main {
  width: 335px;
  height: 120px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.top {
  height: 79px;
}
.top img {
  float: left;
  width: 49px;
  margin: 15px 0 0 15px;
}
.top_t {
  float: left;
  margin: 20px 0 0 10px;
}
.p1 {
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
}
.p2 {
  font-size: 10px;
  font-weight: 400;
  color: rgba(137, 145, 155, 1);
}
.top_b {
  float: right;
  width: 54px;
  height: 25px;
  border-radius: 13px;
  border: 1px solid rgba(63, 183, 175, 1);
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(61, 150, 144, 1);
  margin: 15px 15px 0 0;
}
.line {
  width: 335px;
  height: 1px;
  background-color: #90ccc8;
}
.box {
  margin: 14px 0 14px 16px;
}
.box img {
  float: left;
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.box span {
  float: left;
  font-size: 10px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
}
.distance {
  margin: 5px 20px 0;
}
.content {
  padding: 16px;
  text-align: center;
}
</style>
