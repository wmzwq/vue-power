<template>
  <div class>
    <van-nav-bar title="SCADA监测" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option"  @change="change" />
      </van-dropdown-menu>
    </div>
    <div class="disposal_t">{{custorm}}</div>
    <div class="flex">
      <div class="statistics">
        <div>
        <div class="block fl" @click="open(item.scada)" :key="index" v-for="(item, index) in list" >
          <div class="statistics_p">
            <img src="../../assets/img/拓扑.png" alt />
          </div>
          <p class="statistics_t flex">{{item.RoomName}}</p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  components: {},
  created () {
    this.$loading()
    this.option = JSON.parse(localStorage.getItem('option'))
    this.value = this.option[1].value
    this.custorm = this.option[1].text
  },
  data () {
    return {
      value: '',
      option: [],
      custorm: '全部',
      list: []
    }
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.getScada()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getScada () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/Scada',
          this.$qs.stringify({
            data: "{'AppCustomId':'" + this.value + "'} "
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
        var result = res.data.findIndex(item => {
          return item.F_Id === this.value
        })
        this.custorm = res.data[result].fullname
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    open (scada) {
      // eslint-disable-next-line no-undef
      plus.runtime.openURL(scada)
    },
    change (val) {
      this.$loading()
      this.getScada()
      this.$clear()
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .van-dropdown-menu {
  width: 335px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin-top: 15px;
  font-size: 12px;
}
/deep/.van-dropdown-menu__title {
  font-size: 12px;
  margin-right: 152px;
  max-width: 180px;
  min-width: 160px;
}
/deep/.van-dropdown-menu__title::after {
  left: 300px;
}
/deep/.van-dropdown-menu__title {
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
}
.statistics {
  width: 375px;
  background: rgba(255, 255, 255, 1);
  margin: 15px 20px 0;
}
.disposal_t {
  float: left;
  font-size: 12px;
  color: rgba(78, 78, 78, 1);
  line-height: 17px;
  margin-top: 15px;
  margin-left: 20px;
}
.flex2 {
  display: flex;
  justify-content: space-around;
}
.statistics_p {
  width: 160px;
  height: 80px;
  background: rgba(231, 231, 231, 1);
  border-radius: 6px;
}
.statistics_t {
  font-size: 12px;
  margin: 10px 0;
}
.statistics_p img {
  width: 46px;
  height: 46px;
  margin-top: 17px;
  margin-left: 57px;
}
.block {
  overflow: hidden;
  position: relative;
  margin-left: 4px;
}
</style>
