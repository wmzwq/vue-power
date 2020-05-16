<template>
  <div class="">
    <van-nav-bar :title="name" left-arrow @click-left="onClickLeft" />
    <div class="header flex">
      <img src="../../assets/img/intoLine.png" />
    </div>
    <p class="flex text">{{type}}</p>
    <van-cell-group class="margin">
      <van-cell>
        <van-field v-model="tank" label="柜号：" />
      </van-cell>
      <van-cell>
        <van-field v-model="model" label="型号：" />
      </van-cell>
      <van-cell>
        <van-field v-model="serialNumber" label="编号：" />
      </van-cell>
      <van-cell>
        <van-field v-model="ratedVoltage" label="额定电压：" />
      </van-cell>
      <van-cell>
        <van-field v-model="ratedCurrent" label="额定电流：" />
      </van-cell>
      <van-cell>
        <van-field v-model="manufacturer" label="生产厂家：" />
      </van-cell>
      <van-cell>
        <van-field v-model="production" label="生产日期：" />
      </van-cell>
      <van-cell>
        <van-field v-model="construction" label="施工单位：" />
      </van-cell>
      <van-cell>
        <van-field v-model="data" label="投运日期：" />
      </van-cell>
      <van-cell>
        <van-field v-model="note" label="备注：" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      tank: '',
      model: '',
      serialNumber: '',
      ratedVoltage: '',
      ratedCurrent: '',
      manufacturer: '',
      production: '',
      construction: '',
      data: '',
      note: '',
      type: '',
      name: ''
    }
  },
  mounted () {
    this.name = this.$route.query.name
    this.getList()
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/EquipmentInformation',
          this.$qs.stringify({
            data:
              "{'AppCustomId':'" + this.$route.query.id + "','dataId':'" + this.$route.query.deviceId + "'} "
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
          this.type = res.data[0].DeviceType
          this.tank = res.data[0].CabinetNumber
          this.model = res.data[0].DeviceModel
          this.serialNumber = res.data[0].DeviceNumber
          this.ratedVoltage = res.data[0].RateVoltage
          this.ratedCurrent = res.data[0].RateCurrent
          this.manufacturer = res.data[0].DeviceVender
          this.production = res.data[0].DeviceManufactureDate
          this.construction = res.data[0].BuildUnit
          this.data = res.data[0].UsingDate
          this.note = res.data[0].Remarks
        }
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
.margin{
  margin-top:15px
}
.header {
  margin-top: 15px;
}
.text {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(112, 112, 112, 1);
}
/deep/.van-field__label {
  font-size: 12px;
  color: rgba(112, 112, 112, 1);
}
</style>
