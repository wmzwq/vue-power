<template>
  <div class="">
    <van-nav-bar
      title="缺陷管理"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change"/>
      </van-dropdown-menu>
    </div>
    <div class="flex2 mar" @click="goList">
      <div class="fault">
        <p>{{beRidOf}}</p>
        <img src="../../assets/img/xjsj.png" alt="" />
        <span>待消缺</span>
      </div>
      <div class="fault">
        <p>{{forgettingRid}}</p>
        <img src="../../assets/img/ywc.png" alt="" />
        <span>已消缺</span>
      </div>
      <div class="fault">
        <p>{{total}}</p>
        <img src="../../assets/img/ywc.png" alt="" />
        <span>总消缺</span>
      </div>
    </div>
    <div class="flex">
      <div class="disposal">
        <div>
          <div class="disposal_t">缺陷报表</div>
        </div>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" class="disposal_e"></div>
        <div class="curve">
          <div class="pr curve_dis2">
            <div class="disposal_y curve_color1"></div>
            <div class="disposal_f">本月待消缺</div>
            <div class="disposal_s">{{out}}</div>
          </div>
          <div class="pr curve_dis3">
            <div class="disposal_y curve_color2"></div>
            <div class="disposal_f">本月已消缺</div>
            <div class="disposal_s">{{gettingRid}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="statistics">
        <div>
          <div class="disposal_t">消缺历史</div>
        </div>
        <div>
          <div  id="statistics"></div>
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
      beRidOf: '',
      forgettingRid: '',
      total: '',
      gettingRid: '',
      out: '',
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
    this.getTasks()
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goList () {
      this.$router.push({
        path: '/defectList',
        query: {
          id: this.value
        }
      })
    },
    change () {
      this.$loading()
      this.getTasks()
      this.getList()
    },
    async getTasks () {
    // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/DefectsStatistics',
        this.$qs.stringify({
          data: "{'AppCustomId':'" + this.value + "'} "
        })
      ).catch(error => {
        console.log(error.message)
        this.show = false
        this.$toast({
          message: '请求超时，请检查网络',
          className: 'error'
        })
      })
      if (res.code === 200) {
        this.beRidOf = res.data[0].ToBeRidOf
        this.forgettingRid = res.data[0].ForGettingRidOfHas
        this.total = res.data[0].OfTheTotal
        this.gettingRid = res.data[0].MonthsForGettingRidOfHas
        this.out = res.data[0].MonthsToBeRidOf
        var option = {
          tooltip: {
            trigger: 'item',
            position: 'inside',
            formatter: '{b} <br/> {c}',
            // formatter (params) {
            //   return `
            //      ${params.data.value}`
            // },
            axisPointer: {
              type: 'shadow'
            }
          },
          series: [
            {
              name: '缺陷报表',
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
                    var colorList = ['#EEA67C', '#3FB7AF']
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: [
                { value: res.data[0].MonthsToBeRidOf, name: '本月待消缺' },
                { value: res.data[0].MonthsForGettingRidOfHas, name: '本月已消缺' }
              ]
            }
          ]
        }
      } else {
        this.show = false
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    async getList () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/DefectsStatisticsList',
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
        var arr = res.data.reverse()
        arr.forEach(item => {
          this.xdata.push(item.Key)
          this.ydata.push(item.num)
        })
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
              name: '消缺历史',
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
#main{
  width: 160px;height:160px;
}
#statistics{
  width: 335px;height:220px;margin-top:-5px
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
.curve {
  position: absolute;
  top: 45px;
  right: 130px;
}
.curve_dis1{
  margin-top:18px
}
.curve_dis2{
  margin-top:44px
}
.curve_dis3{
  margin-top:70px
}
.curve_dis4{
  margin-top:96px
}
.curve_color1{
background:#EEA67C !important
}
.curve_color2{
 background:#3FB7AF!important
}
.curve_color3{
  background:#FF7171!important
}
.disposal_y {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #78dcfa;
  border-radius: 4px;
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
  top: -3px;
}
.disposal_s {
  position: absolute;
  width: 15px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
  line-height: 17px;
  left: 83px;
  top: -4px;
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
</style>
