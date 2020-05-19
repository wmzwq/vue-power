<template>
  <div class="message">
    <van-nav-bar title="消息中心" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
      <template #right>
        <div class="right_title" v-fb>全部已读({{read}})</div>
      </template>
    </van-nav-bar>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <div v-for="(v, index) in list" :key="index" class="box" @click="reads(v.F_Id,v)">
        <div class="task fault">
          <div class="task_left">
            <img src="../../assets/img/报警.png" alt v-if="v.F_Type===4" />
            <img src="../../assets/img/任务.png" alt v-else />
            <div :class="['info', {'isFalse':v.F_ReadStatus===1 }]"></div>
          </div>
          <div class="task_right">
            <div>
              <div class="task_rightText">{{v.F_FullName}}</div>
              <span>{{v.F_CreateDate}}</span>
            </div>
            <div class="task_rightText" v-if="v.F_Type===4">{{v.F_Content}}</div>
            <div class="task_rightText" v-if="v.F_Type===0">新的巡检任务已下发</div>
            <div class="task_rightText" v-if="v.F_Type===1">新的抢修任务已下发</div>
            <div class="task_rightText" v-if="v.F_Type===2">新的缺陷任务已下发</div>
            <div class="task_rightText" v-if="v.F_Type===3">新的任务派遣任务已下发</div>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      PageNum: 0,
      reeadStatus: 0,
      read: 0,
      reeadText: '',
      error: false,
      finished: false,
      loading: false,
      keyValue: []
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.onLoad()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async reads (id, v) {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ReadMessage',
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
        this.$router.push({
          path: '/messageDetail',
          query: {
            item: JSON.stringify(v)
          }
        })
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async onClickRight () {
      this.$dialog
        .confirm({
          message: '是否进行全部已读'
        })
        .then(async () => {
          this.keyValue = []
          this.list.forEach(item => {
            this.keyValue.push({ F_Id: item.F_Id })
          })
          console.log(this.keyValue)
          const { data: res } = await this.$http
            .post(
              'CustomerDataAPI/AllReadMessage',
              this.$qs.stringify({
                data: "{'keyValue':'" + JSON.stringify(this.keyValue) + "'} "
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
            this.$toast({
              message: '操作成功',
              className: 'success'
            })
            this.$router.go(0)
          } else {
            this.$toast({
              message: res.info,
              className: 'error'
            })
          }
          console.log(res)
        })
        .catch(() => {
          // on cancel
        })
    },
    async onLoad () {
      this.PageNum = this.PageNum + 1
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ListMessage',
          this.$qs.stringify({
            data:
              "{'AppCustomId':'" +
              this.$route.query.id +
              "','PageNum':'" +
              this.PageNum +
              "','PageSize':'5'} "
          })
        )
        .catch(error => {
          console.log(error.message)
          this.error = true
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200) {
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (res.data[0].length < 5) {
          this.finished = true
        }
        this.read = res.data[1]
        this.list = [...this.list, ...res.data[0]]
        console.log(this.list)
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
.right_title {
  font-size: 12px;
  color: rgba(47, 47, 47, 1);
}
.task:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.task {
  margin: 15px 20px;
  position: relative;
  .task_left {
    position: relative;
    float: left;
    width: 50px;
    height: 50px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(69, 192, 163, 1);
    border-radius: 6px;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .info {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      padding: 0 3px;
      color: #fff;
      font-weight: 500;
      font-size: 12px;
      font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
      line-height: 14px;
      text-align: center;
      background-color: #ee0a24;
      border: 1px solid #fff;
      -webkit-transform: translate(50%, -50%);
      transform: translate(50%, -50%);
      -webkit-transform-origin: 100%;
      transform-origin: 100%;
      width: 10px;
      min-width: 0;
      height: 10px;
      border-radius: 100%;
    }
  }
  .task_right {
    position: relative;
    float: left;
    margin-left: 15px;
    margin-top: 6px;
    max-width: 255px;
    top: 50%;
    .task_rightText {
      font-size: 12px;
      color: rgba(112, 112, 112, 1);
      margin-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 146px;
      float: left;
    }
    span {
      font-size: 10px;
      color: rgba(154, 154, 154, 1);
      float: left;
    }
  }
  .line {
    overflow: hidden;
    float: left;
    margin-top: -10px;
    background: #dbdbdb;
    width: 335px;
    height: 2px;
  }
}
.fault {
  .task_left {
    margin-top: 25px;
  }
  .task_right {
    float: left;
    margin-left: 15px;
    margin-top: 0;
    .task_rightText {
      font-size: 12px;
      color: rgba(112, 112, 112, 1);
      margin-bottom: 5px;
      clear: both;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.message .box:last-child {
  .line {
    display: none;
  }
}
.isFalse {
  display: none;
}
</style>
