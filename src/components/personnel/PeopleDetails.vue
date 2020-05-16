<template>
  <div class>
    <van-nav-bar :title="name" left-arrow @click-left="onClickLeft" />
    <div class="header flex">
      <img :src="url" alt />
    </div>
    <van-cell-group class="flex3">
      <van-cell>
        <template slot="title">
          <label>联系方式：</label>
          <input type="text" v-model="tel" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>所属班组：</label>
          <input type="text" v-model="group" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>工作年限：</label>
          <input type="text" v-model="time" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>职称：</label>
          <input type="text" v-model="technicalPost" :readonly="true" />
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <label>证书编号：</label>
          <input type="text" v-model="number" :readonly="true" />
        </template>
      </van-cell>
    </van-cell-group>
    <div class="footer">
       <viewer :images="images">
       <img v-for="src in images" :src="src" :key="src">
    </viewer>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      name: '',
      group: '',
      time: '',
      technicalPost: '',
      number: '',
      tel: '',
      id: '',
      images: [],
      url: require('../../assets/img/头像.png')
    }
  },
  created () {},
  mounted () {
    var list = JSON.parse(this.$route.query.info)
    console.log(list)
    this.name = list.F_RealName
    this.group = list.F_Name
    this.time = list.F_YearsOfWorking
    this.technicalPost = list.F_TheTitleOfATechnicalPost
    this.number = list.F_CertificateNumber
    this.tel = list.F_Account
    this.id = list.F_TheCertificatePhotos
    this.getPicture()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getPicture () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ExaminePicture',
          this.$qs.stringify({
            data: '{"keyValue":"' + this.id + '"}'
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
          var index = res.data[0].F_FilePath.indexOf('/', res.data[0].F_FilePath.indexOf('/') + 1)
          var FilePath = 'http://122.228.89.215:8899' + res.data[0].F_FilePath.slice(index)
          this.images.push(FilePath)
        //   this.base64 = 'data:image/png;base64,' + res.data[0].F_PictureData
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
.iconfont {
  font-size: 54px !important;
  margin-top: 10px;
}
.content {
  padding: 16px;
  text-align: center;
}
.wrapper {
  display: flex;
  justify-content: center; //水平居中
  margin-top: 50%;
  img {
    width: 50%;
  }
}
.header {
  width: 100%;
  height: 120px;
  background: rgba(250, 250, 250, 1);
  text-align: center;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
  }
}
.title {
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
  margin: 15px 0 15px 20px;
}
.van-cell {
  width: 335px;
  margin: 0 20px;
}
.van-cell__title,
.van-cell__value {
  margin-left: -13px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
}
.van-checkbox {
  float: right;
  margin-left: 12px;
}
.van-cell:not(:last-child)::after {
  border-bottom: 1px solid #dbdbdb;
}
input {
  border: none;
  color: rgba(47, 47, 47, 1);
  margin-left: 2px;
  margin-left: 4px;
  width: 228px;
}
.footer {
  margin: 15px 20px;
  width: 335px;
  height: 120px;
  background: rgba(226, 226, 226, 1);
  img{
      width: 100%;
      height: 100%;
  }
}
</style>
