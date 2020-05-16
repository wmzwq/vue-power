<template>
  <div class="">
    <van-nav-bar
      title="负荷统计"
      left-arrow
      @click-left="onClickLeft"
    />
     <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change" />
      </van-dropdown-menu>
    </div>
    <div class="flex">
      <div>
      <table align="center" class="tableStyle">
        <tr align="center" class="bg state">
          <td>时间</td>
          <td>最高值</td>
          <td>均值</td>
        </tr>
        <tr align="center" class="state" v-for="(v, index) in list" :key="index">
          <td>
            {{v.Key}}
          </td>
          <td >{{v.MaxPFifteen}}KVA</td>
           <td >{{v.AveragePFifteen}}KVA</td>
        </tr>
      </table>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      value: '',
      option: [],
      list: []
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.option = JSON.parse(localStorage.getItem('option'))
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    change () {
      this.$loading()
      this.getList()
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/DayCurve',
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
.tableStyle{
  margin:15px 20px;
  width: 335px;
}
tr {
  height: 36px;
}
td {
  width: 113px;
}
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
</style>
