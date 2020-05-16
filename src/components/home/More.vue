<template>
  <div class="">
    <van-nav-bar
      title="编辑应用"
      left-arrow
      @click-left="onClickLeft"
      v-show="flag"
    />
    <van-nav-bar title="编辑应用" left-arrow v-show="!flag">
      <span slot="left" @click="cancel" style="color:#1989FA">取消</span>
      <van-button slot="right" type="info" @click="determine">完成</van-button>
    </van-nav-bar>
    <div class="header flex">我的应用</div>
    <van-grid square :border="false" :column-num="5" style="margin-top:20px">
      <van-grid-item
        v-for="(v, i) in myApplication"
        :key="i"
        v-longtap="vueTouch"
        v-dragging="{ item: v, list: myApplication, group: 'v' }"
      >
        <van-icon :class="v.icon" :color="v.color"/>
        <p class="gird_text">{{ v.text }}</p>
        <div :class="['circle', { active: flag }]" style="background:#BFBFBF"   @click="deleteApplication(i, v.id, v)">
          x
        </div>
      </van-grid-item>
    </van-grid>
    <div class="header flex">其他应用</div>
    <div :key="index" v-for="(item, index) in application" class="pr">
      <div class="header_title" v-if="item.gird.length!==0">{{ item.title }}</div>
      <van-grid square :border="false" :column-num="5">
        <van-grid-item
          v-for="(v, i) in item.gird"
          :key="i"
          v-longtap="vueTouch"
        >
          <van-icon :class="v.icon" :color="v.color" />
          <p class="gird_text">{{ v.text }}</p>
          <div :class="['circle', { active: flag }]" @click="addApplication(i, item.id, v)">+</div>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  created () {
    const myApplication = JSON.parse(localStorage.getItem('myApplication'))
    const application = JSON.parse(localStorage.getItem('application'))
    if (myApplication !== null && application !== null) {
      this.myApplication = myApplication
      this.application = application
    }
    this.$dragging.$on('dragged', ({ value }) => {
      console.log(this.application)
      localStorage.setItem('myApplication', JSON.stringify(this.myApplication))
    })
    this.$dragging.$on('dragend', () => {})
  },
  data () {
    return {
      flag: true,
      myApplication: [
        {
          id: 0,
          icon: 'iconfont homedianliangdianfei',
          text: '电量电费',
          color: '#67AFEB',
          routing: '/energyCharge'
        },
        {
          id: 0,
          icon: 'iconfont homescada',
          text: 'SCADA',
          color: '#67AFEB',
          routing: '/scada'
        },
        {
          id: 0,
          icon: 'iconfont homeguzhangguanli',
          text: '故障管理',
          color: '#67AFEB',
          routing: '/management'
        },
        {
          id: 1,
          icon: 'iconfont homezaixianlixian',
          text: '在线离线',
          color: '#EAA364',
          routing: '/online'
        },
        {
          id: 1,
          icon: 'iconfont homeshipinjiankong',
          text: '视频监控',
          color: '#EAA364',
          routing: '/monitoring'
        },
        {
          id: 2,
          icon: 'iconfont homeqiangxiurenwu',
          text: '抢修任务',
          color: '#3DB5AF',
          routing: '/repairTask'
        },
        {
          id: 2,
          icon: 'iconfont homeziyuan1',
          text: '巡检任务',
          color: '#3DB5AF',
          routing: '/tasks'
        }

      ],
      application: [
        {
          title: '监测',
          id: 0,
          gird: [
            {
              icon: 'iconfont homefuhe',
              text: '电量负荷',
              color: '#67AFEB',
              routing: '/powerLoad'
            },
            {
              icon: 'iconfont homegongshuaiyinshu',
              text: '功率因数',
              color: '#67AFEB',
              routing: '/factor'
            }
          ]
        },
        {
          title: '实时',
          id: 1,
          gird: [
            {
              icon: 'iconfont homeGISdingwei',
              text: 'GIS定位',
              color: '#EAA364',
              routing: '/gis'
            }
          ]
        },
        {
          title: '任务',
          id: 2,
          gird: [
            {
              icon: 'iconfont homeziyuan3',
              text: '缺陷任务',
              color: '#3DB5AF',
              routing: '/defectManagement'
            }
          ]
        },
        {
          title: '其他',
          id: 3,
          gird: [
            {
              icon: 'iconfont homeziyuan5',
              text: '故障报修',
              color: '#3DB5AF',
              routing: '/faultRepair'
            },
            {
              icon: 'iconfont homeziyuan6',
              text: '客户信息',
              color: '#3DB5AF',
              routing: '/information'
            },
            {
              icon: 'iconfont homeziyuan',
              text: '维护人员',
              color: '#3DB5AF',
              routing: '/maintenance'
            },
            {
              icon: 'iconfont homeziyuan4',
              text: '台账信息',
              color: '#3DB5AF',
              routing: '/parameterInformation'
            }

          ]
        }
      ]
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1) // 返回上一层
    },
    vueTouch () {
      this.flag = false
    },
    cancel () {
      this.myApplication = JSON.parse(localStorage.getItem('myApplication'))
      this.application = JSON.parse(localStorage.getItem('application'))
      this.flag = true
    },
    determine () {
      this.flag = true
      localStorage.setItem('myApplication', JSON.stringify(this.myApplication))
      localStorage.setItem('application', JSON.stringify(this.application))
    },
    deleteApplication (i, id, item) {
      if (!this.flag) {
        this.myApplication.splice(i, 1)
        this.application[id].gird.push({ icon: item.icon, text: item.text, color: item.color, routing: item.routing })
      }
    },
    addApplication (i, id, item) {
      if (!this.flag) {
        if (this.myApplication.length < 7) {
          this.application[id].gird.splice(i, 1)
          this.myApplication.push({ id: id, icon: item.icon, text: item.text, color: item.color, routing: item.routing })
        } else {
          this.$toast({
            message: '我的应用已满，请先删除',
            className: 'warning'
          })
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.header {
  font-size: 16px;
  color: #191919;
  font-weight: 500;
  margin-top: 20px;
}
.header_title {
  font-size: 14px;
  font-weight: 500;
  color: #676767;
  margin-top: 20px;
  margin-left: 24px;
}
.gird_text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  margin-top: 8px;
}
.circle {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background: #1583ce;
  color: #fff;
  text-align: center;
  line-height: 12px;
  font-size: 14px;
  top: 8px;
  right: 10px;
}
.active {
  display: none;
}
</style>
