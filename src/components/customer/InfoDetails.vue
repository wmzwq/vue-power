<template>
  <div class>
    <van-nav-bar :title="name" left-arrow @click-left="onClickLeft" />
    <div class="title">基本信息</div>
    <van-cell-group class="group1 flex3">
      <van-cell>
        <template slot="title">
          <label>地址：</label>
          <input type="text" v-model="address" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>联系人：</label>
          <input type="text" v-model="people" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>客户分类：</label>
          <input type="text" v-model="type" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>用电分类：</label>
          <input type="text" v-model="type1" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>电压等级：</label>
          <input type="text" v-model="voltage" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>计量方式：</label>
          <input type="text" v-model="type2" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>设备安装日期：</label>
          <input type="text" v-model="time" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>合同容量：</label>
          <input type="text" v-model="capacity" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>运行容量：</label>
          <input type="text" v-model="contract" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>户号：</label>
          <input type="text" v-model="number" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>供电单位：</label>
          <input type="text" v-model="unit" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>备注：</label>
          <input type="text" v-model="description" :readonly="true" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  components: {},
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  data () {
    return {
      name: '',
      address: '',
      people: '',
      type: '',
      type1: '',
      voltage: '',
      type2: '',
      time: '',
      capacity: '',
      contract: '',
      number: '',
      unit: '',
      description: ''
    }
  },
  mounted () {
    var list = JSON.parse(this.$route.query.info)
    console.log(list)
    this.name = list.F_FullName
    this.address = list.F_CustomAddress
    this.people = list.F_SmsName1 + ' ' + list.F_SmsNumber1
    this.type = list.F_CustomType
    this.type1 = list.F_PowerType
    if (list.F_PowerVoltage === 0) {
      this.voltage = '0-1kv'
    } else if (list.F_PowerVoltage === 1) {
      this.voltage = '1-10kv'
    } else if (list.F_PowerVoltage === 2) {
      this.voltage = '10-20kv'
    } else if (list.F_PowerVoltage === 3) {
      this.voltage = '20-35kv'
    } else if (list.F_PowerVoltage === 4) {
      this.voltage = '35-110kv'
    } else if (list.F_PowerVoltage === 5) {
      this.voltage = '110-220kv'
    }
    this.type2 = list.F_MeteringType
    this.time = list.F_ModifyDate
    this.capacity = list.F_PowerCapacity
    this.contract = list.F_ContractCapacity
    this.number = list.F_CustomNumber
    this.unit = list.F_SupplyUnit
    this.description = list.F_Description
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
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
input {
  border: none;
  color: rgba(47, 47, 47, 1);
  margin-left: 2px;
  margin-left: 4px;
  width: 228px;
}
</style>
