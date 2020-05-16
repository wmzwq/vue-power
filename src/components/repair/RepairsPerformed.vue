<template>
  <div>
    <van-nav-bar title="抢修执行" left-arrow @click-left="onClickLeft" />
    <div class="title">基础信息</div>
    <van-cell-group>
      <van-cell>
        <template slot="title">
          <label>客户：</label>
          <input type="text" v-model="customer" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>联系人：</label>
          <input type="text" v-model="contact" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>业务来源：</label>
          <input type="text" v-model="business" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>订单创建：</label>
          <input type="text" v-model="order" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>故障等级：</label>
            <input type="text" v-model="faultLevel" :readonly="true" />
          </div>
        </template>
        <!-- <div class="text fr">故障等级为一般/轻度/严重。</div> -->
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>抢修期限：</label>
          <input type="text" v-model="timeLimit" :readonly="true" />
        </template>
      </van-cell>
    </van-cell-group>
    <div class="title">抢修内容</div>
    <van-cell-group>
      <van-cell>
        <template slot="title">
          <label>配电室名称：</label>
          <input type="text" v-model="roomName" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>设备名称：</label>
          <input type="text" v-model="deviceName" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="mainWidth2">
          <label>任务内容：</label>
          <input type="text" v-model="taskContent" :readonly="true" />
          </div>
        </template>
        <div class="text fr" @click="showDiolag">点击可查看详情</div>
      </van-cell>
    </van-cell-group>
    <div class="title">抢修内容</div>
    <van-cell-group>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>到达现场时间：</label>
            <input type="text" v-model="arrivalTime" :readonly="true" />
          </div>
        </template>
        <div class="sign public" @click="showActionSsheet(1)" v-fb>选择</div>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>当前位置：</label>
            <input type="text" v-model="location" :readonly="true" />
          </div>
        </template>
        <div class="sign public" @click="getLocation" v-fb>签到</div>
      </van-cell>
      <van-cell>
         <template slot="title">
          <div class="mainWidth1">
            <label>故障排除时间：</label>
            <input type="text" v-model="troubleshootingTime" :readonly="true" />
          </div>
        </template>
        <div class="sign public bgc" v-if="flag===true" v-fb>选择</div>
         <div class="sign public"  v-else @click="showActionSsheet(2)" v-fb>选择</div>
      </van-cell>
      <van-cell>
         <template slot="title">
          <div class="mainWidth1">
            <label>恢复供电时间：</label>
            <input type="text" v-model="recoveryTime" :readonly="true" />
          </div>
        </template>
         <div class="sign public bgc" v-if="flag===true" v-fb>选择</div>
         <div class="sign public"  v-else @click="showActionSsheet(3)" v-fb>选择</div>
      </van-cell>
    </van-cell-group>
    <div class="title">抢修小结</div>
    <textarea v-model="summary"></textarea>
    <div class="title">现场照片</div>
    <div class="pic">
      <van-uploader v-model="fileList" multiple :max-count="9"/>
    </div>
    <div class="project">
      <p class="fl">签名</p>
      <p class="fr" @click="clear">重置签名</p>
    </div>
    <div class="signature">
      <img :src="dataUrl" :class="['imgStyle',{ isFalse }]" />
      <vueSignature
        ref="signature"
        :sigOption="option"
        :w="'100%'"
        :h="'90px'"
        :disabled="disabled"
        :defaultUrl="dataUrl"
      ></vueSignature>
      <!-- <vueSignature ref="signature1" :sigOption="option"></vueSignature> -->
      <!-- <button @click="save">Save</button>
      <button @click="clear">Clear</button>
      <button @click="undo">Undo</button>-->
      <!-- <button @click="addWaterMark">addWaterMark</button> -->
    </div>
    <div class="footer">
      <div class="save fl commit" @click="save(2)" v-fb>保存</div>
      <div class="save fr finish" v-if="finish===false" v-fb>完成抢修</div>
      <div class="save fr finish bgColor" v-else @click="save(3)" v-fb>完成抢修</div>
    </div>
    <van-action-sheet v-model="show" title="请选择时间">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirm"
         @cancel="cancel"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import BMap from 'BMap'
export default {
  components: {},
  data () {
    return {
      isFalse: false,
      id: '',
      fId: '',
      flag: true,
      finish: false,
      checked1: true,
      checked2: false,
      checked3: false,
      customer: '',
      contact: '',
      business: '',
      order: '',
      faultLevel: '',
      timeLimit: '',
      roomName: '',
      deviceName: '',
      taskContent: '',
      arrivalTime: '',
      location: '',
      troubleshootingTime: '',
      recoveryTime: '',
      summary: '',
      fileList: [],
      stageInfo: '',
      imgUrl: '',
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)'
      },
      disabled: false,
      dataUrl: '',
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      show: false,
      getLongitude: '',
      getLatitude: '',
      base64: ''
    }
  },
  created () {
    this.$loading()
  },
  mounted () {
    this.getRepairList()
  },
  beforeUpdate () {
    this.$clear()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    onChange (event) {
      // console.log(event)
    },
    clear () {
      var _this = this
      this.isFalse = false
      _this.$refs.signature.clear()
    },
    undo () {
      var _this = this
      _this.$refs.signature.undo()
    },
    addWaterMark () {
      var _this = this
      _this.$refs.signature.addWaterMark({
        text: 'mark text', // watermark text, > default ''
        font: '20px Arial', // mark font, > default '20px sans-serif'
        style: 'all', // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill
        fillStyle: 'red', // fillcolor, > default '#333'
        strokeStyle: 'blue', // strokecolor, > default '#333'
        x: 100, // fill positionX, > default 20
        y: 200, // fill positionY, > default 20
        sx: 100, // stroke positionX, > default 40
        sy: 200 // stroke positionY, > default 40
      })
    },
    fromDataURL (url) {
      var _this = this
      _this.$refs.signature.fromDataURL('data:image/png;base64,iVBORw0K...')
    },
    handleDisabled () {
      var _this = this
      _this.disabled = !_this.disabled
    },
    randomWord (randomFlag, min, max) {
      var str = ''
      var range = min
      var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min
      }
      for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      return str
    },
    base64ImgtoFile (dataurl, filename = 'file') {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    },
    async save (TaskStatus) {
      this.$loading()
      var pic = this.randomWord(false, 16)
      var _this = this
      // eslint-disable-next-line no-unused-vars
      var png = _this.$refs.signature.save()
      // eslint-disable-next-line no-unused-vars
      var jpeg = _this.$refs.signature.save('image/jpeg')
      // eslint-disable-next-line no-unused-vars
      var svg = _this.$refs.signature.save('image/svg+xml')
      this.imgUrl = png
      var imgFile = this.base64ImgtoFile(this.imgUrl)
      console.log(this.dataUrl)
      if (this.dataUrl !== '' && imgFile.size === 6570) {
        imgFile = this.base64ImgtoFile(this.base64)
      }
      const formData = new FormData()
      formData.append('loginMark', localStorage.getItem('loginMark'))
      formData.append('token', localStorage.getItem('token'))
      formData.append(
        'data', '{"keyValue":"' + this.$route.query.id + '","F_Picture":"' + pic + '"}'
      )
      formData.append('file', imgFile)
      // console.log(svg)
      const { data: res1 } = await this.$http
        .post(
          'CustomerDataAPI/Glasow',
          formData
        )
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res1.code === 200) {
      } else {
        this.$toast({
          message: res1.info,
          className: 'error'
        })
      }
      console.log(res1)
      const formData1 = new FormData()
      formData1.append('loginMark', localStorage.getItem('loginMark'))
      formData1.append('token', localStorage.getItem('token'))
      formData1.append(
        'data',
        '{"keyValue":"' +
            this.fId +
            '"}'
      )
      this.fileList.forEach(item => {
        formData1.append('file', item.file)
      })
      // console.log(svg)
      const { data: res2 } = await this.$http
        .post(
          'CustomerDataAPI/Picture',
          formData1
        )
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res2.code === 200) {
      } else if (res2.code === 400) {
        if (this.fileList.length !== 0) {

        }
      } else {
        this.$toast({
          message: res2.info,
          className: 'error'
        })
      }
      console.log(res2)
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/RushRepairTaskEditor',
          this.$qs.stringify({
            data: '{"keyValue":"' + this.fId + "\",\"strEntity\":\"{'F_ExecuteDate':'" + this.arrivalTime + "','F_SignIn':'1','F_AccomplishDate':'" + this.troubleshootingTime + "','F_PowerSupplyTime':'" + this.recoveryTime + "','F_RepairSummary':'" + this.summary + "','F_TaskStatus':'" + TaskStatus + "'}\"}"
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
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
      if (res.code === 200 && res1.code === 200) {
        this.finish = true
        this.$toast({
          message: '保存成功',
          className: 'success'
        })
      }
      this.$clear()
    },
    async getRepairList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/RepairList',
          this.$qs.stringify({
            data: "{'F_Id':'" + this.$route.query.id + "'} "
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
        this.fId = res.data[0].F_Id
        if (res.data[0].F_FullName !== null) {
          this.customer = res.data[0].F_FullName
        }
        if (res.data[0].F_TaskType === 0) {
          this.business = '故障报警'
        } else {
          this.business = '客户抢修'
        }
        this.order = res.data[0].F_CreateDate
        if (res.data[0].F_UrgencyStatus === 0) {
          this.faultLevel = '一般'
        } else if (res.data[0].F_UrgencyStatus === 1) {
          this.faultLevel = '轻度'
        } else {
          this.faultLevel = '严重'
        }
        this.timeLimit = res.data[0].F_PlanAccomplishDate
        this.roomName = res.data[0].RoomName
        this.deviceName = res.data[0].HardwareName
        this.taskContent = res.data[0].F_TaskContent
        var arr = res.data[0].F_LocationMap.split(',')
        this.getLongitude = arr[0]
        this.getLatitude = arr[1]
        if (res.data[0].F_ExecuteDate !== null) {
          this.arrivalTime = res.data[0].F_ExecuteDate
        }
        if (res.data[0].F_SignIn === 1) {
          this.location = '已签到'
        }
        if (res.data[0].F_AccomplishDate !== null) {
          this.troubleshootingTime = res.data[0].F_AccomplishDate
        }
        if (res.data[0].F_PowerSupplyTime !== null) {
          this.recoveryTime = res.data[0].F_PowerSupplyTime
        }
        if (res.data[0].F_RepairSummary !== null) {
          this.summary = res.data[0].F_RepairSummary
        }
        if (res.data[0].F_TaskStatus === 3) {
          this.finish = true
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      this.getPicture(res.data[0].F_Picture)
      this.getSignature(res.data[0].F_Glasow)
      console.log(res)
    },
    async getPicture (id) {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ExaminePicture',
          this.$qs.stringify({
            data: '{"keyValue":"' + id + '"}'
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
        if (res.data.length !== 0) {
          res.data.forEach(item => {
            item.F_FilePath.indexOf('/')
            var index = item.F_FilePath.indexOf('/', item.F_FilePath.indexOf('/') + 1)
            var FilePath = 'http://122.228.89.215:8899' + item.F_FilePath.slice(index)
            this.fileList.push({ url: FilePath })
          })
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getSignature (id) {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ExaminePicture',
          this.$qs.stringify({
            data: '{"keyValue":"' + id + '"}'
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
        if (res.data.length !== 0) {
          var index = res.data[0].F_FilePath.indexOf('/', res.data[0].F_FilePath.indexOf('/') + 1)
          var FilePath = 'http://122.228.89.215:8899' + res.data[0].F_FilePath.slice(index)
          this.dataUrl = FilePath
          this.base64 = 'data:image/png;base64,' + res.data[0].F_PictureData
          if (res.data[0].F_FileSize === 6570) {} else {
            this.isFalse = true
          }
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    getLocation () {
      this.$loading()
      var self = this
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(async (r) => {
        var map = new BMap.Map('')
        var pointA = new BMap.Point(
          parseFloat(r.point.lng),
          parseFloat(r.point.lat)
        )
        var pointB = new BMap.Point(
          parseFloat(self.getLongitude),
          parseFloat(self.getLatitude)
        )
        var distance = map.getDistance(pointA, pointB).toFixed(2) // 保留小数点后两位
        if (distance < 100) {
          self.location = '已进入签到范围'
          const { data: res } = await this.$http
            .post(
              'CustomerDataAPI/GetRushRepairTask',
              this.$qs.stringify({
                data: '{"keyValue":"' + this.$route.query.id + '"}'
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
            this.$toast({
              message: '签到成功',
              className: 'success'
            })
          } else {
            this.$toast({
              message: res.info,
              className: 'error'
            })
          }
          console.log(res)
          this.flag = false
        } else {
          self.location = '距离签到范围' + ((distance - 100) / 1000).toFixed(2) + 'km'
        }
      })
      this.$clear()
    },
    format (time, format) {
      var t = new Date(time)
      var tf = (i) => { return (i < 10 ? '0' : '') + i }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (a) => {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
          case 'MM':
            return tf(t.getMonth() + 1)
          case 'mm':
            return tf(t.getMinutes())
          case 'dd':
            return tf(t.getDate())
          case 'HH':
            return tf(t.getHours())
          case 'ss':
            return tf(t.getSeconds())
        }
      })
    },
    showActionSsheet (id) {
      this.show = true
      this.id = id
    },
    confirm (value) {
      this.show = false
      var dataTime = this.format(value, 'yyyy-MM-dd HH:mm:ss')
      if (this.id === 1) {
        this.arrivalTime = dataTime
      }
      if (this.id === 2) {
        this.troubleshootingTime = dataTime
      }
      if (this.id === 3) {
        this.recoveryTime = dataTime
      }
      console.log(dataTime)
    },
    cancel () {
      this.show = false
    },
    showDiolag () {
      this.$dialog.alert({
        title: '抢修内容',
        message: this.taskContent
      })
    }
  }
}
</script>
<style scoped lang="less">
.title {
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  margin: 15px 0 15px 20px;
}
.van-cell {
  width: 335px;
  margin: 0 20px;
}
.van-cell__title,
.van-cell__value {
  margin-left: -13px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
}
.van-checkbox {
  float: right;
  margin-left: 12px;
}
.van-cell:not(:last-child)::after {
  border-bottom: 1px solid #dbdbdb;
}
.public {
  float: right;
  width: 54px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  font-weight: 400;
}
.sign {
  background: rgba(69, 192, 163, 1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
}
.text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 101, 101, 1);
}
input {
  border: none;
  color: rgba(47, 47, 47, 1);
  margin-left: 4px;
}
.project {
  width: 335px;
  height: 17px;
  margin: 15px 20px 9px;
}
.project p {
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
}
.footer {
  width: 335px;
  height: 40px;
  margin: 35px 20px 20px;
}
.save {
  width: 110px;
  height: 40px;
  background: rgba(69, 192, 163, 1);
  border-radius: 4px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.signatureBox {
  width: 100%;
  height: calc(100% - 50px);
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  z-index: 100;
  display: flex;
  flex-direction: column;
}
.canvasBox {
  box-sizing: border-box;
  flex: 1;
}
canvas {
  border-radius: 4px;
  border: 1px solid rgba(225, 225, 225, 1);
  margin: 13px 20px 0;
}
textarea {
  width: 335px;
  height: 77px;
  border-radius: 4px;
  border: 1px solid rgba(225, 225, 225, 1);
  margin: 0 20px;
}
.pic {
  width: 375px;
  background: rgba(255, 255, 255, 1);
  margin: 0 20px;
}
.mainWidth1 {
  min-width: 250px;
}
.mainWidth2 {
  min-width:228px;
  overflow:hidden;//隐藏文字
  text-overflow:ellipsis;//显示 ...
  white-space:nowrap;//不换行
}
.commit {
  margin-left: 33px;
}
.finish {
  background: rgba(215, 215, 215, 1);
  margin-right: 33px;
}
.imgStyle {
  position: absolute;
  width: 100%;
  height: 90px;
  display: none;
  z-index: 100;
}
.isFalse {
  display: block;
}
.bgc{
  background:rgba(215,215,215,1);
}
.bgColor{
  background:rgba(69,192,163,1);
  color: #fff;
}
</style>
