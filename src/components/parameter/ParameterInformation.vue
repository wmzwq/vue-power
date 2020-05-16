<template>
  <div class>
    <van-nav-bar title="台账信息" left-arrow @click-left="onClickLeft" />
    <div class="header">
      <div class="flex2">
        <div class="header_t">
          <img src="../../assets/img/Group 5.png" />
          <span>客户数</span>
          <div class="text">{{userNumber}}</div>
        </div>
        <div class="header_t">
          <img src="../../assets/img/Group 6.png" />
          <span>配电房数</span>
          <div class="text">{{roomNumber}}</div>
        </div>
        <div class="header_t">
          <img src="../../assets/img/Group 7.png" />
          <span>台账数</span>
          <div class="text">{{bookNumber}}</div>
        </div>
      </div>
    </div>
    <div
      class="middle"
      @click="goDetails(v.F_Id,v.F_FullName,v.roomNum,v.equipmentNum)"
      v-for="(v, index) in list"
      :key="index"
    >
      <div class="block">
        <div class="middle_h">
          <span>{{v.F_FullName}}</span>
          <div class="middle_btn">{{v.F_PowerType}}</div>
        </div>
        <div class="line"></div>
        <div class="flex2">
          <div class="middle_f">
            <img src="../../assets/img/tz1.png" />
            <span>配电房:</span>
            <span>{{v.roomNum}}</span>
          </div>
          <div class="middle_f">
            <img src="../../assets/img/tz2.png" />
            <span>台账:</span>
            <span>{{v.equipmentNum}}</span>
          </div>
          <div class="middle_f">
            <img src="../../assets/img/tz3.png" />
            <span>投运:</span>
            <span>{{v.F_InstallDate | dataFilter}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      userNumber: 0,
      roomNumber: 0,
      bookNumber: 0,
      list: []
    }
  },
  filters: {
    dataFilter (value) {
      let realVal = ''
      if (value === null || value === '') {
      } else {
        realVal = value.slice(0, value.indexOf(' '))
      }
      return realVal
    }
  },
  mounted () {
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
    goDetails (id, name, roomNum, equipNum) {
      this.$router.push({
        path: '/roomDetails',
        query: {
          id: id,
          name: name,
          roomNum: roomNum,
          equipNum: equipNum
        }
      })
    },
    async getList () {
      const { data: res } = await this.$http
        .post('CustomerDataAPI/ParameterInformation')
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        if (res.data.length !== 0) {
          this.userNumber = res.data[0].userListNumberes
          this.roomNumber = res.data[0].TransformerRoomNumberes
          this.bookNumber = res.data[0].StandingBookNumberes
          this.list = res.data[0].userList
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
.flex2 {
  display: flex;
  justify-content: space-around;
}
.header {
  width: 335px;
  height: 71px;
  background: linear-gradient(
    168deg,
    rgba(130, 185, 255, 1) 0%,
    rgba(51, 130, 221, 1) 100%
  );
  border-radius: 6px;
  margin: 15px 20px 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 1);
  .header_t {
    margin-top: 16px;
    overflow: hidden;
    img {
      float: left;
      width: 18px;
      height: 19px;
    }
    span {
      float: left;
      margin-left: 4px;
      font-size: 11px;
      font-weight: 400;
    }
    .text {
      text-align: center;
      font-size: 18px;
      font-weight: 500;
    }
  }
}
.middle {
  width: 335px;
  height: 100px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
  overflow: hidden;
  .block {
    margin: 15px;
    .middle_h {
      span {
        font-size: 12px;
        color: rgba(47, 47, 47, 1);
        display: inline-block;
        max-width: 200px;
      }
      .middle_btn {
        float: right;
        height: 22px;
        background: #e1f4f0;
        border-radius: 14px;
        font-size: 10px;
        font-weight: 400;
        color: #47b594;
        text-align: center;
        line-height: 22px;
      }
    }
    .line {
      width: 305px;
      height: 1px;
      background: #ededed;
      margin-top: 15px;
    }
    .middle_f {
      margin-top: 10px;
      img {
        float: left;
      }
      span {
        float: left;
        margin-left: 5px;
        font-size: 10px;
        font-weight: 400;
        color: rgba(137, 145, 155, 1);
      }
    }
  }
}
</style>
