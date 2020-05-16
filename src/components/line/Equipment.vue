<template>
  <div class="">
    <van-nav-bar title="离线详情" left-arrow @click-left="onClickLeft" />
    <div class="flex" :key="index" v-for="(item, index) in list">
      <div>
        <div class="title">{{item.CompanyName}}</div>
        <table align="center" class="tableStyle" :key="i" v-for="(v, i) in item.TransformerRoom">
          <tr align="center" class="bg">
            <td colspan="2">{{v.TransformerRoomName}}</td>
          </tr>
          <tr :key="n" v-for="(m, n) in v.EquipmentInfo">
            <td width="246px" align="left">
              <div style="positon:relative">
                <div class="disposal_y disposal_c" v-if="m.HardwareStatus==='离线'"></div>
                <div class="disposal_y" v-else></div>
                <div class="disposal_f">{{m.F_FullName}}</div>
              </div>
            </td>
            <td  align="center" class="state" v-if="m.HardwareStatus==='离线'">{{m.F_OnLineDate}}</td>
            <td  align="center" class="state"  v-else>当前在线</td>
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
    this.getList()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getList () {
      const { data: res } = await this.$http.post(
        'CustomerDataAPI/offlineDataList',
        this.$qs.stringify({
          data: "{'AppCustomId':'" + this.$route.query.id + "'} "
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
    }
  }
}
</script>
<style scoped lang="less">
.disposal_y {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #3fb7af;
  border-radius: 4px;
}
.disposal_c {
  background: #eea67c;
}
.disposal_f {
  display: inline-block;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(47, 47, 47, 1);
  line-height: 17px;
  margin-left: 4px;
}
.title {
  margin-top: 15px;
  margin-left: 20px;
}
.state{
  width: 88px;
}
.tableStyle{
  background: #fff;
  width: 335px;
  margin:15px 20px 0
}
</style>
