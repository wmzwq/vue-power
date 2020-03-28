<template>
  <div class="login_container">
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button
          round
          block
          type="info"
          native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      username: 'lcms',
      password: '123456'
    }
  },
  methods: {
    async onSubmit (values) {
      this.$http.get('login/checkloginWy', { params: { data: { username: this.username, password: this.$md5(this.password) } } }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$notify({ type: 'success', message: res.data.info, duration: 1000 })
        //   this.$router.push('/home')
        } else {
          this.$notify({ type: 'warning', message: res.data.info, duration: 1000 })
        }
      })
    }
  }
}
</script>
<style  scoped lang='less'>

</style>
