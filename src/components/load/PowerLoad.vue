<template>
  <div class>
    <van-nav-bar title="用电负荷" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change" />
      </van-dropdown-menu>
    </div>
    <div class="flex">
      <div class="curveCard">
        <div class="disposal_t">电量概括</div>
        <div class="flex2">
          <div class="powerSum">
            <div class="summary">
              <p class="summary_p">当前负荷</p>
            </div>
            <div class="sum">
              {{now}}
              <p>KVA</p>
            </div>
          </div>
          <div class="powerSum">
            <div class="summary">
              <p class="summary_p">负荷比率</p>
            </div>
            <div class="sum">{{rate}}</div>
          </div>
          <div class="powerSum">
            <div class="summary">
              <p class="powerCurve_cen">日最高</p>
            </div>
            <div class="sum">
              {{max}}
              <p>KVA</p>
            </div>
          </div>
          <div class="powerSum">
            <div class="summary">
              <p class="powerCurve_cen">日均值</p>
            </div>
            <div class="sum">
              {{avg}}
              <p>KVA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex" @click="goDetails">
      <div class="powerCurve">
        <div>
          <div class="disposal_t">逐时曲线</div>
          <div class="powerCurve_t">
            <div class="powerCurve_title">
              <div class="powerCurve_yg"></div>
              <span class="powerCurve_gt">今日</span>
            </div>
            <div class="powerCurve_title">
              <div class="powerCurve_yg powerCurve_color"></div>
              <span class="powerCurve_gt">昨日</span>
            </div>
          </div>
        </div>
        <div id="hourly"></div>
      </div>
    </div>
    <div class="flex" @click="goCounts">
      <div class="powerCurve">
        <div>
          <div class="disposal_t">逐日曲线</div>
          <div class="powerCurve_t">
            <div class="powerCurve_title">
              <div class="powerCurve_yg"></div>
              <span class="powerCurve_gt">日最高</span>
            </div>
            <div class="powerCurve_title">
              <div class="powerCurve_yg powerCurve_color"></div>
              <span class="powerCurve_gt">日均值</span>
            </div>
          </div>
        </div>
        <div id="day"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  components: {},
  data () {
    return {
      value: '',
      option: [],
      avg: 0,
      max: 0,
      now: 0,
      rate: 0,
      xdata: [],
      maxdata: [],
      avgdata: [],
      xdata1: [],
      today: [],
      yesterday: []
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
    this.getDayCurve()
    this.getHourlyCurve()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goCounts () {
      this.$router.push('/loadCounts')
    },
    goDetails () {
      this.$router.push('/loadDetails')
    },
    change () {
      console.log(this.value)
      this.$loading()
      this.getList()
      this.getDayCurve()
      this.getHourlyCurve()
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ElectricLoadElectricQuantityOverview',
          this.$qs.stringify({
            data: "{'AppCustomId':'" + this.value + "'} "
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
        if (res.data[0].length !== 0) {
          this.avg = res.data[0].avg.toFixed(2)
          this.max = res.data[0].max.toFixed(2)
          this.now = res.data[0].now.toFixed(2)
          if (res.data[0].rate === 'NaN') {
            this.rate = 0
          } else {
            this.rate = res.data[0].rate.toFixed(2)
          }
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getDayCurve () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/DayCurve',
          this.$qs.stringify({
            data: "{'AppCustomId':'" + this.value + "'} "
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
        this.xdata = []
        this.maxdata = []
        this.avgdata = []
        if (res.data.length !== 0) {
          res.data.forEach(item => {
            this.xdata.push(item.Key)
            this.maxdata.push(item.MaxPFifteen)
            this.avgdata.push(item.AveragePFifteen)
          })
        }
        var myChart1 = echarts.init(document.getElementById('day'))
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisLine: {
              // x轴线的颜色以及宽度
              show: true,
              lineStyle: {
                color: '#E7EBEF',
                width: 0,
                type: 'solid'
              }
            },
            axisLabel: {
              // x轴文字的配置
              show: true,
              textStyle: {
                color: '#485465',
                fontSize: '12'
              }
            },

            data: this.xdata
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            axisLine: {
              // x轴线的颜色以及宽度
              show: true,
              lineStyle: {
                color: '#E7EBEF',
                width: 0,
                type: 'solid'
              }
            },
            axisLabel: {
              // x轴文字的配置
              show: true,
              textStyle: {
                color: '#485465',
                fontSize: '12'
              }
            },

            // 网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#E7EBEF'],
                width: 1,
                type: 'solid'
              }
            }
          },
          series: [
            {
              name: '日最高',
              type: 'line',
              symbolSize: 10,
              color: ['#51A5DE'],
              data: this.maxdata
            },
            {
              name: '日均值',
              type: 'line',
              symbolSize: 10,
              color: ['#52BEB7'],
              data: this.avgdata
            }
          ]
        }
        myChart1.setOption(option, true)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getHourlyCurve () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/HourlyCurve',
          this.$qs.stringify({
            data: "{'AppCustomId':'" + this.value + "'} "
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
        this.xdata1 = []
        this.today = []
        this.yesterday = []
        if (res.data.length !== 0) {
          var data = res.data[0].Key.slice(0, res.data[0].Key.indexOf(' '))
          res.data.forEach(item => {
            if (item.Key.indexOf(data) !== -1) {
              this.xdata1.push(item.Key.slice(item.Key.indexOf(' ')))
              this.yesterday.push(item.AvPFifteen)
            } else {
              this.today.push(item.AvPFifteen)
            }
          })
        }
        var myChart = echarts.init(document.getElementById('hourly'))
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisLine: {
              // x轴线的颜色以及宽度
              show: true,
              lineStyle: {
                color: '#E7EBEF',
                width: 0,
                type: 'solid'
              }
            },
            axisLabel: {
              // x轴文字的配置
              show: true,
              textStyle: {
                color: '#485465',
                fontSize: '12'
              }
            },

            data: this.xdata1
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            axisLine: {
              // x轴线的颜色以及宽度
              show: true,
              lineStyle: {
                color: '#E7EBEF',
                width: 0,
                type: 'solid'
              }
            },
            axisLabel: {
              // x轴文字的配置
              show: true,
              textStyle: {
                color: '#485465',
                fontSize: '12'
              }
            },

            // 网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#E7EBEF'],
                width: 1,
                type: 'solid'
              }
            }
          },
          series: [
            {
              name: '今日',
              type: 'line',
              symbolSize: 10,
              color: ['#51A5DE'],
              data: this.today
            },
            {
              name: '昨日',
              type: 'line',
              symbolSize: 10,
              color: ['#52BEB7'],
              data: this.yesterday
            }
          ]
        }
        myChart.setOption(option, true)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
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
.curveCard {
  width: 335px;
  height: 145px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.disposal_t {
  float: left;
  width: 48px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(78, 78, 78, 1);
  line-height: 17px;
  margin-top: 10px;
  margin-left: 15px;
}
.flex2 {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 42px;
}
.summary {
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.59);
  box-shadow: 0px 1px 8px 0px rgba(39, 104, 100, 0.16);
  border-radius: 23px;
  text-align: center;
}
.summary p {
  font-size: 11px;
  font-weight: 400;
  color: rgba(61, 150, 144, 1);
}
.sum {
  width: 27px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
  line-height: 17px;
  margin: 9px 9px 0;
}
.sum p {
  width: 18px;
  height: 13px;
  font-size: 9px;
  font-weight: 400;
  color: rgba(63, 183, 175, 1);
  line-height: 13px;
  margin-top: 2px;
  margin-left: 4px;
}
.powerCurve {
  width: 335px;
  height: 170px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.powerCurve_t {
  float: right;
  position: relative;
  right: 0;
}
.powerCurve_title {
  display: inline-block;
  margin-top: 8px;
  margin-right: 19px;
}
.powerCurve_yg {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: rgba(63, 183, 175, 1);
  border-radius: 4px;
}
.powerCurve_gt {
  display: inline-block;
  height: 14px;
  font-size: 10px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 14px;
  margin-left: 5px;
}
.summary_p {
  width: 26px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.powerCurve_color {
  background: rgba(81, 165, 222, 1);
}
#hourly,
#day {
  width: 320px;
  height: 160px;
}
.powerCurve_cen {
  top: 50%;
  transform: translateY(-50%);
  position: relative;
}
</style>
