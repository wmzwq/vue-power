<template>
  <div class="">
    <van-nav-bar title="电量详情" left-arrow @click-left="onClickLeft" />
    <div class="flex">
      <div>
        <van-dropdown-menu>
          <van-dropdown-item v-model="value" :options="option" @change="change" />
        </van-dropdown-menu>
      </div>
      <div>
        <select v-model="time" class="select" @change="selectChange">
          <option value="month">月</option>
          <option value="day">日</option>
        </select>
      </div>
    </div>
    <div >
      <table align="center" class="tableStyle">
        <tr align="center" class="bg state">
          <td>时间</td>
          <td>均值</td>
        </tr>
        <tr :key="index" v-for="(item, index) in list">
          <td align="center" class="state">
            {{item.Key}}
          </td>
          <td align="center" class="state">{{item.TotalE}}</td>
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
      time: 'day',
      timetype: 1,
      list: []
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getList () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/PowerDetails',
        this.$qs.stringify({
          data: "{'AppCustomId':'" + this.value + "','timetype':'" + this.timetype + "'} "
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
    selectChange () {
      this.$loading()
      if (this.time === 'day') {
        this.timetype = 1
      } else {
        this.timetype = 2
      }
      this.getList()
    },
    change () {
      this.$loading()
      this.getList()
    }
  }
}
</script>
<style scoped lang="less">
.flex2 {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
/deep/ .van-dropdown-menu {
  width: 260px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin: 15px 15px 0 15px;
  font-size: 12px;
}
/deep/.van-dropdown-menu__title {
  font-size: 12px;
  margin-right: 124px;
  min-width: 126px;
}
/deep/.van-dropdown-menu__title::after {
  left: 232px;
}

/deep/.van-dropdown-menu__title {
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
}
.tableStyle {
  width: 335px;
  margin: auto;
  background: #fff;
  margin-top: 15px;
}
tr {
  height: 36px;
}
td {
  width: 167px;
}
.select {
  width: 60px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 1px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin: 15px 15px 0 0;
}
</style>
