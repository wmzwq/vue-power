<template>
  <div class="">
    <van-nav-bar title="巡检任务" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change"/>
      </van-dropdown-menu>
    </div>
    <div class="flex">
      <div class="fault_data mar" @click="goList">
        <div class="fault fl">
          <p>{{ForChecking}}</p>
          <div class="flex">
            <div class="fault_t">
              <img src="../../assets/img/ywc.png" alt="" />
              <span>待巡检</span>
            </div>
          </div>
        </div>
        <div class="fault fr">
          <p>{{Monthcomplete}}</p>
          <div class="flex">
            <div class="fault_t fault_margin">
              <img src="../../assets/img/ywc.png" alt="" />
              <span>本月完成</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="disposal">
        <div>
          <div class="disposal_t">巡视月表</div>
        </div>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" class="disposal_e"></div>
        <div>
          <div>
            <div class="disposal_y"></div>
            <div class="disposal_f">本月待巡检</div>
            <div class="disposal_s">{{MonthForChecking}}</div>
          </div>
          <div>
            <div class="disposal_y disposal_c"></div>
            <div class="disposal_f disposal_h">本月逾期巡检</div>
            <div class="disposal_s disposal_h">{{Monthoverdue}}</div>
          </div>
          <div>
            <div class="disposal_y disposal_c1"></div>
            <div class="disposal_f disposal_h1">本月完成任务</div>
            <div class="disposal_s disposal_h1">{{Monthcomplete}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="statistics">
        <div>
          <div class="disposal_t">巡视历史</div>
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
// import { nowDate, latMonth } from '../../provider/data'
export default {
  components: {},
  data () {
    return {
      ForChecking: 0,
      Monthoverdue: 0,
      Monthcomplete: 0,
      MonthForChecking: 0,
      value: '',
      option: [],
      time: 'month',
      xdata: [],
      ydata: []
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  async mounted () {
    this.getTasks()
    const { data: res } = await this.$http
      .post(
        'CustomerDataAPI/InspectionCompleted',
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
    this.option = JSON.parse(localStorage.getItem('option'))
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
          name: '巡检历史',
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
        path: '/checkingList',
        query: {
          id: this.value
        }
      })
    },
    async getTasks () {
    // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/InspectionTasks',
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
        this.ForChecking = res.data[0].ForChecking
        this.Monthoverdue = res.data[0].Monthoverdue
        this.Monthcomplete = res.data[0].Monthcomplete
        this.MonthForChecking = res.data[0].MonthForChecking
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
              name: '巡检任务',
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
                    var colorList = ['#78DCFA', '#EDA67E', '#40B7B1']
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: [
                { value: res.data[0].MonthForChecking, name: '本月待巡检' },
                { value: res.data[0].Monthoverdue, name: '本月逾期巡检' },
                { value: res.data[0].Monthcomplete, name: '本月完成任务' }
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
      console.log(res)

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    change () {
      this.$loading()
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
.fault_data {
  width: 335px;
  height: 60px;
}
.fault {
  width: 160px;
  height: 60px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
.fault_t img {
  width: 10px;
  margin-right: 4px;
}
.fault p {
  font-size: 18px;
  font-weight: 400;
  color: rgba(78, 87, 117, 1);
  margin: 9px 66px 0 72px;
}
.fault_t span {
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
.disposal_y {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #78dcfa;
  border-radius: 4px;
  top: 71px;
  right: 130px;
}
.disposal_f {
  position: absolute;
  width: 90px;
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
  right: 25px;
  margin-top: -2px;
}
.disposal_c {
  background: rgba(238, 166, 124, 1);
  top: 97px;
}
.disposal_c1 {
  background: #40b7b1;
  top: 120px;
}
.disposal_h {
  top: 94px;
}
.disposal_h1 {
  top: 120px;
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
#statistics {
  width: 335px;
  height: 220px;
  margin-top: -5px;
}
</style>
