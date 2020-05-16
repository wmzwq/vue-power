<template>
  <div class="">
    <van-nav-bar title="日电费" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" @change="change"/>
      </van-dropdown-menu>
    </div>
    <div class="bac">
      <table align="center" class="tableStyle">
        <tr align="center" class="bg state">
          <td>时间</td>
          <td>电量</td>
          <td>电费</td>
          <td>电价</td>
        </tr>
        <tr :key="index" v-for="(item, index) in list">
          <td align="center" class="state">
            {{item.Key}}
          </td>
          <td align="center" class="state">{{item.TotalE.toFixed(2) }}KVA</td>
          <td align="center" class="state">{{item.TotalPrices.toFixed(2) }}元</td>
          <td align="center" class="state">{{item.price.toFixed(2) }}元</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  created () {
    this.$loading()
  },
  mounted () {
    this.option = JSON.parse(localStorage.getItem('option'))
    this.getList()
  },
  beforeUpdate () {
    this.$clear()
  },
  data () {
    return {
      value: '',
      option: [],
      list: []
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getList () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/electricityDay',
        this.$qs.stringify({
          data: "{'AppCustomId':'" + this.value + "'} "
        })
      ).catch(error => {
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
    },
    change () {
      this.$loading()
      this.getList()
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
.bac{
  background:#fff
}
.tableStyle{
  width: 335px;
  margin:auto;
  margin-top: 15px;
}
tr {
  height: 36px;
}
td {
  width: 167px;
}
</style>
