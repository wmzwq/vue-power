<template>
  <div class="">
    <van-nav-bar
      title="在线离线"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="flex">
      <div class="summary" @click="goEquipment('')">
        <div class="disposal_t">总在线离线概括</div>
        <div id="main" @click.stop=""></div>
        <div >
          <div>
            <div class="disposal_y"></div>
            <div class="disposal_f">在线设备</div>
            <div class="disposal_s">{{onlineUnit}}</div>
          </div>
          <div>
            <div class="disposal_y disposal_c"></div>
            <div class="disposal_f disposal_h">离线设备</div>
            <div class="disposal_s disposal_h">{{lineEquipment}}</div>
          </div>
          <div>
            <div class="disposal_y disposal_l"></div>
            <div class="disposal_f disposal_h2">在线率</div>
            <div class="disposal_s disposal_h2">{{onlineRate}}</div>
          </div>
        </div>
      </div>
    </div>
     <div class="flex" :key="index" v-for="(item, index) in list">
      <div class="summary" @click="goEquipment(item[4])">
        <div class="disposal_t">{{item[3]}}</div>
        <div :id="`radar${index}`" class="echartClass"  @click.stop=""></div>
        <div>
          <div>
            <div class="disposal_y"></div>
            <div class="disposal_f">在线设备</div>
            <div class="disposal_s">{{item[0]}}</div>
          </div>
          <div>
            <div class="disposal_y disposal_c"></div>
            <div class="disposal_f disposal_h">离线设备</div>
            <div class="disposal_s disposal_h">{{item[1]}}</div>
          </div>
          <div>
            <div class="disposal_y disposal_l"></div>
            <div class="disposal_f disposal_h2">在线率</div>
            <div class="disposal_s disposal_h2">{{item[2]}}</div>
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
      list: [],
      getId: [],
      onlineUnit: 0,
      lineEquipment: 0,
      onlineRate: 0
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.getList()
    this.getList2()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goEquipment (id) {
      this.$router.push({
        path: '/equipment',
        query: {
          id: id
        }
      })
    },
    async getList () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/offlineList',
        this.$qs.stringify({
          data: "{'AppCustomId':''} "
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
        this.onlineUnit = res.data[0].allInfo[0]
        this.lineEquipment = res.data[0].allInfo[1]
        this.onlineRate = res.data[0].allInfo[2]
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
              name: '在线离线',
              type: 'pie',
              radius: ['50%', '70%'],
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
              data: [{ value: res.data[0].allInfo[0], name: '在线设备' },
                { value: res.data[0].allInfo[1], name: '离线设备' }]
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
    async getList2 () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/offlineList',
        this.$qs.stringify({
          data: "{'AppCustomId':''} "
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
        this.list = res.data[0].singleInfo
        this.$nextTick(() => {
          this.list.forEach((item, index) => {
          // 基于准备好的dom，初始化echarts实例
            this.getId.push(this.$echarts.init(document.getElementById(`radar${index}`)))
            // var chart = echarts.init(document.getElementById(`radar${index}`))
            this.getId[index].setOption({
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
                  name: '在线离线',
                  type: 'pie',
                  radius: ['50%', '70%'],
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
                  data: [{ value: item[0], name: '在线设备' },
                    { value: item[1], name: '离线设备' }]
                }
              ]
            })
          // // 使用刚指定的配置项和数据显示图表。
          // chart.setOption(option)
          })
        })
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
<style  scoped lang="less">
#main{
  width: 170px;height:170px;margin-top: 14px;
}
.echartClass{
   width: 170px;height:170px;margin-top: 14px;
}
.summary {
width:335px;
height:174px;
background:rgba(255,255,255,1);
box-shadow:0px 2px 8px 0px rgba(0,0,0,0.06),0px 0px 1px 0px rgba(0,0,0,0.08);
border-radius:6px;
  margin:15px 20px 0;
  position: relative;
}
.disposal_t {
  float: left;
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(78, 78, 78, 1);
  line-height: 17px;
  margin-top: 10px;
  margin-left: 15px;
}
.disposal_y {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #3fb7af;
  border-radius: 4px;
  top: 64px;
  right: 130px;
}
.disposal_f {
  position: absolute;
  width: 84px;
  height: 14px;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #707070;
  line-height: 14px;
  top: 60px;
  right: 36px;
}
.disposal_s {
  position: absolute;
  width: 15px;
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
  line-height: 17px;
  top: 60px;
  right: 45px;
}
.disposal_h {
  top: 86px;
}
.disposal_c {
  top: 90px;
  background: #eea67c;
}
.disposal_h2 {
  top: 112px;
}
.disposal_l {
  top: 116px;
  background: #7cc4ee;
}
</style>
