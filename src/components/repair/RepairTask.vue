<template>
  <div class>
    <van-nav-bar title="抢修任务" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change"/>
      </van-dropdown-menu>
    </div>
    <div class="flex2 mar" @click="goList">
      <div class="fault">
        <p>{{ repair }}</p>
        <img src="../../assets/img/ywc.png" alt />
        <span>待抢修</span>
      </div>
      <div class="fault">
        <p>{{ audit }}</p>
        <img src="../../assets/img/ywc.png" alt />
        <span>待审核</span>
      </div>
      <div class="fault">
        <p>{{ withinTheTimeLimit }}</p>
        <img src="../../assets/img/ywc.png" alt />
        <span>逾期</span>
      </div>
      <div class="fault">
        <p>{{ monthToComplete }}</p>
        <img src="../../assets/img/ywc.png" alt />
        <span>本月完成</span>
      </div>
    </div>
    <div class="flex">
      <div class="disposal">
        <div>
          <div class="disposal_t">抢修月表</div>
        </div>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" class="disposal_e"></div>
        <div class="curve">
          <div class="pr curve_mar1">
            <div class="disposal_y"></div>
            <div class="disposal_f">本月待抢修</div>
            <div class="disposal_s">{{ monthToRepair }}</div>
          </div>
          <div class="pr curve_mar2">
            <div class="disposal_y curve_color1"></div>
            <div class="disposal_f">本月待审核</div>
            <div class="disposal_s">{{ monthToAudit }}</div>
          </div>
          <div class="pr curve_mar3">
            <div class="disposal_y curve_color2"></div>
            <div class="disposal_f">本月已完成</div>
            <div class="disposal_s">{{ monthToComplete }}</div>
          </div>
          <div class="pr curve_mar4">
            <div class="disposal_y curve_color3"></div>
            <div class="disposal_f">本月逾期</div>
            <div class="disposal_s">{{ monthWithinTheTimeLimit }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="statistics">
        <div>
          <div class="disposal_t">抢修历史</div>
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
      repair: 0,
      audit: 0,
      withinTheTimeLimit: 0,
      monthToComplete: 0,
      monthToRepair: 0,
      monthToAudit: 0,
      monthWithinTheTimeLimit: 0,
      value: '',
      option: [],
      time: 'month',
      xdata: [],
      ydata: []
    }
  },
  created () {
    this.$loading()
    this.getHome()
  },
  beforeUpdate () {
    this.$clear()
  },
  async mounted () {
    this.option = JSON.parse(localStorage.getItem('option'))
    const { data: res } = await this.$http
      .post(
        'CustomerDataAPI/RepairHistory',
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
    console.log(res)
    if (res.code === 200) {
      var arr = res.data.reverse()
      arr.forEach(item => {
        this.xdata.push(item.Key)
        this.ydata.push(item.finish)
      })
    } else {
      this.$toast({
        message: res.info,
        className: 'error'
      })
    }
    // 基于准备好的dom，初始化echarts实例
    var myChar = echarts.init(document.getElementById('statistics'))
    var option1 = {
      color: ['#40B7AF'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.xdata,
          axisTick: {
            alignWithLabel: true
          },
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
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
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
        }
      ],
      series: [
        {
          name: '抢修历史',
          type: 'bar',
          barWidth: '60%',
          data: this.ydata
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChar.setOption(option1)
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goList () {
      this.$router.push({
        path: '/repairList',
        query: {
          id: this.value
        }
      })
    },
    change () {
      this.$loading()
      this.getHome()
    },
    async getHome () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/RepairTask',
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
      console.log(res)
      if (res.code === 200) {
        this.repair = res.data[0].ToRepair
        this.audit = res.data[0].ToAudit
        this.withinTheTimeLimit = res.data[0].WithinTheTimeLimit
        this.monthToComplete = res.data[0].ThisMonthToComplete
        this.monthToRepair = res.data[0].ThisMonthToRepair
        this.monthToAudit = res.data[0].ThisMonthToAudit
        this.monthWithinTheTimeLimit = res.data[0].ThisMonthWithinTheTimeLimit
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))
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
              name: '抢修月表',
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
                      return val.data.value
                    }
                  },
                  color: function (params) {
                    // 自定义颜色
                    var colorList = ['#76DDFB', '#EEA67C', '#3FB7AF', '#FF7171']
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: [
                { value: this.monthToRepair, name: '本月待抢修' },
                { value: this.monthToAudit, name: '本月待审核' },
                { value: this.monthToComplete, name: '本月已完成' },
                { value: this.monthWithinTheTimeLimit, name: '本月逾期' }
              ]
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
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
.flex2 {
  width: 335px;
  height: 60px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  display: flex;
  justify-content: space-around;
}
.fault {
  position: relative;
}
.fault p {
  font-size: 18px;
  font-weight: 400;
  color: rgba(78, 87, 117, 1);
  margin-top: 9px;
  text-align: center;
}
.fault img {
  width: 10px;
  height: 10px;
  margin-right: 4px;
}
.fault span {
  font-size: 10px;
  font-weight: 400;
  color: rgba(137, 145, 155, 1);
}

.disposal {
  width: 335px;
  height: 200px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
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
  margin-top: 15px;
  margin-left: 15px;
}
.disposal_e {
  margin: 27px;
}
.curve {
  position: absolute;
  top: 45px;
  right: 130px;
}
.disposal_y {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #78dcfa;
  border-radius: 4px;
  margin-top: -2px;
}
.disposal_f {
  position: absolute;
  width: 84px;
  height: 14px;
  font-size: 10px;
  font-weight: 400;
  color: #707070;
  line-height: 14px;
  left: 16px;
  top: -4px;
}
.disposal_s {
  position: absolute;
  width: 15px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
  line-height: 17px;
  left: 90px;
  top: -6px;
}
.statistics {
  width: 335px;
  height: 228px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
}
#main {
  width: 160px;
  height: 160px;
}
.curve_mar1 {
  margin-top: 18px;
}
.curve_mar2 {
  margin-top: 44px;
}
.curve_mar3 {
  margin-top: 70px;
}
.curve_mar4 {
  margin-top: 96px;
}
.curve_color1 {
  background: #eea67c;
}
.curve_color2 {
  background: #3fb7af;
}
.curve_color3 {
  background: #ff7171;
}
#statistics {
  width: 335px;
  height: 220px;
  margin-top: -5px;
}
</style>
