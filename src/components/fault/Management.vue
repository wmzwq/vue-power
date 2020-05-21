<template>
  <div class="">
    <van-nav-bar title="故障管理" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change"/>
      </van-dropdown-menu>
    </div>
    <div class="flex">
      <div class="fault_data" @click="goList">
        <div class="processed">
          <div class="processed_m1">
            <p class="processed_p">{{processed}}</p>
          </div>
          <div class="processed_m2">
            <img src="../../assets/img/fault_ dispose.png" alt="">
            <span class="processed_t">待处理</span>
          </div>
          <div class="processed_line"></div>
        </div>
        <div class="processed">
          <div class="processed_m1">
            <p class="processed_p">{{today}}</p>
          </div>
          <div class="processed_m2">
            <img src="../../assets/img/fault_time.png" alt="">
            <span class="processed_t">本日</span>
          </div>
          <div class="processed_line"></div>
        </div>
        <div class="processed">
          <div class="processed_m1">
            <p class="processed_p">{{currentMonth}}</p>
          </div>
          <div class="processed_m2">
            <img src="../../assets/img/fault_time.png" alt="">
            <span class="processed_t">本月</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="disposal">
        <div>
          <div class="disposal_t">故障处置</div>
          <select v-model="time" class="select" @change="onChangeStripe">
            <option value="year">年</option>
            <option value="month">月</option>
          </select>
        </div>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" class="disposal_e"></div>
        <div>
          <div>
            <div class="disposal_y"></div>
            <div class="disposal_f">本{{dispoalText}}已处理故障</div>
            <div class="disposal_s">{{dealWith}}</div>
          </div>
          <div>
            <div class="disposal_y disposal_c"></div>
            <div class="disposal_f disposal_h">本{{dispoalText}}未处理故障</div>
            <div class="disposal_s disposal_h">{{untreated}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="statistics">
        <div class="width:100%">
          <div class="disposal_t">故障处置</div>
          <div class="statistics_a">
            <div class="statistics_y"></div>
            <div class="statistics_f">已处理</div>
          </div>
          <div class="statistics_b">
            <div class="statistics_y statistics_c"></div>
            <div class="statistics_f">未处理</div>
          </div>
          <select v-model="faulttime" class="select" @change="onChange">
            <option value="year">年</option>
            <option value="month">月</option>
          </select>
        </div>
        <div>
          <div id="statistics"></div>
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
      value: '',
      option: [],
      time: 'month',
      faulttime: 'month',
      processed: 0,
      today: 0,
      currentMonth: 0,
      timetype: 1,
      dealWith: 0,
      untreated: 0,
      dispoalText: '月',
      faulttype: 1,
      xdata: [],
      ydata1: [],
      ydata2: [],
      ydata3: []
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
    this.getTasks()
    this.getFigure()
    this.getFault()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1) // 返回上一层
    },
    goList () {
      this.$router.push('/list')
    },
    async getTasks () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/faultInfo',
        this.$qs.stringify({
          data: "{'AppCustomId':'" + this.value + "'} "
        })
      ).catch(error => {
        console.log(error.message)
        this.$toast({
          message: '请求超时，请检查网络',
          className: 'error'
        })
      })
      if (res.code === 200) {
        this.processed = res.data[0]
        this.today = res.data[1]
        this.currentMonth = res.data[2]
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getFigure () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/faultStatisticalFigure',
        this.$qs.stringify({
          data: "{'AppCustomId':'" + this.value + "','timetype':'" + this.timetype + "'} "
        })
      ).catch(error => {
        console.log(error.message)
        this.$toast({
          message: '请求超时，请检查网络',
          className: 'error'
        })
      })
      if (res.code === 200) {
        this.dealWith = res.data[0]
        this.untreated = res.data[1]
        var option = {
          tooltip: {
            trigger: 'item',
            position: 'inside',
            formatter: '{b} <br/> {c}',
            axisPointer: {
              type: 'shadow'
            }
          },
          series: [
            {
              name: '故障处置',
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
                    textStyle: { color: '#fff', fontSize: '12' },
                    formatter: function (val) {
                      // 让series 中的文字进行换行
                      if (val.data.value === 0) { return '' } else {
                        return val.data.value
                      }
                    }
                  },
                  color: function (params) {
                    // 自定义颜色
                    var colorList = [
                      '#3FB7AF',
                      '#EEA67C'
                    ]
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: [{ value: res.data[0], name: '已处理故障' },
                { value: res.data[1], name: '未处理故障' }]
            }
          ]
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      console.log(res)
    },
    async getFault () {
      // 基于准备好的dom，初始化echarts实例
      var myChar = echarts.init(document.getElementById('statistics'))
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/faultStatistical',
        this.$qs.stringify({
          data: "{'AppCustomId':'" + this.value + "','timetype':'" + this.faulttype + "'} "
        })
      ).catch(error => {
        console.log(error.message)
        this.$toast({
          message: '请求超时，请检查网络',
          className: 'error'
        })
      })
      if (res.code === 200) {
        this.xdata = []
        this.ydata1 = []
        this.ydata2 = []
        this.ydata3 = []
        var arr = res.data.reverse()
        arr.forEach(item => {
          item.datetime.indexOf(' ')
          this.xdata.push(item.datetime.slice(0, item.datetime.indexOf(' ')))
          this.ydata1.push(item.num1)
          this.ydata2.push(item.num2)
          this.ydata3.push(item.num1 + item.num2)
        })
        var option1 = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          dataZoom: [
            {
              id: 'dataZoomX',
              type: 'slider',
              xAxisIndex: [0],
              filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
              start: 0,
              end: 20
            }
          ],
          xAxis: [
            {
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
            }
          ],
          yAxis: [
            {
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
            }
          ],
          series: [
            {
              name: '已处理',
              type: 'bar',
              stack: 'sum',
              barWidth: 20,
              itemStyle: {
                normal: {
                  label: {
                    show: true // 是否展示
                  },
                  color: '#3FB7AF'
                }
              },
              data: this.ydata1
            },
            {
              name: '未处理',
              type: 'bar',
              stack: 'sum',
              itemStyle: {
                normal: {
                  label: {
                    show: true // 是否展示
                  },
                  color: '#EEA67C'
                }
              },
              data: this.ydata2
            },
            {
              name: '总计',
              type: 'bar',
              stack: 'sum',
              label: {
                normal: {
                  offset: ['50', '80'],
                  show: true,
                  position: 'insideBottom',
                  formatter: '{c}',
                  textStyle: { color: '#000' }
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(128, 128, 128, 0)'
                }
              },
              data: this.ydata3
            }
          ]
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      // 使用刚指定的配置项和数据显示图表。
      myChar.setOption(option1)
      console.log(res)
    },
    onChangeStripe () {
      this.$loading()
      if (this.time === 'year') {
        this.timetype = 2
        this.dispoalText = '年'
      } else {
        this.timetype = 1
        this.dispoalText = '月'
      }
      this.getFigure()
    },
    onChange () {
      this.$loading()
      if (this.faulttime === 'year') {
        this.faulttype = 2
      } else {
        this.faulttype = 1
      }
      this.getFault()
    },
    change () {
      this.$loading()
      this.getTasks()
      this.getFigure()
      this.getFault()
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .van-dropdown-menu {
  width: 335px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06),
    0 0 1px 0 rgba(0, 0, 0, 0.08);
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
.fault_data {
  width: 335px;
  height: 76px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06),
    0 0 1px 0 rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.processed {
  width: 109px;
  height: 76px;
  position: relative;
  float: left;
  text-align: center;
}
.processed_p {
  width: 22px;
  height: 25px;
  font-size: 18px;
  font-weight: 400;
  color: rgba(78, 87, 117, 1);
  line-height: 25px;
  margin: 0;
  padding: 0;
}
.processed_t {
  margin: 0;
  padding: 0;
  width: 36px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(156, 167, 180, 1);
  line-height: 17px;
  margin-left: 4px;
}
.processed_m1 {
  margin: 0 44px;
  padding-top: 14px;
}
.processed_m2 {
  margin: 0 22px;
  margin-top: 4px;
}
.processed_line {
  position: absolute;
  width: 1px;
  height: 40px;
  background-color: #ebebeb;
  bottom: -5px;
  top: 18px;
  right: 0;
}
.disposal {
  width: 335px;
  height: 195px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06),
    0 0 1px 0 rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
  position: relative;
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
.select {
  float: right;
  width: 58px;
  height: 26px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(99, 113, 129, 1);
  margin-top: 6px;
  margin-right: 19px;
  opacity: 0.5;
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  position: relative;
  z-index: 9;
}
.disposal_e {
  margin: 27px;
}
.disposal_y {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #3fb7af;
  border-radius: 4px;
  top: 71px;
  right: 140px;
}
.disposal_f {
  position: absolute;
  width:100px;
  height: 14px;
  font-size: 10px;
  font-weight: 400;
  color: #707070;
  line-height: 14px;
  top: 68px;
  right: 35px;
}
.disposal_s {
  position: absolute;
  width: 15px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
  line-height: 17px;
  top: 68px;
  right: 20px;
  margin-top: -2px;
}
.disposal_c {
  background: rgba(238, 166, 124, 1);
  top: 97px;
}
.disposal_h {
  top: 94px;
}
.statistics {
  width: 335px;
  height: 248px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06),
    0 0 1px 0 rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
.statistics_a {
  float: left;
  position: relative;
  margin-left: 80px;
  margin-top: 16px;
}
.statistics_y {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #3fb7af;
  border-radius: 4px;
  top: 0;
  left: 0;
}
.statistics_f {
  position: absolute;
  width: 46px;
  height: 10px;
  font-size: 10px;
  font-weight: 400;
  color: rgba(72, 84, 101, 1);
  line-height: 10px;
  top: -1px;
  left: 13px;
}
.statistics_b {
  float: left;
  position: relative;
  margin-left: 60px;
  margin-top: 16px;
}
.statistics_c {
  background: rgba(238, 166, 124, 1);
}
#statistics{
  width: 330px;height:240px;
}
#main{
  width: 150px;height:150px;
}
</style>
