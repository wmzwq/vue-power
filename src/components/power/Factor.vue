<template>
  <div class="">
    <van-nav-bar
      title="功率因数"
      left-arrow
      @click-left="onClickLeft"
    />
     <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change"/>
      </van-dropdown-menu>
    </div>
    <div class="flex" @click="goDetail">
      <div class="card">
        <div class="disposal_t">功率因数概括</div>
        <div class="meter">
          <div class="meter_mar">
            <div id="current"></div>
            <div class="meter_t">当前功率因数: <span>{{powerFactor}}</span></div>
          </div>
        </div>
        <div class="meter">
          <div>
            <div  id="month"></div>
            <div class="meter_t">本月平均功率因数: <span>{{averagePowerFactor}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
       <div class="historyPower">
           <div class="disposal_t history_t">近一月历史功率因数</div>
           <div id="history"></div>
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
      powerFactor: 0,
      averagePowerFactor: 0,
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
    this.value = this.option[1].value
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goDetail () {
      var box = document.getElementsByClassName('van-ellipsis')
      this.$router.push({
        path: '/details',
        query: {
          id: this.value,
          text: box[1].innerText
        }
      })
    },
    async getList () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/powerFactor',
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
        this.xdata = []
        this.ydata = []
        if (res.data.length !== 0) {
          this.powerFactor = res.data[0].powerFactorSingle.toFixed(2)
          this.averagePowerFactor = res.data[0].powerFactorSingleAverage.toFixed(2)
          res.data[0].powerFactorSingleList.forEach((item) => {
            this.xdata.push(item.CreatDate.slice(0, item.CreatDate.indexOf(' ')))
            this.ydata.push(item.PfAvg.toFixed(2))
          })
          console.log(this.xdata)
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('current'))
        var myChart1 = echarts.init(document.getElementById('month'))
        var myChart2 = echarts.init(document.getElementById('history'))
        var option = {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}'
          },
          series: [
            {
              name: '功率因数',
              type: 'gauge',
              radius: '80%',
              splitNumber: 4,
              toolbox: {
                // 工具栏 如刷新、保存为图片等
                show: false
                /* feature : {
                               mark : {show: true},
                               restore : {show: true},
                               saveAsImage : {show: true}
                           } */
              },
              pointer: {
                // 仪表盘指针。
                show: true, // 是否显示指针,默认 true。
                length: '80%', // 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
                width: 5 // 指针宽度,默认 8。
              },
              min: 0, // 最小的数据值,默认 0 。映射到 minAngle。
              max: 1, // 最大的数据值,默认 100 。映射到 maxAngle。
              axisLine: {
                lineStyle: {
                  width: 15,
                  // 属性lineStyle控制线条样式
                  color: [
                    [0.1, '#7CC4EE'],
                    [0.5, '#41B7AF'],
                    [1, '#EDA77C']
                  ]
                }
              },
              splitLine: {
                // 分隔线样式。
                show: true, // 是否显示分隔线,默认 true。
                length: 15, // 分隔线线长。支持相对半径的百分比,默认 30。
                lineStyle: {
                  // 分隔线样式。
                  color: '#eee', // 线的颜色,默认 #eee。
                  opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                  width: 2, // 线度,默认 2。
                  type: 'solid', // 线的类型,默认 solid。 此外还有 dashed,dotted
                  shadowBlur: 10, // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                  shadowColor: '#fff' // 阴影颜色。支持的格式同color。
                }
              },
              detail: {
                // 最下边数值的设置
                show: false
              },
              data: [
                {
                  value: this.powerFactor
                }
              ]
            }
          ]
        }
        var option1 = {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}'
          },
          series: [
            {
              name: '功率因数',
              type: 'gauge',
              radius: '80%',
              splitNumber: 4,
              toolbox: {
                // 工具栏 如刷新、保存为图片等
                show: false
                /* feature : {
                               mark : {show: true},
                               restore : {show: true},
                               saveAsImage : {show: true}
                           } */
              },
              pointer: {
                // 仪表盘指针。
                show: true, // 是否显示指针,默认 true。
                length: '80%', // 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
                width: 5 // 指针宽度,默认 8。
              },
              min: 0, // 最小的数据值,默认 0 。映射到 minAngle。
              max: 1, // 最大的数据值,默认 100 。映射到 maxAngle。
              axisLine: {
                lineStyle: {
                  width: 15,
                  // 属性lineStyle控制线条样式
                  color: [
                    [0.1, '#7CC4EE'],
                    [0.5, '#41B7AF'],
                    [1, '#EDA77C']
                  ]
                }
              },
              splitLine: {
                // 分隔线样式。
                show: true, // 是否显示分隔线,默认 true。
                length: 15, // 分隔线线长。支持相对半径的百分比,默认 30。
                lineStyle: {
                  // 分隔线样式。
                  color: '#eee', // 线的颜色,默认 #eee。
                  opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                  width: 2, // 线度,默认 2。
                  type: 'solid', // 线的类型,默认 solid。 此外还有 dashed,dotted
                  shadowBlur: 10, // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                  shadowColor: '#fff' // 阴影颜色。支持的格式同color。
                }
              },
              detail: {
                // 最下边数值的设置
                show: false
              },
              data: [
                {
                  value: this.averagePowerFactor
                }
              ]
            }
          ]
        }
        var option2 = {
          color: ['#3FB7AF'],
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
              axisTick: {
                alignWithLabel: true
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
              name: '功率因素',
              type: 'bar',
              barWidth: '60%',
              data: this.ydata
            }
          ]
        }
        myChart.setOption(option, true)
        myChart1.setOption(option1, true)
        myChart2.setOption(option2, true)
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    change () {
      this.$loading()
      this.getList()
    }
  }
}
</script>
<style  scoped lang="less">
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
.card{
width:335px;
height:180px;
background:rgba(255,255,255,1);
box-shadow:0px 2px 8px 0px rgba(0,0,0,0.06),0px 0px 1px 0px rgba(0,0,0,0.08);
border-radius:6px;
  margin: 15px 20px 0;
}
.meter {
  float: left;
}
.disposal_t {
  width: 72px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(78, 78, 78, 1);
  line-height: 17px;
  margin-top: 10px;
  margin-left: 15px;
}
.meter_t {
  font-size: 10px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  margin-left: 26px;
  position: relative;
  margin-top: -8px;
  z-index: 5;
}
.historyPower{
width:335px;
height:240px;
background:rgba(255,255,255,1);
box-shadow:0px 2px 8px 0px rgba(0,0,0,0.06),0px 0px 1px 0px rgba(0,0,0,0.08);
border-radius:6px;
margin: 15px 20px 0;
}
.history_t{
    width:108px;
}
.meter_mar1{
  margin-top:30px
}
#current,#month{
  width: 150px;height:124px
}
#history{
  width: 320px;height:230px;margin-top: -26px;
}
</style>
