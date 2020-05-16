<template>
  <div class="">
    <van-nav-bar :title="name" left-arrow @click-left="onClickLeft" />
    <div class="header">
      <div class="flex2">
        <div class="header_t">
          <img src="../../assets/img/Group 6.png" />
          <span>配电房数</span>
          <div class="text">
            {{roomNum}}
          </div>
        </div>
        <div class="header_t">
          <img src="../../assets/img/Group 7.png" />
          <span>台账数</span>
          <div class="text">
            {{equipNum}}
          </div>
        </div>
      </div>
    </div>
    <div v-for="(v, index) in list" :key="index">
      <div class="middle">
        <div class="block">
          <div class="fl room">
            <img src="../../assets/img/tz1.png" />
            <span class="titleLeft">{{v.TransformerRoomName}}</span>
          </div>
          <div class="fr textRight">{{v.StandingBook.length}}</div>
        </div>
      </div>
      <div class="footer" @click="goIntoLine(item.DeviceName,v.TransformerParentCompanyId,item.F_Id)" v-for="(item, i) in v.StandingBook" :key="i">
        <div class="block">
          <div class="footer_h">
            <div class="fl titleLeft">{{item.DeviceName}}</div>
            <div class="fr textRight">{{item.DeviceType}}</div>
          </div>
          <div class="footer_f">
            <div class="intoLine">
              <span>柜号:</span>
              <span class="marL1">{{item.CabinetNumber}}</span>
              <span class="marL2">型号:</span>
              <span class="marL1"> {{item.DeviceModel}}</span>
            </div>
            <div class="intoLine" style="margin-top:5px">
              <span>编号:</span>
              <span class="marL1">{{item.DeviceNumber}}</span>
              <span class="marL2">投运:</span>
              <span class="marL1"> {{item.DeviceManufactureDate | dataFilter}}</span>
            </div>
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
      name: '',
      list: [],
      roomNum: 0,
      equipNum: 0
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
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
    this.name = this.$route.query.name
    this.roomNum = this.$route.query.roomNum
    this.equipNum = this.$route.query.equipNum
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goIntoLine (name, id, deviceId) {
      this.$router.push({
        path: '/intoLine',
        query: {
          id: id,
          name: name,
          deviceId: deviceId
        }
      })
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/DistributionRoomInformation',
          this.$qs.stringify({
            data:
              "{'AppCustomId':'" + this.$route.query.id + "'} "
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
          this.list = res.data
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
.marL1{
  margin-left:6px
}
.marL2{
  margin-left:53px
}
.flex2 {
  display: flex;
  justify-content: space-around;
}
.titleLeft {
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
  float: left;
}
.room{
margin-top: 3px;
}
.textRight {
  background: #e1f4f0;
  border-radius: 14px;
  text-align: center;
  line-height: 22px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(71, 181, 148, 1);
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
  color: rgba(255, 255, 255, 1);
  .header_t {
    margin-top: 16px;
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
  height: 42px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
  overflow: hidden;
  .block {
    margin: 10px 15px;
    .fl {
      img {
        float: left;
      }
      span {
        margin-left: 5px;
      }
    }
    .fr {
      width: 30px;
      height: 22px;
    }
  }
}
.footer {
  width: 335px;
  height: 90px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
  overflow: hidden;
  .block {
    margin: 15px;
    .footer_h {
      overflow: hidden;
      .fr {
        width: 58px;
        height: 22px;
      }
    }
    .footer_f {
      margin-top: 6px;
      .intoLine {
        font-size: 10px;
        color: rgba(137, 145, 155, 1);
      }
    }
  }
}
</style>
