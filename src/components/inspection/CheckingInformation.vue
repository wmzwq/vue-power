<template>
  <div class="">
    <van-nav-bar title="巡检信息" left-arrow @click-left="onClickLeft" />
    <div class="title">基本信息</div>
    <van-cell-group class="group1 flex3">
      <van-cell>
        <template slot="title">
          <label>巡检任务编号：</label>
          <input type="text" v-model="code" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>巡检类型：</label>
          <input type="text" v-model="type" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>创建时间：</label>
          <input type="text" v-model="timer" :readonly="true" />
        </template>
      </van-cell>
    </van-cell-group >
    <div class="title">客户信息</div>
    <van-cell-group class="group2 flex3">
      <van-cell>
        <template slot="title">
          <label>客户：</label>
          <input type="text" v-model="customer" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>负责人：</label>
          <input type="text" v-model="head" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>联系电话：</label>
          <input type="text" v-model="phone2" :readonly="true" />
        </template>
      </van-cell>
    </van-cell-group>
    <div class="btn" @click="recieve" v-fb>领取</div>
  </div>
</template>

<script>
export default {
  components: {},
  created () {
    this.$loading()
    this.getTaskInfo()
  },
  beforeUpdate () {
    this.$clear()
  },
  data () {
    return {
      code: '',
      timer: '',
      type: '',
      phone2: '',
      customer: '',
      head: ''
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getTaskInfo () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/GetTaskInfo',
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
        this.code = res.data[0].F_Id
        if (res.data[0].F_DispatchType === '1') {
          this.type = '班组成员领取任务'
        }
        if (res.data[0].F_DispatchType === '2') {
          this.type = '指派人员领取任务'
        }
        this.timer = res.data[0].F_CreateDate
        this.customer = res.data[0].F_FullName
        this.head = res.data[0].F_SmsName1
        this.phone2 = res.data[0].F_SmsNumber1
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async recieve () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/GetTask',
          this.$qs.stringify({
            data: "{'keyValue':'" + this.$route.query.id + "'} "
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
          message: '领取成功',
          className: 'success'
        })
        this.$router.push({
          path: '/performed',
          query: {
            id: this.$route.query.id
          }
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
.btn{
  width:110px;
height:40px;
background:rgba(69,192,163,1);
border-radius:4px;
margin: 16px auto;
font-size:14px;
color:rgba(255,255,255,1);
text-align: center;
line-height: 40px;
}
.group1{
  height:226px;
}
.group2{
  height:168px;
}
</style>
