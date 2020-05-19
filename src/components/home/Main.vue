<template>
  <div class v-cloak>
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <div class="header">
        <div class="header_title">
          <van-icon name="friends-o" class="fl" />
          <div class="fl">
            <van-dropdown-menu>
              <van-dropdown-item v-model="value" :options="option" @change="change" />
            </van-dropdown-menu>
          </div>
        </div>
        <div class="flex">
          <div class="security">
            <img src="../../assets/img/sy.png" alt />
            <div class="security_t">
              <p class="p1" v-cloak>{{ securityNumber }}</p>
              <p class="p2">安全运行天数</p>
            </div>
          </div>
        </div>
        <div class="flex2">
          <div>
            <div>
              <div class="point"></div>
              <span>配电房</span>
            </div>
            <p>{{ transformerRoom }}</p>
          </div>
          <div>
            <div>
              <div class="point"></div>
              <span>设备</span>
            </div>
            <p>{{ equipment }}</p>
          </div>
          <div>
            <div>
              <div class="point"></div>
              <span>容量</span>
            </div>
            <p>{{ capacity }}Kw</p>
          </div>
        </div>
      </div>
      <div class="main">
        <van-grid square :border="false" :column-num="4">
          <van-grid-item
            v-for="(v, index) in myApplication"
            :key="index"
            @click="jump(v.routing)"
            v-fb
          >
            <van-icon
              :class="v.icon"
              :color="v.color"
              v-if="v.text === '在线离线' && online !== 0"
              :info="online"
            />
            <van-icon
              :class="v.icon"
              :color="v.color"
              v-else-if="v.text === '抢修任务' && repair !== 0"
              :info="repair"
            />
            <van-icon
              :class="v.icon"
              :color="v.color"
              v-else-if="v.text === '巡检任务' && inspection !== 0"
              :info="inspection"
            />
               <van-icon
              :class="v.icon"
              :color="v.color"
              v-else-if="v.text === '缺陷任务' && defect !== 0"
              :info="defect"
            />
            <van-icon :class="v.icon" :color="v.color" v-else />
            <p class="gird_text">{{ v.text }}</p>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="footer" @click="goMesssage">
        <img src="../../assets/img/消息.png" alt />
        <span>{{text}}</span>
        <van-icon name="arrow" class="footer-icon" size="24">
          <div class="info" v-if="pushnum!==0">{{pushnum}}</div>
        </van-icon>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  components: {},
  created () {
    this.$loading()
    this.getCustomInfo()
    const myApplication = JSON.parse(localStorage.getItem('myApplication'))
    if (myApplication !== null) {
      this.myApplication = myApplication
      this.myApplication.push({
        id: 0,
        icon: 'iconfont homeOptions',
        text: '更多',
        color: '#67AFEB',
        routing: '/more'
      })
    }
    console.log(myApplication)
  },
  beforeUpdate () {
    this.$clear()
  },
  data () {
    return {
      isLoading: false,
      value: '',
      securityNumber: 0,
      transformerRoom: 0,
      equipment: 0,
      capacity: 0,
      online: 0,
      repair: 0,
      inspection: 0,
      pushnum: 0,
      defect: 0,
      text: '您有新的任务未查看',
      option: [{ text: '全部', value: '' }],
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
        },
        {
          id: 0,
          icon: 'iconfont homeOptions',
          text: '更多',
          color: '#67AFEB',
          routing: '/more'
        }
      ]
    }
  },
  methods: {
    jump (routing) {
      this.$router.push(routing)
    },
    goMesssage () {
      this.$router.push({
        path: '/message',
        query: {
          id: this.value
        }
      })
    },
    onRefresh () {
      this.$loading()
      this.getCustomInfo()
      this.isLoading = false
    },
    async getCustomInfo () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/CustomInfo',
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
        res.data.CustomerList.forEach(v => {
          this.option.push({ text: v.F_FullName, value: v.F_Id })
        })
        localStorage.setItem('custorm', JSON.stringify(res.data.CustomerList))
        localStorage.setItem('option', JSON.stringify(this.option))
        this.securityNumber = res.data.SafeOperatingDays
        this.transformerRoom = res.data.TransformerRoomNumberes
        this.equipment = res.data.EquipmentNumberes
        this.capacity = res.data.Capacity
        if (res.data.OffLineNumberes > 99) {
          this.online = '99+'
        } else {
          this.online = res.data.OffLineNumberes
        }
        if (res.data.EliminateNumberes > 99) {
          this.defect = '99+'
        } else {
          this.defect = res.data.EliminateNumberes
        }
        if (res.data.RepairNumberes > 99) {
          this.repair = '99+'
        } else {
          this.repair = res.data.RepairNumberes
        }
        if (res.data.InspectionNumberes > 99) {
          this.inspection = '99+'
        } else {
          this.inspection = res.data.InspectionNumberes
        }
        if (res.data.pushnum > 99) {
          this.pushnum = '99+'
        } else if (res.data.pushnum === 0) {
          this.text = '当前无新的消息'
        } else {
          this.pushnum = res.data.pushnum
        }
      } else if (res.code === 401) {
        this.$clear()
        this.$dialog
          .alert({
            message: '登录信息失效'
          })
          .then(() => {
            localStorage.removeItem('user')
            this.$router.push('/login')
          })
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    change (val) {
      this.$loading()
      this.option = [{ text: '全部', value: '' }]
      this.getCustomInfo()
    }
  }
}
</script>
<style scoped lang="less">
/deep/.van-dropdown-menu__item {
  display: flex;
  flex: none;
}
.van-overlay {
  background-color: #fff;
}
.van-loading--vertical {
  transform: translate(-50%, -50%);
  left: 50%;
  bottom: 50%;
  position: absolute;
}
.header {
  width: 100%;
  height: 360px;
  background: linear-gradient(
    282deg,
    rgba(121, 175, 241, 1) 0%,
    rgba(86, 123, 207, 1) 100%
  );
  overflow: hidden;
}
.header_title {
  margin-top: 34px;
  margin-left: 23px;
  overflow: hidden;
}
.van-icon-friends-o::before {
  content: "\F05E";
  color: #fff;
  font-size: 18px;
}
.van-dropdown-menu {
  width: 116px;
  height: 17px;
  background: transparent;
}
/deep/.van-dropdown-menu__title {
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 17px;
  font-size: 12px;
}
/deep/.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0 0;
}
/deep/.van-dropdown-menu__title::after {
  right: -12px;
}
.main {
  background: rgba(255, 255, 255, 1);
}
.security {
  position: relative;
  margin-top: 22px;
}
.security_t {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
}
.security .p1 {
  font-size: 30px;
  font-weight: 400;
  color: rgba(249, 249, 249, 1);
  text-align: center;
}
.security .p2 {
  font-size: 12px;
  font-weight: 400;
  color: rgba(223, 231, 244, 1);
  margin-top: 8px;
}
.flex2 {
  display: flex;
  justify-content: space-around;
  margin-top: 33px;
}
.point {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: rgba(170, 215, 255, 1);
  border-radius: 4px;
  margin-right: 6px;
}
.flex2 span {
  font-size: 11px;
  font-weight: 400;
  color: rgba(225, 234, 249, 1);
}
.flex2 p {
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  margin-top: 4px;
}
.gird_text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  margin-top: 8px;
}
.footer {
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  margin-top: 15px;
}
.footer img {
  float: left;
  margin-left: 24px;
  margin-top: 6px;
}
.footer span {
  font-size: 12px;
  font-weight: 400;
  color: #707070;
  float: left;
  margin-top: 10px;
  margin-left: 10px;
}
.footer-icon {
  float: right;
  top: 50%;
  position: relative;
  transform: translateY(-50%);
}
.info{
  position: absolute;
    top: 50%;
    right: 30px;
    box-sizing: border-box;
    min-width: 16px;
    padding: 0 3px;
    color: #fff;
    font-weight: 500;
    font-size: 12px;
    font-family: PingFang SC,Helvetica Neue,Arial,sans-serif;
    line-height: 14px;
    text-align: center;
    background-color: #ee0a24;
    border: 1px solid #fff;
    border-radius: 16px;
    -webkit-transform: translate(50%,-50%);
    transform: translate(50%,-50%);
    -webkit-transform-origin: 100%;
    transform-origin: 100%;
}
</style>
