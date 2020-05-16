<template>
  <div class>
    <div class="header flex" @click="showActionSheet">
      <img :src="url" alt />
    </div>
    <van-cell-group class="middle">
      <van-cell>
        <template #title>
          <van-field v-model="username" label="用户名:" />
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          <van-field v-model="tel" type="tel" label="手机号:" />
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          <van-field v-model="fault" label="故障推送:" />
        </template>
        <van-switch v-model="checked" active-color="#07c160" inactive-color="#707070" />
      </van-cell>
      <van-cell>
        <template #title>
          <van-field v-model="location" label="实时定位:" />
        </template>
        <van-switch v-model="checked1" active-color="#07c160" inactive-color="#707070" />
      </van-cell>
    </van-cell-group>
    <div class="footer flex" @click="cancellation" v-fb>退出登录</div>
    <van-action-sheet v-model="show" cancel-text="取消">
      <div class="content">
        <van-uploader :after-read="onRead" accept="image/*">头像上传</van-uploader>
      </div>
      <div class="content" @click="showOverlayEvent">查看头像</div>
    </van-action-sheet>
    <van-overlay :show="showOverlay" @click="showOverlay = false" >
      <div class="wrapper">
        <img :src="url" alt />
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      username: '',
      fault: '已关闭',
      checked: false,
      location: '已关闭',
      checked1: false,
      tel: '',
      fId: '',
      show: false,
      showOverlay: false,
      url: require('../../assets/img/头像.png')
    }
  },
  created () {
    if (localStorage.getItem('checked') === 'true') {
      this.checked = true
    }
    if (localStorage.getItem('checked1') === 'true') {
      this.checked1 = true
    }
  },
  mounted () {
    this.getUser()
  },
  beforeDestroy () {
    localStorage.setItem('checked', this.checked)
    localStorage.setItem('checked1', this.checked1)
  },
  methods: {
    cancellation () {
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    async getUser () {
      const { data: res } = await this.$http
        .post('CustomerDataAPI/PersonInfo')
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        this.username = res.data[0].realName
        this.tel = res.data[0].account
        this.fId = res.data[0].F_Id
        if (res.data[0].headIcon !== null) {
          this.getPictures(res.data[0].headIcon)
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    onRead (file) {
      this.pictureUpload(file)
      this.show = false
    },
    showActionSheet () {
      this.show = true
    },
    randomWord (randomFlag, min, max) {
      var str = ''
      var range = min
      var arr = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z'
      ]

      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min
      }
      for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      return str
    },
    async getPictures (id) {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ExaminePicture',
          this.$qs.stringify({
            data: "{'keyValue':'" + id + "'} "
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
          this.url = FilePath
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async pictureUpload (file) {
      var pic = this.randomWord(false, 16)
      const formData = new FormData()
      formData.append('loginMark', localStorage.getItem('loginMark'))
      formData.append('token', localStorage.getItem('token'))
      formData.append(
        'data',
        '{"keyValue":"' + this.fId + '","F_Picture":"' + pic + '"}'
      )
      formData.append('file', file.file)
      const { data: res } = await this.$http
        .post('CustomerDataAPI/PersonInfoPicture', formData)
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        this.getUser()
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    showOverlayEvent () {
      this.show = false
      this.showOverlay = true
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
  img{
    width: 50%;
  }
}
.header {
  width: 100%;
  height: 120px;
  background: rgba(255, 255, 255, 1);
  text-align: center;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
  }
}
/deep/.van-field__label {
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
}
.van-cell:not(:last-child)::after {
  border-bottom: 2px solid #dbdbdb;
}
.middle {
  margin-top: 15px;
}
.footer {
  width: 270px;
  height: 50px;
  background: rgba(69, 192, 163, 1);
  border-radius: 100px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  align-items: center;
  margin: 130px auto 0;
}
</style>
