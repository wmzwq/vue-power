<template>
  <div>
    <van-nav-bar title="故障上报" left-arrow @click-left="onClickLeft" />
    <div class="title">基础信息</div>
    <van-cell-group>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>客户：</label>
            <input type="text" v-model="customer" :readonly="true" />
          </div>
        </template>
        <div class="sign public" @click="showCustomerActionSsheet" v-fb>选择</div>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>联系人：</label>
          <input type="text" v-model="contact" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>联系电话：</label>
          <input type="text" v-model="phone" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <div class="fl">故障等级</div>
        <div>
          <div :class="['leval', 'fr', { isFalse: checked1 }]" v-fb @click="check(1)">重度</div>
          <div :class="['leval', 'fr', { isFalse: checked2 }]" v-fb @click="check(2)">一般</div>
          <div :class="['leval', 'fr', { isFalse: checked3 }]" v-fb @click="check(3)">轻度</div>
        </div>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>配电房：</label>
            <input type="text" v-model="roomName" :readonly="true" />
          </div>
        </template>
        <div class="sign public" @click="showRoomActionSsheet" v-fb>选择</div>
      </van-cell>
      <van-cell>
        <template slot="title">
          <div class="mainWidth1">
            <label>设备名称：</label>
            <input type="text" v-model="deviceName" :readonly="true" />
          </div>
        </template>
        <div class="sign public" @click="showDeviceActionSsheet" v-fb>选择</div>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>故障描述：</label>
          <input type="text" v-model="description" />
        </template>
      </van-cell>
    </van-cell-group>
    <div class="title">附件</div>
    <div class="pic">
      <van-uploader v-model="fileList" multiple :max-count="9" />
    </div>
    <div class="footer">
      <div class="save" @click="save(2)" v-fb>提交</div>
    </div>
    <van-action-sheet
      v-model="showCustomer"
      title="选择客户"
      cancel-text="取消"
      @cancel="onCanceCustomer"
    >
      <div
        class="content"
        v-for="(v, index) in option"
        :key="index"
        @click="closeCustomer(v.F_FullName,v.F_Id,v.F_SmsName1,v.F_SmsNumber1)"
      >{{v.F_FullName}}</div>
    </van-action-sheet>
    <van-action-sheet v-model="showRoom" title="选择配电室" cancel-text="取消" @cancel="onCanceRoom">
      <div
        class="content"
        v-for="(v, index) in roomList"
        :key="index"
        @click="closeRoom(v.F_Id,v.RoomName)"
      >{{v.RoomName}}</div>
    </van-action-sheet>
    <van-action-sheet v-model="showDevice" title="选择设备" cancel-text="取消" @cancel="onCanceDevice">
      <div
        class="content"
        v-for="(v, index) in deviceList"
        :key="index"
        @click="closeDevice(v.F_FullName,v.F_Id)"
      >{{v.F_FullName}}</div>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
      customer: '',
      contact: '',
      phone: '',
      roomName: '',
      deviceName: '',
      description: '',
      fileList: [],
      showCustomer: false,
      option: [],
      customerId: '',
      showRoom: false,
      showDevice: false,
      roomList: [],
      roomId: '',
      deviceList: [],
      deviceId: '',
      F_UrgencyStatus: 3
    }
  },
  created () {
    this.$loading()
  },
  mounted () {
    this.option = JSON.parse(localStorage.getItem('custorm'))
  },
  beforeUpdate () {
    this.$clear()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    check (i) {
      switch (i) {
        case 1:
          if (this.checked1 === false) {
            this.checked1 = true
          } else {
            this.checked1 = false
          }
          this.checked2 = false
          this.checked3 = false
          break
        case 2:
          if (this.checked2 === false) {
            this.checked2 = true
          } else {
            this.checked2 = false
          }
          this.checked1 = false
          this.checked3 = false
          break
        case 3:
          if (this.checked3 === false) {
            this.checked3 = true
          } else {
            this.checked3 = false
          }
          this.checked2 = false
          this.checked1 = false
          break
      }
    },
    onCanceCustomer () {
      this.showCustomer = false
    },
    onCanceRoom () {
      this.showRoom = false
    },
    onCanceDevice () {
      this.showDevice = false
    },
    showCustomerActionSsheet () {
      this.showCustomer = true
    },
    closeCustomer (text, id, name, phone) {
      this.customerId = id
      this.customer = text
      this.contact = name
      this.phone = phone
      this.showCustomer = false
    },
    closeRoom (id, text) {
      this.roomId = id
      this.roomName = text
      this.showRoom = false
    },
    closeDevice (text, id) {
      this.deviceName = text
      this.deviceId = id
      this.showDevice = false
    },
    async showRoomActionSsheet () {
      if (this.customer === '') {
        this.$toast({
          message: '请先选择客户',
          className: 'error'
        })
        return false
      }
      this.$loading()
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/PersonalPowerDistributionCabinet',
          this.$qs.stringify({
            data: "{'F_Id':'" + this.customerId + "'} "
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
          this.roomList = res.data
          this.showRoom = true
        } else {
          this.$toast({
            message: '暂无配电房',
            className: 'error'
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
    async showDeviceActionSsheet () {
      if (this.roomName === '') {
        this.$toast({
          message: '请先选择配电房',
          className: 'error'
        })
        return false
      }
      this.$loading()
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/PersonalEquipment',
          this.$qs.stringify({
            data: "{'F_Id':'" + this.roomId + "'} "
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
          this.deviceList = res.data
          this.showDevice = true
        } else {
          this.$toast({
            message: '暂无设备',
            className: 'error'
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
    async save () {
      if (this.fileList.length === 0) {
        return this.$toast({
          message: '照片不能为空',
          className: 'error'
        })
      }
      if (this.checked1 === true) {
        this.F_UrgencyStatus = 2
      } else if (this.checked2 === true) {
        this.F_UrgencyStatus = 1
      } else if (this.checked3 === true) {
        this.F_UrgencyStatus = 0
      }
      if (this.F_UrgencyStatus === 3) {
        return this.$toast({
          message: '请选择故障等级',
          className: 'error'
        })
      }
      if (this.description === '') {
        return this.$toast({
          message: '故障描述不能为空',
          className: 'error'
        })
      }
      this.$loading()
      var pic = this.randomWord(false, 16)
      const formData = new FormData()
      formData.append('loginMark', localStorage.getItem('loginMark'))
      formData.append('token', localStorage.getItem('token'))
      formData.append(
        'data',
        '{"F_CustomId":"' + this.customerId +
            '","F_RoomId":"' +
            this.roomId +
            '","F_RoomId":"' +
            this.roomId +
            '","F_EquipmentId":"' +
            this.deviceId +
            '","F_UrgencyStatus":"' +
            this.F_UrgencyStatus +
            '","F_TaskDescribe":"' +
            this.description +
            '","F_Picture":"' +
            pic +
            '"}'
      )
      this.fileList.forEach(item => {
        formData.append('file', item.file)
      })
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/PersonalEmergencyRepairReport',
          formData, {
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        this.$toast({
          message: '提交成功',
          className: 'success'
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
input {
  border: none;
  color: rgba(47, 47, 47, 1);
  margin-left: 4px;
  width: 180px;
  max-width: 200px;
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
  margin: 0 auto;
}
.mainWidth1 {
  min-width: 250px;
}
.isFalse {
  background: rgba(69, 192, 163, 1);
  color: #fff !important;
}
.leval {
  width: 54px;
  height: 25px;
  border-radius: 4px;
  border: 1px solid rgba(140, 140, 140, 1);
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  color: rgba(112, 112, 112, 1);
  margin-left: 10px;
}
.content {
  padding: 16px;
  text-align: center;
}
</style>
