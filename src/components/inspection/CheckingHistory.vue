<template>
  <div class="">
    <van-nav-bar title="巡检历史" left-arrow @click-left="onClickLeft">
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
        <div class="gain public" @click="getWeather()">获取</div>
      </van-cell>
           <van-cell>
        <template slot="title">
          <div class="cs">
            <label>签到：</label>
            <input type="text" value="已签到" :readonly="true" />
          </div>
        </template>
      </van-cell>
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
    </div>
    <div class="signature">
      <img :src="dataUrl" :class="['imgStyle',{ isFalse }]">
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
      isFalse: true,
      flag: true,
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
      dataUrl: '',
      city: ''
    }
  },
  mounted () {
    this.getInspectionIsPerformed()
    this.getInspectionIsPerformedItem()
    this.getPicture()
  },
  methods: {
    getWeather () {
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
          console.log(_this.dataUrl)
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
      const myCity = new BMap.LocalCity()
      myCity.get((result) => {
        this.city = result.name
        this.getWeather()
        console.log(result)
      })
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
        path: '/detailsFinish',
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
.signature{
  position: relative;
  margin:15px 20px 0
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
</style>
