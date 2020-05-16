<template>
  <div class="">
      <van-nav-bar title="维护人员" left-arrow @click-left="onClickLeft">
      <template #right>
        <div class="nav_right">{{text}}</div>
      </template>
    </van-nav-bar>
    <div class="header" v-for="(v, index) in list" :key="index"  @click="goDetails(v)">
      <div class="header_l">
        <div class="fl">
          <img src="../../assets/img/头像.png" alt="" />
        </div>
        <div class="fl">
          <div class="header_h">
            <p>{{v.F_RealName}}</p>
            <span>{{v.F_Account}}</span>
            <div>
              <span>所属班组：</span>
              <span>{{v.F_Name}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="header_r" v-fb @click.stop="telPhone(v.F_Account)">
        <img src="../../assets/img/电 话.png" alt="" />电话
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      list: [],
      text: ''
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    goDetails (item) {
      this.$router.push({
        path: '/peopleDetails',
        query: {
          info: JSON.stringify(item)
        }
      })
    },
    telPhone (tel) {
      var phone = 'tel:' + tel
      // eslint-disable-next-line no-undef
      plus.runtime.openURL(phone)
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/MaintenancePersonnel'
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
        this.text = res.data.length
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
.nav_right {
  width: 30px;
  height: 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 11px;
  border: 1px solid rgba(188, 188, 188, 1);
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: rgba(188, 188, 188, 1);
  top: 50%;
  position: relative;
  transform: translateY(-50%);
}
.header {
  position: relative;
  width: 335px;
  height: 100px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 15px 20px 0;
  overflow: hidden;
  .header_l {
    width: 252px;
    margin: 15px 15px 0;
    .fl {
      .header_h {
        margin-left: 12px;
        p {
          display: inline-block;
          font-size: 12px;
          color: rgba(47, 47, 47, 1);
          margin-right: 10px;
          margin-bottom: 10px;
        }
        span {
          font-size: 10px;
          color: rgba(137, 145, 155, 1);
        }
      }
    }
  }
  .line {
    position: absolute;
    width: 1px;
    height: 71px;
    background: #ededed !important;
    right: 81px;
    top: 11px;
  }
  .header_r {
    position: absolute;
    width: 58px;
    height: 25px;
    border-radius: 13px;
    border: 1px solid rgba(63, 183, 175, 1);
    text-align: center;
    line-height: 25px;
    color: rgba(61, 150, 144, 1);
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size:12px;
    img {
      float: left;
      margin: 6px -6px 0 9px;
    }
  }
}
</style>
