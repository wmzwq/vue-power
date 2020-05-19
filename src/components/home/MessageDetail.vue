<template>
  <div class="message">
    <van-nav-bar :title="name" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="flex">
      <div class="header">
        <div class="header_title">
          <img src="../../assets/img/用户.png" alt />
          <div class="text">客户名称：{{name}}</div>
        </div>
        <div class="header_footer">
          <img src="../../assets/img/用户.png" alt />
          <div class="text">客户地址：{{address}}</div>
        </div>
      </div>
    </div>
    <div class="box">
        <div class="task fault">
          <div class="task_left">
            <img src="../../assets/img/报警.png" alt  v-if="Type===4"/>
            <img src="../../assets/img/任务.png" alt  v-else/>
            <div :class="['info', {'isFalse':ReadStatus===1 }]"></div>
          </div>
          <div class="task_right">
              <div class="task_rightText">报警设备：{{DeviceName}}</div>
              <div class="task_rightText">报警时间：{{CreateDate}}</div>
            <div class="task_rightText" v-if="Type===4">报警内容：{{Content}}</div>
            <div class="task_rightText" v-if="Type===0">新的巡检任务已下发</div>
            <div class="task_rightText" v-if="Type===1">新的抢修任务已下发</div>
            <div class="task_rightText" v-if="Type===2">新的缺陷任务已下发</div>
            <div class="task_rightText" v-if="Type===3">新的任务派遣任务已下发</div>
          </div>
          <div class="line"></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      name: '',
      DeviceName: '',
      address: '',
      ReadStatus: '',
      Type: 9,
      CreateDate: '',
      Content: ''
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.list = JSON.parse(this.$route.query.item)
    this.name = this.list.F_FullName
    this.DeviceName = this.list.F_DeviceName
    this.address = this.list.F_Address
    this.ReadStatus = this.list.F_ReadStatus
    this.Type = this.list.F_Type
    this.CreateDate = this.list.F_CreateDate
    this.Content = this.list.F_Content
    console.log(this.list)
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.header {
  width: 335px;
  height: 68px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin: 15px 20px;
  img {
    width: 14px;
    float: left;
  }
  .header_title {
    margin-left: 15px;
    margin-top: 17px;
    overflow: hidden;
  }
  .header_footer {
    clear: both;
    margin-left: 15px;
    margin-top: 6px;
  }
}
.text {
  float: left;
  margin: 0 6px;
  font-size: 12px;
  color: rgba(112, 112, 112, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 280px;
}
.right_title {
  font-size: 12px;
  color: rgba(47, 47, 47, 1);
}
.task:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.task {
  margin: 15px 20px;
  position: relative;
  .task_left {
    position: relative;
    float: left;
    width: 50px;
    height: 50px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(69, 192, 163, 1);
    border-radius: 6px;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .info {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      padding: 0 3px;
      color: #fff;
      font-weight: 500;
      font-size: 12px;
      font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
      line-height: 14px;
      text-align: center;
      background-color: #ee0a24;
      border: 1px solid #fff;
      -webkit-transform: translate(50%, -50%);
      transform: translate(50%, -50%);
      -webkit-transform-origin: 100%;
      transform-origin: 100%;
      width: 10px;
      min-width: 0;
      height: 10px;
      border-radius: 100%;
    }
  }
  .task_right {
    position: relative;
    float: left;
    margin-left: 15px;
    margin-top: 6px;
    max-width: 255px;
    top: 50%;
    .task_rightText {
      font-size: 12px;
      color: rgba(112, 112, 112, 1);
      margin-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      float: left;
    }
    span {
      font-size: 10px;
      color: rgba(154, 154, 154, 1);
      float: left;
    }
  }
  .line {
    overflow: hidden;
    float: left;
    margin-top: 10px;
    background: #dbdbdb;
    width: 335px;
    height: 2px;
  }
}
.fault {
  .task_left {
    margin-top: 25px;
  }
  .task_right {
    float: left;
    margin-left: 15px;
    margin-top: 0;
    .task_rightText {
      font-size: 12px;
      color: rgba(112, 112, 112, 1);
      margin-bottom: 5px;
      clear: both;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.isFalse {
  display: none;
}
</style>
