<template>
  <div class>
    <van-nav-bar title="月电费" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change" />
      </van-dropdown-menu>
    </div>
    <div class="flex">
      <div class="powerStructure">
        <div>
          <div class="disposal_t">{{time}}</div>
          <div class="powerCurve_t">
            <div class="powerCurve_title powerStructure_r">
              <div class="powerCurve_yg powerCurve_color1"></div>
              <span class="powerCurve_gt">电度电费</span>
            </div>
            <div class="powerCurve_title powerStructure_r">
              <div class="powerCurve_yg powerCurve_color2"></div>
              <span class="powerCurve_gt">基本电费</span>
            </div>
            <div class="powerCurve_title powerStructure_r">
              <div class="powerCurve_yg powerCurve_color3"></div>
              <span class="powerCurve_gt">力调电费</span>
            </div>
          </div>
          <div>
            <div class="footer">
              <div id="month"></div>
              <div class="round">
                <p class="price">{{num}}元</p>
                <p>合计</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <table align="center" class="tableStyle">
        <tr align="center" class="bg state">
          <td>时间</td>
          <td>电度电量</td>
          <td>基本电费</td>
          <td>力调电费</td>
          <td>合计</td>
        </tr>
        <tr class="state" :class="activeClass == index ? 'cs':''"  @click="open(index,item.Key,item.ElectricityBills,item.TotalPrices,item.Transfer)" :id="index" :key="index" v-for="(item, index) in list">
          <td align="center">{{item.Key}}</td>
          <td align="center">{{item.ElectricityBills.toFixed(2)}}元</td>
          <td align="center">{{item.TotalPrices.toFixed(2)}}元</td>
          <td align="center">{{item.Transfer.toFixed(2)}}元</td>
          <td align="center">{{(item.ElectricityBills+item.TotalPrices+item.Transfer).toFixed(2)}}元</td>
        </tr>
      </table>
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
      list: [],
      ElectricityBills: 0,
      TotalPrices: 0,
      Transfer: 0,
      num: 0,
      time: '',
      activeClass: 0
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
    this.value = this.option[1].value
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/electricityMonth',
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
        this.list = res.data
        if (res.data.length !== 0) {
          this.time = res.data[0].Key
          this.ElectricityBills = res.data[0].ElectricityBills.toFixed(2)
          this.TotalPrices = res.data[0].TotalPrices.toFixed(2)
          this.Transfer = res.data[0].Transfer.toFixed(2)
          this.num = (res.data[0].ElectricityBills + res.data[0].TotalPrices + res.data[0].Transfer).toFixed(2)
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
    open (i, time, ElectricityBills, TotalPrices, Transfer) {
      this.$loading()
      this.activeClass = i
      this.time = time
      this.ElectricityBills = ElectricityBills.toFixed(2)
      this.TotalPrices = TotalPrices.toFixed(2)
      this.Transfer = Transfer.toFixed(2)
      this.num = (ElectricityBills + TotalPrices + Transfer).toFixed(2)
      this.getEcharts()
    },
    getEcharts () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('month'))
      var option = {
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
                  var colorList = ['#FFC36F', '#70B5E9', '#71E8D5']
                  return colorList[params.dataIndex]
                }
              }
            },
            data: [
              { value: ((this.ElectricityBills / this.num).toFixed(2)) * 100, name: '电度电费', data: this.ElectricityBills },
              { value: ((this.TotalPrices / this.num).toFixed(2)) * 100, name: '基本电费', data: this.TotalPrices },
              { value: ((this.Transfer / this.num).toFixed(2)) * 100, name: '力调电费', data: this.Transfer }
            ]
          }
        ]
      }
      myChart.setOption(option, true)
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
.tableStyle {
  width: 335px;
  margin: auto;
  background: #fff;
  margin-top: 15px;
}
td {
  height: 36px;
  width: 68.5px;
}
.powerCurve_color1 {
  background: #ffc26f !important;
}
.powerCurve_color2 {
  background: #6eb6e8 !important;
}
.powerCurve_color3 {
  background: #6fe9d3 !important;
}
.powerCurve_t {
  float: right;
  width: 222px;
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
  width: 48px;
  height: 14px;
  font-size: 10px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 14px;
  margin-left: 5px;
}
.powerStructure {
  width: 335px;
  height: 200px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  margin: 15px 20px 0;
}
.powerStructure_r {
  margin-right: 8px;
}
.powerStructure_day {
  width: 72px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  line-height: 17px;
  margin-left: 38px;
}
.footer {
  position: relative;
  padding-top: 25px;
  padding-left: 20px;
}
#month {
  width: 300px;
  height: 180px;
}
.price {
  padding-top: 15px;
}
.round {
  position: absolute;
  width: 64px;
  height: 64px;
  background: rgba(69, 192, 163, 1);
  border-radius: 32px;
  top: 82px;
  left: 138px;
  font-size: 10px;
  color: rgba(255, 255, 255, 1);
  text-align: center;
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
.cs td {
  border: 2px solid rgba(69, 192, 163, 1);
  border-right-color: #ddd;
}
.cs td:last-child {
  border-right-color: rgba(69, 192, 163, 1);
}
</style>
