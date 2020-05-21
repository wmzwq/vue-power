<template>
  <div>
    <van-nav-bar title="消缺历史" left-arrow @click-left="onClickLeft" />
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
          <label>创建时间：</label>
          <input type="text" v-model="createData" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>缺陷等级：</label>
            <input type="text" v-model="faultLevel" :readonly="true" />
          </div>
        </template>
        <!-- <div class="text fr">缺陷等级为一般/轻度/严重。</div> -->
      </van-cell>
    </van-cell-group>
    <div class="title">任务详情</div>
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
          <label>缺陷描述：</label>
          <input type="text" v-model="taskContent" :readonly="true" />
          </div>
        </template>
        <div class="text fr" @click="showDiolag">点击可查看详情</div>
      </van-cell>
    </van-cell-group>
    <div class="title">任务执行</div>
    <van-cell-group>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>到达现场时间：</label>
            <input type="text" v-model="arrivalTime" :readonly="true" />
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>当前位置：</label>
            <input type="text" v-model="location" :readonly="true" />
          </div>
        </template>
      </van-cell>
      <van-cell>
         <template slot="title">
          <div class="mainWidth1">
            <label>故障排除时间：</label>
            <input type="text" v-model="troubleshootingTime" :readonly="true" />
          </div>
        </template>
      </van-cell>
      <van-cell>
         <template slot="title">
          <div class="mainWidth1">
            <label>恢复供电时间：</label>
            <input type="text" v-model="recoveryTime" :readonly="true" />
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <div class="title">抢修小结</div>
    <textarea v-model="summary"></textarea>
    <div class="title">现场照片</div>
    <div class="pic">
      <van-uploader v-model="fileList" multiple :max-count="max" :deletable="false"/>
    </div>
     <div class="project">
      <p class="fl">签名</p>
    </div>
    <div class="signature">
      <img :src="dataUrl" :class="['imgStyle',{ isFalse }]" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      isFalse: true,
      id: '',
      fId: '',
      flag: true,
      finish: false,
      customer: '',
      contact: '',
      createData: '',
      faultLevel: '',
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
      max: 0,
      reviewer: '',
      auditTime: ''
    }
  },
  created () {
    this.$loading()
  },
  mounted () {
    var list = JSON.parse(this.$route.query.item)
    console.log(list)
    this.customer = list.F_FullName
    this.contact = list.F_SmsName1 + ' ' + list.F_SmsNumber1
    this.createData = list.F_CreateDate
    if (list.F_Rank === 0) {
      this.faultLevel = '轻度'
    } else if (list.F_Rank === 1) {
      this.faultLevel = '一般'
    } else if (list.F_Rank === 2) {
      this.faultLevel = '严重'
    }
    this.roomName = list.RoomName
    this.deviceName = list.FullName
    this.taskContent = list.F_Describe
    var arr = list.F_Location.split(',')
    this.getLongitude = arr[0]
    this.getLatitude = arr[1]
    this.summary = list.F_FeedbackSummary
    this.fId = list.F_Id
    if (list.F_SignInTime !== null && list.F_SignInTime !== '') {
      this.location = '已签到'
      this.flag = false
      this.arrivalTime = list.F_SignInTime
    }
    if (list.F_FaultAccomplish !== null && list.F_FaultAccomplish !== '') {
      this.troubleshootingTime = list.F_FaultAccomplish
    }
    if (list.F_RecoveryTime !== null && list.F_RecoveryTime !== '') {
      this.recoveryTime = list.F_RecoveryTime
    }
    this.getPicture(list.F_Id)
    if (list.F_SignatureFileId !== null && list.F_SignatureFileId !== '') {
      this.signId = list.F_SignatureFileId
      this.getSignature(list.F_SignatureFileId)
    }
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
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
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
  background:rgba(215,215,215,1);
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
.signature{
overflow:hidden;
height:90px;
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
