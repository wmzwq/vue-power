<template>
  <div class>
    <van-nav-bar title="故障列表" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
      <template #right>
        <van-icon class="iconfont homeshaixuan" :color="color" size="18" v-fb />
      </template>
    </van-nav-bar>
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change" />
      </van-dropdown-menu>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <div class="flex" :key="index" v-for="(item, index) in list">
        <div class="fault">
          <div>
            <div>
              <div class="disposal_t" v-if="item.Talarmstatus===1">
                <img src="../../assets/img/fault_alarm.png" alt />
                <span>故障中</span>
              </div>
              <div class="disposal_t" v-if="item.Talarmstatus===0">
                <img src="../../assets/img/fault_normal.png" alt />
                <span class="textColor">已恢复</span>
              </div>
            </div>
            <div class="fault_time fr">
              <pre v-if="item.Talarmstatus===1">{{item.Tactivetime}}</pre>
              <pre v-if="item.Talarmstatus===0">{{item.Treturntime}}</pre>
            </div>
          </div>
          <div class="fault_t">
            <p>所属客户：{{item.CustomName}}</p>
            <p>配电房：{{item.RoomName}}</p>
            <p>设备名称：{{item.EquipmentName}}</p>
            <p>报警内容：{{item.Talarminformation}}</p>
          </div>
          <div class="fault_b">
            <div class="fault_btn" v-fb @click="getVideo(item.ParentCompanyId)">实时监测</div>
            <div class="fault_btn" v-fb @click="getScada(item.ParentCompanyId)">SCADA</div>
          </div>
        </div>
      </div>
    </van-list>
    <van-popup v-model="show" round :style="{ height: '30%' }">
      <div class="popup" :key="i" v-for="(v, i) in videoList" @click="open(v.URL)">{{v.DeviceName}}</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  components: {},
  created () {
    this.$loading()
  },
  data () {
    return {
      value: '',
      option: [],
      page: 1,
      list: [],
      color: '#D8D8D8',
      fault: '',
      loading: false,
      finished: false,
      error: false,
      show: false,
      videoList: []
    }
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.option = JSON.parse(localStorage.getItem('option'))
    this.getTasks()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    onClickRight () {
      this.$loading()
      if (this.fault === '') {
        this.fault = 1
        this.color = '#f58259'
      } else {
        this.fault = ''
        this.color = '#D8D8D8'
      }
      this.getTasks()
      this.$clear()
    },
    async getTasks () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/faultInfoList',
          this.$qs.stringify({
            data:
              "{'pagination':{rows:5,page: '" +
              this.page +
              "',sidx:'',sord:'ASC'},'queryJson':\"{'AppCustomId':'" +
              this.value +
              "','Falut':'" +
              this.fault +
              "'}\"} "
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
        this.list = res.data.rows[0]
        console.log(this.list)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async onLoad () {
      this.page = this.page + 1
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/faultInfoList',
          this.$qs.stringify({
            data:
              "{'pagination':{rows:5,page: '" +
              this.page +
              "',sidx:'',sord:'ASC'},'queryJson':\"{'AppCustomId':'" +
              this.value +
              "','Falut':'" +
              this.fault +
              "'}\"} "
          })
        )
        .catch(error => {
          console.log(error.message)
          this.error = true
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (res.data.rows[0].length < 5) {
          this.finished = true
        }
        this.list = [...this.list, ...res.data.rows[0]]
        console.log(this.list)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getScada (id) {
      this.$loading()
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/Scada',
          this.$qs.stringify({
            data: "{'AppCustomId':'" + id + "'} "
          })
        )
        .catch(error => {
          this.$clear()
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        this.$clear()
        // eslint-disable-next-line no-undef
        plus.runtime.openURL(res.data[0].scada)
      } else {
        this.$clear()
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }

      console.log(res)
    },
    async getVideo (id) {
      this.$loading()
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/Vdeio',
          this.$qs.stringify({
            data: "{'AppCustomId':'" + id + "'} "
          })
        )
        .catch(error => {
          this.$clear()
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        this.$clear()
        if (res.data.length === 0) {
          this.$toast({
            message: '暂无视频',
            className: 'warning'
          })
        } else {
          this.show = true
          this.videoList = res.data
        }
      } else {
        this.$clear()
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    open (url) {
      // eslint-disable-next-line no-undef
      plus.runtime.openURL(url)
      this.show = false
    },
    change () {
      this.$loading()
      console.log(this.value)
      this.getTasks()
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
.fault {
  width: 335px;
  height: 168px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.disposal_t {
  float: left;
  height: 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(245, 130, 89, 1);
  line-height: 12px;
  margin-top: 10px;
  margin-left: 15px;
  img {
    float: left;
  }
  span {
    float: left;
    margin-left: 4px;
  }
  .textColor {
    color: rgba(91, 161, 234, 1);
  }
}
.fault_time {
  width: 99px;
  height: 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 12px;
  margin-right: 35px;
  margin-top: 10px;
}
.fault_t {
  margin: 40px 0 0 33px;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
}
.fault_b {
  margin: 15px 33px;
}
.fault_btn {
  width: 74px;
  height: 29px;
  border-radius: 14px;
  border: 1px solid rgba(82, 190, 183, 1);
  display: inline-block;
  text-align: center;
  line-height: 29px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(61, 150, 144, 1);
  margin-right: 29px;
}
.popup {
  width: 335px;
  height: 35px;
  text-align: center;
  padding-top: 20px;
  border-bottom: 1px solid #eee;
  font-size: 16px;
}
</style>
