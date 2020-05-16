<template>
  <div class="">
    <van-nav-bar title="巡检执行" left-arrow @click-left="onClickLeft">
      <template #right>
        <van-icon class="iconfont homexinxiinformation38" color="#45C0A3" @click="goInformation"/>
      </template>
    </van-nav-bar>
    <div class="title">巡检信息</div>
    <van-cell-group>
      <van-cell title="天气">
        <van-checkbox
          v-model="checked3"
          checked-color="#45C3A4"
          @change="onChange"
        >
          阴
        </van-checkbox>
        <van-checkbox
          v-model="checked2"
          checked-color="#45C3A4"
          @change="onChange"
        >
          雨
        </van-checkbox>
        <van-checkbox
          v-model="checked1"
          checked-color="#45C3A4"
          @change="onChange"
        >
          晴
        </van-checkbox>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="cs">
            <label>气温：</label>
            <input type="text" v-model="air" :readonly="true" />
          </div>
        </template>
        <div class="gain public" @click="getWeather()" v-fb>获取</div>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="cs">
            <label>当前位置：</label>
            <input type="text" v-model="location" :readonly="true" />
          </div>
        </template>
        <div class="sign public" @click="getLocation" v-fb>签到</div>
      </van-cell>
      <!-- <van-cell>
        <template slot="title">
          <div class="cs">
            <label>巡视负责人：</label>
            <input type="text" v-model="people" :readonly="true" />
          </div>
        </template>
        <div class="text fr">点击可编辑文字</div>
      </van-cell> -->
      <van-cell>
        <template slot="title">
          <div class="cs">
            <label>负责人电话：</label>
            <input type="text" v-model="phone" :readonly="true" />
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="cs">
            <label>成员电话：</label>
            <input type="text" v-model="member" :readonly="flag" />
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="cs">
            <label>巡视内容：</label>
            <input type="text" v-model="content" :readonly="true" />
          </div>
        </template>
        <div class="text fr" @click="showDiolag">点击可查看详情</div>
      </van-cell>
    </van-cell-group>
    <div class="project">
      <p class="fl">巡检项目</p>
      <p class="fr">完成进度 {{ numble }}/{{ numbleMax }}</p>
    </div>
    <van-checkbox-group :value="result">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in list"
          clickable
          :key="index"
          :title="item.F_RoomName"
          @click.stop="goDetails(item.F_Id,item.F_Content,item.F_RoomName)"
        >
          <van-checkbox
            :name="item.F_RoomName"
            checked-color="#4AC0A8"
            ref="checkboxes"
            slot="right-icon"
            :label-disabled="true"
          />
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
    <div class="project">
      <p class="fl">签名</p>
      <p class="fr" @click="clear">重置签名</p>
    </div>
    <div class="signature">
      <img :src="dataUrl" :class="['imgStyle',{ isFalse }]">
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
      <button @click="undo">Undo</button> -->
      <!-- <button @click="addWaterMark">addWaterMark</button> -->
    </div>
    <div class="footer">
      <div class="save fl commit" @click="save('')" v-fb>保存</div>
      <div class="save fr finish" v-if="finish===false" v-fb>完成巡视</div>
        <div class="save fr finish bgColor" v-fb v-else @click="save('CheckingDetailsEditor_Finish')">完成巡视</div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import BMap from 'BMap'
export default {
  components: {},
  data () {
    return {
      isFalse: false,
      id: '',
      flag: true,
      finish: false,
      checked1: false,
      checked2: false,
      checked3: false,
      air: '',
      location: '',
      people: '***',
      phone: '',
      member: '',
      content: '',
      numble: 0,
      numbleMax: 0,
      list: [],
      result: [],
      imgUrl: '',
      getLongitude: '',
      getLatitude: '',
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)'
      },
      disabled: false,
      dataUrl: '',
      city: '',
      base64: ''
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    if (this.numble === this.numbleMax && this.location === '已进入签到范围') {
      this.finish = true
    }
    this.$clear()
  },
  mounted () {
    this.getInspectionIsPerformed()
    this.getInspectionIsPerformedItem()
    this.getPicture()
  },
  methods: {
    goInformation () {
      this.$router.push({
        path: '/checkingInformation',
        query: {
          id: this.$route.query.id
        }
      })
    },
    getWeather () {
      this.$loading()
      this.$http.get('http://api.help.bj.cn/apis/weather36h/?id=' + this.city).then((reponse) => {
        this.air = reponse.data.weather36h[0].temp + '℃'
        console.log(reponse.data)
        this.$toast({
          message: '获取成功',
          className: 'success'
        })
      }).catch(error => {
        console.log(error.message)
        this.$toast({
          message: '请求超时，请检查网络',
          className: 'error'
        })
      })
      this.$clear()
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    onChange (event) {
      // console.log(event)
    },
    async getPicture () {
      var _this = this
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ExaminePicture',
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
        if (res.data.length !== 0) {
          var index = res.data[0].F_FilePath.indexOf('/', res.data[0].F_FilePath.indexOf('/') + 1)
          var FilePath = 'http://122.228.89.215:8899' + res.data[0].F_FilePath.slice(index)
          _this.dataUrl = FilePath
          _this.base64 = 'data:image/png;base64,' + res.data[0].F_PictureData
          if (res.data[0].F_FileSize === '5912') {
            _this.isFalse = false
          } else {
            _this.isFalse = true
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
    async save (url) {
      this.$loading()
      var _this = this
      // eslint-disable-next-line no-unused-vars
      var png = _this.$refs.signature.save()
      // eslint-disable-next-line no-unused-vars
      var jpeg = _this.$refs.signature.save('image/jpeg')
      // eslint-disable-next-line no-unused-vars
      var svg = _this.$refs.signature.save('image/svg+xml')
      var Weather = 0
      if (this.checked1 === true) {
        Weather = 0
      } else if (this.checked2 === true) {
        Weather = 1
      } else {
        Weather = 2
      }
      this.imgUrl = png
      var imgFile = this.base64ImgtoFile(this.imgUrl)
      console.log(imgFile)
      if (this.dataUrl !== '' && imgFile.size === 5912) {
        imgFile = this.base64ImgtoFile(this.base64)
      }
      const formData = new FormData()
      formData.append('loginMark', localStorage.getItem('loginMark'))
      formData.append('token', localStorage.getItem('token'))
      formData.append(
        'data', '{"keyValue":"' + this.$route.query.id + '"}'
      )
      formData.append('file', imgFile)
      var air = parseFloat(this.air)
      // console.log(svg)
      const { data: res1 } = await this.$http
        .post(
          'CustomerDataAPI/InspectionIsPicture',
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
      if (url === '') {
        url = 'CustomerDataAPI/CheckingDetailsEditor'
      } else {
        url = 'CustomerDataAPI/' + url
      }
      console.log(url)
      const { data: res } = await this.$http
        .post(
          url,
          this.$qs.stringify({
            data: '{"InspectionSheetId":"' + this.id + "\",\"strEntity\":'{\"F_Weather\":" + Weather + ',"F_Temperature":' + air + ',"F_Signature":"' + this.$route.query.id + "\"}' }"
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
        this.$toast({
          message: '保存成功',
          className: 'success'
        })
      }
      this.$clear()
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
    getLocation () {
      this.$loading()
      var self = this
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
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
        console.log('您的位置：' + r.point.lng + ',' + r.point.lat)
        if (distance < 100) {
          self.location = '已进入签到范围'
        } else {
          self.location = '距离签到范围' + ((distance - 100) / 1000).toFixed(2) + 'km'
        }
      })
      const myCity = new BMap.LocalCity()
      myCity.get((result) => {
        this.city = result.name
        this.getWeather()
        console.log(result)
      })
      this.$clear()
    },
    async getInspectionIsPerformed () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/InspectionIsPerformed',
          this.$qs.stringify({
            data: "{'PlanId':'" + this.$route.query.id + "'} "
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
        this.id = res.data[0].F_Id
        if (res.data[0].F_Weather !== null) {
          if (res.data[0].F_Weather === 0) {
            this.checked1 = true
          } else if (res.data[0].F_Weather === 1) {
            this.checked2 = true
          } else {
            this.checked3 = true
          }
        }
        var arr = res.data[0].F_Location.split(',')
        this.getLongitude = arr[0]
        this.getLatitude = arr[1]
        this.getLocation()
        if (res.data[0].F_SquadCaptainPhone !== null) {
          this.phone = res.data[0].F_SquadCaptainPhone
        }
        if (res.data[0].F_StaffPhone !== null) {
          if (this.phone !== '') {
            this.member = this.phone + ',' + res.data[0].F_StaffPhone
          } else {
            this.member = res.data[0].F_StaffPhone
          }
        } else {
          this.member = this.phone
        }
        if (res.data[0].F_Content !== null) {
          this.content = res.data[0].F_Content
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getInspectionIsPerformedItem () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/InspectionIsPerformedItem',
          this.$qs.stringify({
            data: "{'PlanId':'" + this.$route.query.id + "'} "
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
        this.list = res.data
        this.numbleMax = res.data.length
        res.data.forEach(item => {
          this.result.push(item.F_Click)
        })
        this.numble = this.result.length
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    showDiolag () {
      this.$dialog.alert({
        title: '巡检内容',
        message: this.content
      })
    },
    goDetails (id, content, name) {
      this.$router.push({
        path: '/checkingDetails',
        query: {
          id: id,
          content: content,
          name: name
        }
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
.gain {
  border-radius: 13px;
  color: rgba(61, 150, 144, 1);
  border: 1px solid rgba(63, 183, 175, 1);
}
.sign {
  background: rgba(69, 192, 163, 1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
}
.text {
  font-size: 10px;
  font-weight: 400;
  color: rgba(137, 145, 155, 1);
  min-width: 84px;
}
input {
  border: none;
  color: rgba(47, 47, 47, 1);
  margin-left: 2px;
  margin-left: 4px;
}
.cs {
  min-width: 228px;
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
  margin: 20px;
}
.signature{
  position: relative;
  margin:15px 20px 0
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
.commit {
  margin-left: 33px;
}
.finish {
  background: rgba(215, 215, 215, 1);
  margin-right: 33px;
}
.imgStyle{
  position: absolute;
  width: 100%;
  height: 90px;
  display: none;
  z-index:100;
}
.isFalse{
  display: block;
}
.bgColor{
  background:rgba(69,192,163,1);
  color: #fff;
}
</style>
