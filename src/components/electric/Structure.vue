<template>
  <div class>
    <van-nav-bar title="电费结构" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <div class="timer">
        <div class="title">{{text}}</div>
        <select v-model="time" class="select" @change="selectChange">
          <option value="month">月</option>
          <option value="day">日</option>
        </select>
      </div>
    </div>
    <div class="flex">
      <div class="powerStructure">
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
              <div id="dayJ"></div>
              <div class="round">{{TotalPrices1}}元</div>
              <div class="powerStructure_day">{{title1}}尖峰平台</div>
            </div>
            <div class="ib pr">
              <div id="monthJ"></div>
              <div class="round">{{TotalPrices}}元</div>
              <div class="powerStructure_day">{{title2}}尖峰平台</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div>
        <table align="center" class="tableStyle">
          <tr align="center" class="bg state">
            <td></td>
            <td>尖</td>
            <td>峰</td>
            <td>平</td>
            <td>谷</td>
            <td>总</td>
          </tr>
          <tr class="state" align="center">
            <td>{{title1}}单价</td>
            <td>{{AiguilleEPrice}}元</td>
            <td>{{FlatEPrice}}元</td>
            <td>{{LowEbbEPrice}}元</td>
            <td>{{PeakEPrice}}元</td>
            <td>{{TotalPrices}}元</td>
          </tr>
          <tr class="state" align="center">
            <td rowspan="2">{{title1}}</td>
            <td>{{AiguilleEMoney1 }}元</td>
            <td>{{FlatEMoney1}}元</td>
            <td>{{LowEbbEMoney1}}元</td>
            <td>{{PeakEMoney1}}元</td>
            <td>{{TotalMoney1}}元</td>
          </tr>
          <tr class="state" align="center">
            <td>{{AiguilleE1 }}KVA</td>
            <td>{{FlatE1 }}KVA</td>
            <td>{{LowEbbE1 }}KVA</td>
            <td>{{PeakE1 }}KVA</td>
            <td>{{TotalE1 }}KVA</td>
          </tr>
           <tr class="state" align="center">
            <td>{{title2}}单价</td>
            <td>{{AiguilleEPrice1}}元</td>
            <td>{{FlatEPrice1}}元</td>
            <td>{{LowEbbEPrice1}}元</td>
            <td>{{PeakEPrice1}}元</td>
            <td>{{TotalPrices1}}元</td>
          </tr>
          <tr class="state" align="center">
            <td rowspan="2">{{title2}}</td>
            <td>{{AiguilleEMoney }}元</td>
            <td>{{FlatEMoney}}元</td>
            <td>{{LowEbbEMoney}}元</td>
            <td>{{PeakEMoney}}元</td>
            <td>{{TotalMoney}}元</td>
          </tr>
          <tr class="state" align="center">
            <td>{{AiguilleE }}KVA</td>
            <td>{{FlatE }}KVA</td>
            <td>{{LowEbbE }}KVA</td>
            <td>{{PeakE }}KVA</td>
            <td>{{TotalE }}KVA</td>
          </tr>
        </table>
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
      time: 'day',
      text: '',
      timetype: 1,
      title1: '今日',
      title2: '昨日',
      AiguilleE: 0,
      AiguilleEMoney: 0,
      AiguilleEPrice: 0,
      FlatE: 0,
      FlatEMoney: 0,
      FlatEPrice: 0,
      LowEbbE: 0,
      LowEbbEMoney: 0,
      LowEbbEPrice: 0,
      PeakE: 0,
      PeakEMoney: 0,
      PeakEPrice: 0,
      TotalE: 0,
      TotalMoney: 0,
      TotalPrices: 0,
      AiguilleE1: 0,
      AiguilleEMoney1: 0,
      AiguilleEPrice1: 0,
      FlatE1: 0,
      FlatEMoney1: 0,
      FlatEPrice1: 0,
      LowEbbE1: 0,
      LowEbbEMoney1: 0,
      LowEbbEPrice1: 0,
      PeakE1: 0,
      PeakEMoney1: 0,
      PeakEPrice1: 0,
      TotalE1: 0,
      TotalMoney1: 0,
      TotalPrices1: 0
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.text = this.$route.query.text
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/PowerStructureTodayYesterday',
          this.$qs.stringify({
            data:
              "{'AppCustomId':'" +
              this.$route.query.id +
              "','timetype':'" +
              this.timetype +
              "'} "
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
        if (res.data.length !== 0) {
          this.AiguilleE = res.data[0].AiguilleE.toFixed(2)
          this.AiguilleEMoney = res.data[0].AiguilleEMoney.toFixed(2)
          this.AiguilleEPrice = res.data[0].AiguilleEPrice.toFixed(2)
          this.FlatE = res.data[0].FlatE.toFixed(2)
          this.FlatEMoney = res.data[0].FlatEMoney.toFixed(2)
          this.FlatEPrice = res.data[0].FlatEPrice.toFixed(2)
          this.LowEbbE = res.data[0].LowEbbE.toFixed(2)
          this.LowEbbEMoney = res.data[0].LowEbbEMoney.toFixed(2)
          this.LowEbbEPrice = res.data[0].LowEbbEPrice.toFixed(2)
          this.PeakE = res.data[0].PeakE.toFixed(2)
          this.PeakEMoney = res.data[0].PeakEMoney.toFixed(2)
          this.PeakEPrice = res.data[0].PeakEPrice.toFixed(2)
          this.TotalE = res.data[0].TotalE.toFixed(2)
          this.TotalMoney = res.data[0].TotalMoney.toFixed(2)
          this.TotalPrices = res.data[0].TotalPrices.toFixed(2)
          this.AiguilleE1 = res.data[1].AiguilleE.toFixed(2)
          this.AiguilleEMoney1 = res.data[1].AiguilleEMoney.toFixed(2)
          this.AiguilleEPrice1 = res.data[1].AiguilleEPrice.toFixed(2)
          this.FlatE1 = res.data[1].FlatE.toFixed(2)
          this.FlatEMoney1 = res.data[1].FlatEMoney.toFixed(2)
          this.FlatEPrice1 = res.data[1].FlatEPrice.toFixed(2)
          this.LowEbbE1 = res.data[1].LowEbbE.toFixed(2)
          this.LowEbbEMoney1 = res.data[1].LowEbbEMoney.toFixed(2)
          this.LowEbbEPrice1 = res.data[1].LowEbbEPrice.toFixed(2)
          this.PeakE1 = res.data[1].PeakE.toFixed(2)
          this.PeakEMoney1 = res.data[1].PeakEMoney.toFixed(2)
          this.PeakEPrice1 = res.data[1].PeakEPrice.toFixed(2)
          this.TotalE1 = res.data[1].TotalE.toFixed(2)
          this.TotalMoney1 = res.data[1].TotalMoney.toFixed(2)
          this.TotalPrices1 = res.data[1].TotalPrices.toFixed(2)
          this.getEcharts()
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    getEcharts () {
      // 基于准备好的dom，初始化echarts实例
      var myChart1 = echarts.init(document.getElementById('dayJ'))
      var myChart2 = echarts.init(document.getElementById('monthJ'))
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
              { value: (this.AiguilleE / this.TotalE).toFixed(2) * 100, name: '尖', data: this.AiguilleE },
              { value: (this.FlatE / this.TotalE).toFixed(2) * 100, name: '峰', data: this.FlatE },
              { value: (this.LowEbbE / this.TotalE).toFixed(2) * 100, name: '平', data: this.LowEbbE },
              { value: (this.PeakE / this.TotalE).toFixed(2) * 100, name: '谷', data: this.PeakE }
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
              { value: (this.AiguilleE1 / this.TotalE1).toFixed(2) * 100, name: '尖', data: this.AiguilleE1 },
              { value: (this.FlatE1 / this.TotalE1).toFixed(2) * 100, name: '峰', data: this.FlatE1 },
              { value: (this.LowEbbE1 / this.TotalE1).toFixed(2) * 100, name: '平', data: this.LowEbbE1 },
              { value: (this.PeakE1 / this.TotalE1).toFixed(2) * 100, name: '谷', data: this.PeakE1 }
            ]
          }
        ]
      }
      myChart1.setOption(option2, true)
      myChart2.setOption(option1, true)
    },
    selectChange () {
      this.$loading()
      if (this.time === 'day') {
        this.timetype = 1
        this.title1 = '今日'
        this.title2 = '昨日'
      } else {
        this.timetype = 2
        this.title1 = '本月'
        this.title2 = '上月'
      }
      this.getList()
    }
  }
}
</script>
<style scoped lang="less">
.title {
  float: left;
  margin-top: 22px;
}
.timer {
  width: 335px;
  margin: 15px 20px 0;
}
.select {
  width: 60px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  float: right;
  margin-top: 15px;
}
.flex2 {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 47px;
}
.powerCurve_t {
  float: right;
  width: 150px;
  position: relative;
  right: 0;
}
.powerCurve_color1 {
  background: #ff8360 !important;
}
.powerCurve_color2 {
  background: #ffc26f !important;
}
.powerCurve_color3 {
  background: #6eb6e8 !important;
}
.powerCurve_color4 {
  background: #6fe9d3 !important;
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
  width: 26px;
  height: 14px;
  font-size: 10px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 14px;
  margin-left: 5px;
}
.powerStructure {
  width: 335px;
  height: 190px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.powerStructure_r {
  margin-right: -2px;
}
.powerStructure_day {
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 17px;
  margin-left: 38px;
}
#dayJ,
#monthJ {
  width: 150px;
  height: 130px;
}

.tableStyle {
  width: 335px;
  margin: 15px 20px 0;
  background: #fff;
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
tr {
  height: 36px;
}
td {
  width: 57px;
}
</style>
