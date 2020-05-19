<template>
  <div class="flex">
    <div class="login_container">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        >
          <van-icon class="iconfont homeGroup1" slot="left-icon" color="#46C0A5" />
        </van-field>
        <van-field
          style="margin-top:30px"
          v-model="password"
          type="password"
          name="password"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <van-icon class="iconfont homeGroup" slot="left-icon" color="#46C0A5" />
        </van-field>
        <div class="btn" @click="onSubmit" v-fb>登录</div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async onSubmit (values) {
      this.$http
        .get('login/checklogin', {
          params: {
            data: {
              username: this.username,
              password: this.$md5(this.password)
            }
          }
        })
        .then(res => {
          console.log(res)
          if (res.data.code === 200) {
            localStorage.setItem('loginMark', res.data.data.loginMark)
            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem('user', this.username)
            this.$toast.success({
              className: 'success',
              message: res.data.info,
              duration: 1000
            })
            this.$router.push('/home')
          } else {
            this.$toast.success({
              className: 'success',
              message: res.data.info,
              duration: 1000
            })
          }
        })
        .catch(error => {
          console.log(error.message)
          this.show = false
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
    }
  }
}
</script>
<style scoped lang="less">
.van-field__left-icon .van-icon,
.van-field__right-icon .van-icon {
  top: 50%;
  transform: translateY(-50%);
}
/deep/.van-field__body {
  position: absolute;
  align-items: center;
  top: 50%;
  transform: translateY(-50%);
}
.login_container {
  width: 335px;
  height: 306px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 5px;
  margin: 124px auto 0;
  overflow: hidden;
}
.van-cell {
  width: 275px;
  height: 60px;
  background: rgba(247, 247, 247, 1);
  border-radius: 5px;
  margin: 0 30px;
}
.van-form {
  margin-top: 50px;
}
.van-field__control {
  padding-top: 6px;
}
.van-field__left-icon {
  margin-top: 6px;
}
.btn {
  position: absolute;
  margin: 80px 32px 0;
  width: 270px;
  height: 50px;
  background: rgba(69, 192, 163, 1);
  border-radius: 100px;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
</style>
