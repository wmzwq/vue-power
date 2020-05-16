<template>
  <div class="">
    <van-nav-bar
      title="故障报修"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change"/>
      </van-dropdown-menu>
    </div>
    <div class="flex">
      <div class="fault_data mar" >
        <div class="fault fl" @click="gorepair('5')">
          <p>{{pending}}</p>
          <div class="fault_t">
            <img src="../../assets/img/ywc.png" alt="" />
            <span>待处理</span>
          </div>
        </div>
        <div class="fault fr" @click="gorepair('8')">
          <p>{{completed}}</p>
          <div class="fault_t margin">
            <img src="../../assets/img/ywc.png" alt="" />
            <span>已完成</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="disposal">
        <div>
          <div class="disposal_t">报修报表</div>
        </div>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div
          id="main" class="disposal_e"></div>
        <div>
          <div>
            <div class="disposal_y"></div>
            <div class="disposal_f">本月待处理</div>
            <div class="disposal_s">{{pendingMonth}}</div>
          </div>
          <div>
            <div class="disposal_y disposal_c"></div>
            <div class="disposal_f disposal_h">本月已完成</div>
            <div class="disposal_s disposal_h">{{completedMonth}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="statistics">
        <div>
          <div class="disposal_t">历史记录</div>
        </div>
        <div>
          <div id="statistics"></div>
        </div>
      </div>
    </div>
    <div class="btn" @click="goReport" v-fb>故障上报</div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  components: {},
  data () {
    return {
      value: '',
      option: [
      ],
      pending: 0,
      completed: 0,
      pendingMonth: 0,
      completedMonth: 0,
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
  mounted () {
    this.option = JSON.parse(localStorage.getItem('option'))
    this.getList()
    this.getHistory()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    gorepair (value) {
      this.$router.push({
        path: '/repairList',
        query: {
          id: this.value,
          value: value
        }
      })
    },
    change () {
      this.$loading()
      this.getList()
      this.getHistory()
    },
    goReport () {
      this.$router.push('/faultReport')
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/PersonalFaultRepairServiceCount',
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
        this.pending = res.data[0].ToRepair
        this.completed = res.data[0].ToComplete
        this.pendingMonth = res.data[0].ThisMonthToRepair
        this.completedMonth = res.data[0].ThisMonthToComplete
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
              name: '报修报表',
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
                    var colorList = ['#76DDFB', '#3FB7AF']
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: [{ value: res.data[0].ThisMonthToRepair, name: '本月待处理' },
                { value: res.data[0].ThisMonthToComplete, name: '本月已完成' }]
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
      console.log(res)
    },
    async getHistory () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/PersonalFaultRepairServiceList',
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
        this.ydata = []
        var arr = res.data.reverse()
        arr.forEach(item => {
          this.xdata.push(item.Key)
          this.ydata.push(item.finish)
        })
        // 基于准备好的dom，初始化echarts实例
        var myChar = echarts.init(document.getElementById('statistics'))
        var option1 = {
          color: ['#40B7AF'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
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
              name: '历史记录',
              type: 'bar',
              barWidth: '60%',
              data: this.ydata
            }
          ]
        }

        // 使用刚指定的配置项和数据显示图表。
        myChar.setOption(option1)
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
.fault_t {
  margin: 0 54px;
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
  width: 48px;
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
  background: #76DDFB;
  border-radius: 4px;
  top: 71px;
  right: 130px;
}
.disposal_f {
  position: absolute;
  width: 84px;
  height: 14px;
  font-size: 10px;
  font-weight: 400;
  color: #707070;
  line-height: 14px;
  top: 68px;
  right: 40px;
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
}
.disposal_c {
  background:#3FB7AF;
  top: 97px;
}
.disposal_h {
  top: 94px;
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
.btn{
width:110px;
height:40px;
background:rgba(69,192,163,1);
border-radius:4px;
margin: 15px auto;
text-align: center;
line-height: 40px;
font-size:14px;
color:rgba(255,255,255,1);
}
.margin{
  margin:0 48px
}
#main{
  width: 160px;height:160px;
}
#statistics{
  width: 335px;height:220px;margin-top:-5px
}
</style>
