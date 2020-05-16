<template>
  <div class="">
    <van-nav-bar title="电量电费" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change" />
      </van-dropdown-menu>
    </div>
    <div class="flex">
      <div class="curveCard" @click="goDetails">
        <div class="disposal_t">电量概括</div>
        <div class="flex2">
          <div class="powerSum">
            <div class="summary">
              <p class="today">今日</p>
              <p>KVA</p>
            </div>
            <div class="sum">{{ today }}</div>
          </div>
          <div class="powerSum">
            <div class="summary">
              <p class="today">昨日</p>
              <p>KVA</p>
            </div>
            <div class="sum">{{ yesterday }}</div>
          </div>
          <div class="powerSum">
            <div class="summary">
              <p class="today">本月</p>
              <p>KVA</p>
            </div>
            <div class="sum">{{ thisMonth }}</div>
          </div>
          <div class="powerSum">
            <div class="summary">
              <p class="today">上月</p>
              <p>KVA</p>
            </div>
            <div class="sum">{{ LastMonth }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="powerCurve">
        <div>
          <div class="disposal_t">电量曲线</div>
          <div class="powerCurve_t">
            <div class="powerCurve_title">
              <div class="powerCurve_yg"></div>
              <span class="powerCurve_gt">今日</span>
            </div>
            <div class="powerCurve_title">
              <div
                class="powerCurve_yg  powerCurve_color"></div>
              <span class="powerCurve_gt">昨日</span>
            </div>
          </div>
        </div>
        <div id="powerCurve"></div>
      </div>
    </div>
    <div class="flex">
      <div>
        <div class="electricity electricity_m1" @click="goDay">
          <div class="electricity_i">
            <img src="../../assets/img/df.png" class="imgWidth" />
            <p class="electricity_t">今日电费</p>
            <p class="electricity_s">{{todayCharge}}元</p>
          </div>
          <div class="electricity_m">
            <img src="../../assets/img/df.png" class="imgWidth" />
            <p class="electricity_t">昨日电费</p>
            <p class="electricity_s">{{yesterdayCharge}}元</p>
          </div>
        </div>
        <div class="electricity electricity_m2" @click="goMonth">
          <div class="electricity_i">
            <img src="../../assets/img/df.png" class="imgWidth" />
            <p class="electricity_t">本月电费</p>
            <p class="electricity_s">{{thisMonthCharge}}元</p>
          </div>
          <div class="electricity_m">
            <img src="../../assets/img/df.png" class="imgWidth" />
            <p class="electricity_t">上月电费</p>
            <p class="electricity_s">{{LastMonthCharge}}元</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="powerStructure" @click="goStructure">
        <div>
          <div class="disposal_t">电量结构</div>
          <div class="powerCurve_t">
            <div class="powerCurve_title powerStructure_r">
              <div class="powerCurve_yg powerCurve_color1"></div>
              <span class="powerCurve_gt">尖</span>
            </div>
            <div class="powerCurve_title powerStructure_r">
              <div class="powerCurve_yg powerCurve_color2"></div>
              <span class="powerCurve_gt">峰</span>
            </div>
            <div class="powerCurve_title powerStructure_r">
              <div class="powerCurve_yg powerCurve_color3"></div>
              <span class="powerCurve_gt">平</span>
            </div>
            <div class="powerCurve_title powerStructure_r">
              <div class="powerCurve_yg powerCurve_color4"></div>
              <span class="powerCurve_gt">谷</span>
            </div>
          </div>
          <div class="flex2">
            <div class="ib pr">
              <div id="dayJ" @click.stop=""></div>
              <div class="round">{{dayprice}}</div>
              <div class="powerStructure_day">今日尖峰平台</div>
            </div>
            <div class="ib pr">
              <div id="monthJ" @click.stop=""></div>
              <div class="round">{{price}}</div>
              <div class="powerStructure_day">本月尖峰平台</div>
            </div>
          </div>
        </div>
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
      today: 0,
      yesterday: 0,
      thisMonth: 0,
      LastMonth: 0,
      value: '',
      option: [],
      todaylist: [],
      yesterdaylist: [],
      todayCharge: 0,
      yesterdayCharge: 0,
      thisMonthCharge: 0,
      LastMonthCharge: 0,
      price: 0,
      dayprice: 0
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
    this.getElectricity()
    this.getPowerStructure()
    this.getpowerCurve()
    this.getPowerCharge()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goDetails () {
      this.$router.push('/batteryDetails')
    },
    goDay () {
      this.$router.push('/electricityDay')
    },
    goMonth () {
      this.$router.push('/electricityMonth')
    },
    goStructure () {
      var box = document.getElementsByClassName('van-ellipsis')
      this.$router.push({
        path: '/structure',
        query: {
          id: this.value,
          text: box[1].innerText
        }
      })
    },
    async getpowerCurve () {
      const timeData = []
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('powerCurve'))
      for (var i = 0; i < 24; i++) {
        if (i < 10) {
          i = '0' + i
          timeData.push(i)
        } else {
          i = '' + i
          timeData.push(i)
        }
      }
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/powerCurve',
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
        this.todaylist = []
        this.yesterdaylist = []
        res.data[0].todaylist.forEach((item, index) => {
          this.todaylist.push(item.AiguilleE + '')
        })
        res.data[0].yesterdaylist.forEach(item => {
          this.yesterdaylist.push(item.AiguilleE + '')
        })
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
                color: '#485465'
              }
            },

            data: timeData
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
                color: '#485465'
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
              color: ['#3fb7af'],
              data: this.todaylist
            },
            {
              name: '昨日',
              type: 'line',
              symbolSize: 10,
              color: ['rgb(81, 165, 222)'],
              data: this.yesterdaylist
            }
          ]
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
      myChart.setOption(option, true)
    },
    async getPowerCharge () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/powerCharge',
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
        this.today = res.data[0].Today.toFixed(1)
        this.yesterday = res.data[0].Yesterday.toFixed(1)
        this.thisMonth = res.data[0].ThisMonth.toFixed(1)
        this.LastMonth = res.data[0].LastMonth.toFixed(1)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getElectricity () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/electricity',
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
        this.todayCharge = res.data[0].today.toFixed(1)
        this.thisMonthCharge = res.data[0].month.toFixed(1)
        this.LastMonthCharge = res.data[0].lastmonth.toFixed(1)
        this.yesterdayCharge = res.data[0].yesterday.toFixed(1)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getPowerStructure () {
      var myChart1 = echarts.init(document.getElementById('dayJ'))
      var myChart2 = echarts.init(document.getElementById('monthJ'))
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/PowerStructure',
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
        var num = res.data[0].dayAiguille + res.data[0].dayFlat + res.data[0].dayLowEbb + res.data[0].dayPeak
        var num1 = res.data[0].Aiguille + res.data[0].Flat + res.data[0].LowEbb + res.data[0].Peak
        this.dayprice = res.data[0].dayPrices.toFixed(2)
        this.price = res.data[0].Prices.toFixed(2)
        var option1 = {
          tooltip: {
            formatter: function (param) {
              return (
                param.marker +
            ' ' +
            param.name +
            '：' +
            param.value +
            '%' +
            '<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;' +
            param.data.data +
            'kw' +
            '<br>'
              )
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '80%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
                color: '#fff'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '12'
                }
              },
              labelLine: {
                show: false
              },
              itemStyle: {
                normal: {
                  label: {
                    position: 'inner',
                    show: true, // 是否展示,
                    textStyle: { color: '#fff', fontSize: '10' },
                    formatter: function (val) {
                      // 让series 中的文字进行换行
                      return val.data.value + '%'
                    }
                  },
                  color: function (params) {
                    // 自定义颜色
                    var colorList = ['#FF8360', '#FFC26F', '#6EB6E8', '#6FE9D3']
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: [
                { value: ((res.data[0].dayAiguille) / num).toFixed(2) * 100, name: '尖', data: res.data[0].dayAiguille },
                { value: ((res.data[0].dayFlat) / num).toFixed(2) * 100, name: '峰', data: res.data[0].dayFlat },
                { value: ((res.data[0].dayLowEbb) / num).toFixed(2) * 100, name: '平', data: res.data[0].dayLowEbb },
                { value: ((res.data[0].dayPeak) / num).toFixed(2) * 100, name: '谷', data: res.data[0].dayPeak }
              ]
            }
          ]
        }
        var option2 = {
          tooltip: {
            formatter: function (param) {
              return (
                param.marker +
            ' ' +
            param.name +
            '：' +
            param.value +
            '%' +
            '<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;' +
            param.data.data +
            'kw' +
            '<br>'
              )
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '80%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
                color: '#fff'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '12'
                }
              },
              labelLine: {
                show: false
              },
              itemStyle: {
                normal: {
                  label: {
                    position: 'inner',
                    show: true, // 是否展示,
                    textStyle: { color: '#fff', fontSize: '10' },
                    formatter: function (val) {
                      // 让series 中的文字进行换行
                      return val.data.value + '%'
                    }
                  },
                  color: function (params) {
                    // 自定义颜色
                    var colorList = ['#FF8360', '#FFC26F', '#6EB6E8', '#6FE9D3']
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: [
                { value: ((res.data[0].Aiguille) / num1).toFixed(2) * 100, name: '尖', data: res.data[0].Aiguille },
                { value: ((res.data[0].Flat) / num1).toFixed(2) * 100, name: '峰', data: res.data[0].Flat },
                { value: ((res.data[0].LowEbb) / num1).toFixed(2) * 100, name: '平', data: res.data[0].LowEbb },
                { value: ((res.data[0].Peak) / num1).toFixed(2) * 100, name: '谷', data: res.data[0].Peak }
              ]
            }
          ]
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      myChart1.setOption(option1, true)
      myChart2.setOption(option2, true)
      console.log(res)
    },
    change () {
      this.$loading()
      this.getpowerCurve()
      this.getPowerCharge()
      this.getElectricity()
      this.getPowerStructure()
    }
  }
}
</script>
<style scoped lang="less">
#monthJ,
#dayJ {
  width: 150px;
  height: 130px;
}
#powerCurve {
  width: 320px;
  height: 170px;
  margin-top: -10px;
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
.today{
  padding-top: 6px;
}
.powerCurve_color{
  background:rgba(81,165,222,1) !important;
}
.imgWidth{
 width: 12px;
 float: left;
}
.curveCard {
  width: 335px;
  height: 134px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.disposal_t {
  float: left;
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
  margin-top: 47px;
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
  font-size: 12px;
  font-weight: 400;
  color: rgba(61, 150, 144, 1);
}
.sum {
  font-size: 12px;
  color: rgba(47, 47, 47, 1);
  line-height: 17px;
  text-align: center;
  margin-top: 9.5px;
  margin-left: 2px;
  word-wrap: break-word;
}
.powerCurve {
  width: 335px;
  height: 164px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.powerCurve_color1{
  background:#FF8360 !important
}
.powerCurve_color2{
  background:#FFC26F !important
}
.powerCurve_color3{
  background:#6EB6E8 !important
}
.powerCurve_color4{
  background:#6FE9D3 !important
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
.electricity {
  display: inline-block;
  width: 160px;
  height: 64px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
.electricity_m1 {
  margin: 15px 0 0 20px;
}
.electricity_m2 {
  margin: 15px 20px 0 15px;
}
.electricity_i {
  margin: 12px 15px 0;
}
.electricity_t {
  float: left;
  height: 14px;
  font-size: 10px;
  font-weight: 400;
  color: rgba(137, 145, 155, 1);
  line-height: 14px;
  margin-left: 5px;
}
.electricity_s {
  float: left;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: #2f2f2f;
  line-height: 17px;
  margin-left: 5px;
}
.electricity_m {
  margin: 5px 15px;
  padding-top: 10px;
  clear: both;
}
.powerStructure {
  width: 335px;
  height: 188px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px;
}
.powerStructure_r {
  margin-right: 10px;
}
.powerStructure_day {
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 17px;
  margin-left: 38px;
}
.round {
  position: absolute;
  width: 46px;
  height: 46px;
  background: rgba(69, 192, 163, 1);
  border-radius: 23px;
  top: 42px;
  left: 52px;
  font-size: 10px;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 46px;
}
</style>
