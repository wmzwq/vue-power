<template>
  <div class="">
    <van-nav-bar
      title="功率因数详情"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="flex">
      <div>
      <div class="title">{{text}}</div>
      <table align="center" class="tableStyle">
        <tr align="center" class="bg state">
          <td>时间</td>
          <td>均值</td>
        </tr>
        <tr v-for="(v, index) in list" :key="index">
          <td align="center" class="state">
            {{v.CreatDate | dataFilter}}
          </td>
          <td align="center" class="state">{{v.PfAvg| numFilter}}</td>
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
      list: [],
      text: ''
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  filters: {
    numFilter (value) {
      let realVal = ''
      realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    dataFilter (value) {
      let realVal = ''
      realVal = value.slice(0, value.indexOf(' '))
      return realVal
    }
  },
  mounted () {
    this.text = this.$route.query.text
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getList () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/powerFactorDetails',
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
  width: 335px;
  margin: 15px 20px;
}
tr {
  height: 36px;
}
td {
  width: 167px;
}
 .title{
    margin-top: 15px;
    margin-left: 20px;
  }
</style>
