<template>
  <div class="">
    <van-nav-bar title="巡检详情" left-arrow @click-left="onClickLeft" />
    <div class="title">巡检信息</div>
    <van-cell-group>
      <van-cell title="出线柜">
        <div class="minWidth">
          <div
            :class="['checkBtn', 'fr', { isFalse: isFalse[0].isFalse }]"
            v-fb
            @click="check(0)"
          >
            异常
          </div>
          <div
            :class="['checkBtn', 'fr', 'info', { isFalse: isFalse[1].isFalse }]"
             v-fb
            @click="check(1)"
          >
            正常
          </div>
        </div>
      </van-cell>
      <van-cell title="进线柜">
        <div class="minWidth">
          <div
            :class="['checkBtn', 'fr', { isFalse: isFalse[2].isFalse }]"
             v-fb
            @click="check(2)"
          >
            异常
          </div>
          <div
            :class="['checkBtn', 'fr', 'info', { isFalse: isFalse[3].isFalse }]"
             v-fb
            @click="check(3)"
          >
            正常
          </div>
        </div>
      </van-cell>
    </van-cell-group>
    <div class="title">环境状况</div>
    <van-cell-group>
      <van-cell title="各类柜">
        <div class="minWidth">
          <div
            :class="['checkBtn', 'fr', { isFalse: isFalse[4].isFalse }]"
             v-fb
            @click="check(4)"
          >
            杂乱
          </div>
          <div
            :class="['checkBtn', 'fr', 'info', { isFalse: isFalse[5].isFalse }]"
             v-fb
            @click="check(5)"
          >
            整洁
          </div>
        </div>
      </van-cell>
      <van-cell title="配电室漏水">
        <div class="minWidth">
          <div
            :class="['checkBtn', 'fr', { isFalse: isFalse[6].isFalse }]"
             v-fb
            @click="check(6)"
          >
            漏水
          </div>
          <div
            :class="['checkBtn', 'fr', 'info', { isFalse: isFalse[7].isFalse }]"
             v-fb
            @click="check(7)"
          >
            无漏水
          </div>
        </div>
      </van-cell>
      <van-cell title="电缆沟积水">
        <div class="minWidth">
          <div
            :class="['checkBtn', 'fr', { isFalse: isFalse[8].isFalse }]"
             v-fb
            @click="check(8)"
          >
            积水
          </div>
          <div
            :class="['checkBtn', 'fr', 'info', { isFalse: isFalse[9].isFalse }]"
             v-fb
            @click="check(9)"
          >
            无积水
          </div>
        </div>
      </van-cell>
    </van-cell-group>
    <div class="title">环境状况</div>
    <van-cell-group>
      <van-cell title="绝缘工器具">
        <div ass="minWidth">
          <div
            :class="['checkBtn', 'fr', { isFalse: isFalse[10].isFalse }]"
             v-fb
            @click="check(10)"
          >
            损坏
          </div>
          <div
            :class="[
              'checkBtn',
              'fr',
              'info',
              { isFalse: isFalse[11].isFalse }
            ]"
             v-fb
            @click="check(11)"
          >
            完好
          </div>
        </div>
      </van-cell>
      <van-cell title="灭火器">
        <div class="minWidth">
          <div
            :class="['checkBtn', 'fr', { isFalse: isFalse[12].isFalse }]"
            v-fb
            @click="check(12)"
          >
            损坏
          </div>
          <div
            :class="[
              'checkBtn',
              'fr',
              'info',
              { isFalse: isFalse[13].isFalse }
            ]"
             v-fb
            @click="check(13)"
          >
            完好
          </div>
        </div>
      </van-cell>
      <van-cell title="挡鼠标">
        <div class="minWidth">
          <div
            :class="['checkBtn', 'fr', { isFalse: isFalse[14].isFalse }]"
             v-fb
            @click="check(14)"
          >
            损坏
          </div>
          <div
            :class="[
              'checkBtn',
              'fr',
              'info',
              { isFalse: isFalse[15].isFalse }
            ]"
             v-fb
            @click="check(15)"
          >
            完好
          </div>
        </div>
      </van-cell>
    </van-cell-group>
    <div class="title">处理小结</div>
    <textarea v-model="subtotal"></textarea>
    <div class="title">现场照片</div>
    <div class="footer">
      <van-uploader
        v-model="fileList"
        multiple
        :max-count="9"
      />
    </div>
    <div class="btn" @click="save()"  v-fb>保存</div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      subtotal: '',
      file: [],
      fileList: [],
      isFalse: [
        { isFalse: false, F_Id: '4c4679ab-64ae-4a73-a417-654613bf1b74' },
        { isFalse: false, F_Id: '4c4679ab-64ae-4a73-a417-654613bf1b74' },
        { isFalse: false, F_Id: '3158216d-ab97-4c34-ada1-6f8290904c8f' },
        { isFalse: false, F_Id: '3158216d-ab97-4c34-ada1-6f8290904c8f' },
        { isFalse: false, F_Id: '2329bc6b-18ca-4ea9-9d36-01814ec18738' },
        { isFalse: false, F_Id: '2329bc6b-18ca-4ea9-9d36-01814ec18738' },
        { isFalse: false, F_Id: 'b798aabd-0693-4f49-bdad-446de36f94b5' },
        { isFalse: false, F_Id: 'b798aabd-0693-4f49-bdad-446de36f94b5' },
        { isFalse: false, F_Id: '0aa5b59d-b138-4634-bbbd-e17ccc56f37f' },
        { isFalse: false, F_Id: '0aa5b59d-b138-4634-bbbd-e17ccc56f37f' },
        { isFalse: false, F_Id: 'c2b0dfb7-77a8-410c-8fa6-9725dcb201b3' },
        { isFalse: false, F_Id: 'c2b0dfb7-77a8-410c-8fa6-9725dcb201b3' },
        { isFalse: false, F_Id: '7a7c3a0e-0cd5-4de7-b419-8e731b9c5a6b' },
        { isFalse: false, F_Id: '7a7c3a0e-0cd5-4de7-b419-8e731b9c5a6b' },
        { isFalse: false, F_Id: '652843d4-e7a6-4792-a776-9ead3c82f8b6' },
        { isFalse: false, F_Id: '652843d4-e7a6-4792-a776-9ead3c82f8b6' }
      ]
    }
  },
  created () {
    this.$loading()
  },
  beforeUpdate () {
    this.$clear()
  },
  mounted () {
    this.getCheckingDetails()
    this.getPictures()
    this.subtotal = this.$route.query.content
    console.log(this.$route.query.id)
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getPictures () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/ExaminePicture',
          this.$qs.stringify({
            data: "{'keyValue':'" + this.$route.query.id + "'} "
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
          res.data.forEach(item => {
            item.F_FilePath.indexOf('/')
            var index = item.F_FilePath.indexOf('/', item.F_FilePath.indexOf('/') + 1)
            var FilePath = 'http://122.228.89.215:8899' + item.F_FilePath.slice(index)
            this.fileList.push({ url: FilePath })
          })
        }
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res)
    },
    async getCheckingDetails () {
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/CheckingDetails',
          this.$qs.stringify({
            data: "{'PlanId':'" + this.$route.query.id + "'} "
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
        res.data.forEach(item => {
          switch (item.F_Name) {
            case '出线柜':
              if (item.F_CheckResult === 0) {
                this.isFalse[1].isFalse = true
              } else if (item.F_CheckResult === 1) {
                this.isFalse[0].isFalse = true
              }
              break
            case '进线柜':
              if (item.F_CheckResult === 0) {
                this.isFalse[3].isFalse = true
              } else if (item.F_CheckResult === 1) {
                this.isFalse[2].isFalse = true
              }
              break
            case '各类柜':
              if (item.F_CheckResult === 0) {
                this.isFalse[5].isFalse = true
              } else if (item.F_CheckResult === 1) {
                this.isFalse[4].isFalse = true
              }
              break
            case '配电室漏水':
              if (item.F_CheckResult === 0) {
                this.isFalse[7].isFalse = true
              } else if (item.F_CheckResult === 1) {
                this.isFalse[6].isFalse = true
              }
              break
            case '电缆沟积水':
              if (item.F_CheckResult === 0) {
                this.isFalse[9].isFalse = true
              } else if (item.F_CheckResult === 1) {
                this.isFalse[8].isFalse = true
              }
              break
            case '绝缘工器具':
              if (item.F_CheckResult === 0) {
                this.isFalse[11].isFalse = true
              } else if (item.F_CheckResult === 1) {
                this.isFalse[10].isFalse = true
              }
              break
            case '灭火器':
              if (item.F_CheckResult === 0) {
                this.isFalse[13].isFalse = true
              } else if (item.F_CheckResult === 1) {
                this.isFalse[12].isFalse = true
              }
              break
            case '挡鼠标':
              if (item.F_CheckResult === 0) {
                this.isFalse[15].isFalse = true
              } else if (item.F_CheckResult === 1) {
                this.isFalse[14].isFalse = true
              }
              break
            default:
              break
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
    check (num) {
      switch (num) {
        case 0:
          if (this.isFalse[num].isFalse !== this.isFalse[num + 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num + 1].isFalse = !this.isFalse[num + 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 1:
          if (this.isFalse[num].isFalse !== this.isFalse[num - 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num - 1].isFalse = !this.isFalse[num - 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 2:
          if (this.isFalse[num].isFalse !== this.isFalse[num + 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num + 1].isFalse = !this.isFalse[num + 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break

        case 3:
          if (this.isFalse[num].isFalse !== this.isFalse[num - 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num - 1].isFalse = !this.isFalse[num - 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 4:
          if (this.isFalse[num].isFalse !== this.isFalse[num + 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num + 1].isFalse = !this.isFalse[num + 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 5:
          if (this.isFalse[num].isFalse !== this.isFalse[num - 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num - 1].isFalse = !this.isFalse[num - 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break

        case 6:
          if (this.isFalse[num].isFalse !== this.isFalse[num + 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num + 1].isFalse = !this.isFalse[num + 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 7:
          if (this.isFalse[num].isFalse !== this.isFalse[num - 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num - 1].isFalse = !this.isFalse[num - 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 8:
          if (this.isFalse[num].isFalse !== this.isFalse[num + 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num + 1].isFalse = !this.isFalse[num + 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 9:
          if (this.isFalse[num].isFalse !== this.isFalse[num - 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num - 1].isFalse = !this.isFalse[num - 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break

        case 10:
          if (this.isFalse[num].isFalse !== this.isFalse[num + 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num + 1].isFalse = !this.isFalse[num + 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 11:
          if (this.isFalse[num].isFalse !== this.isFalse[num - 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num - 1].isFalse = !this.isFalse[num - 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 12:
          if (this.isFalse[num].isFalse !== this.isFalse[num + 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num + 1].isFalse = !this.isFalse[num + 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 13:
          if (this.isFalse[num].isFalse !== this.isFalse[num - 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num - 1].isFalse = !this.isFalse[num - 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 14:
          if (this.isFalse[num].isFalse !== this.isFalse[num + 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num + 1].isFalse = !this.isFalse[num + 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        case 15:
          if (this.isFalse[num].isFalse !== this.isFalse[num - 1].isFalse) {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
            this.isFalse[num - 1].isFalse = !this.isFalse[num - 1].isFalse
          } else {
            this.isFalse[num].isFalse = !this.isFalse[num].isFalse
          }
          break
        default:
          break
      }
    },
    async save () {
      if (this.fileList.length === 0) {
        return this.$toast({
          message: '照片不能为空',
          className: 'error'
        })
      }
      this.$loading()
      var arr = []
      this.isFalse.forEach((item, i) => {
        switch (i) {
          case 0:
            if (item.isFalse === false) {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 0 })
            } else {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 1 })
            }
            break
          case 2:
            if (item.isFalse === false) {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 0 })
            } else {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 1 })
            }
            break
          case 4:
            if (item.isFalse === false) {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 0 })
            } else {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 1 })
            }
            break
          case 6:
            if (item.isFalse === false) {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 0 })
            } else {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 1 })
            }
            break
          case 8:
            if (item.isFalse === false) {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 0 })
            } else {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 1 })
            }
            break
          case 10:
            if (item.isFalse === false) {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 0 })
            } else {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 1 })
            }
            break
          case 12:
            if (item.isFalse === false) {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 0 })
            } else {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 1 })
            }
            break
          case 14:
            if (item.isFalse === false) {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 0 })
            } else {
              arr.push({ F_Id: item.F_Id, F_CheckResult: 1 })
            }
            break
          default:
            break
        }
      })
      const formData = new FormData()
      formData.append('loginMark', localStorage.getItem('loginMark'))
      formData.append('token', localStorage.getItem('token'))
      formData.append(
        'data',
        '{"keyValue":"' +
            this.$route.query.id +
            '","Content":"' +
            this.subtotal +
            '"}'
      )
      this.fileList.forEach(item => {
        formData.append('file', item.file)
      })
      const { data: res } = await this.$http
        .post(
          'CustomerDataAPI/InspectionIsGlasow',
          formData, {
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res.code === 200 || res.code === 400) {
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(this.$route.query.id)
      const { data: res1 } = await this.$http
        .post(
          'CustomerDataAPI/CheckingDetailsEditorContent',
          this.$qs.stringify({
            data: '{"InspectionSheetFileId":"' + this.$route.query.id + "\",\"strEntity\":'{ \"F_Name\":\"" + this.$route.query.name + '","data":' + JSON.stringify(arr) + "}'}"
          }))
        .catch(error => {
          console.log(error.message)
          this.$toast({
            message: '请求超时，请检查网络',
            className: 'error'
          })
        })
      if (res1.code === 200) {
        this.$toast({
          message: '保存成功',
          className: 'success'
        })
      } else {
        this.$toast({
          message: res.info,
          className: 'error'
        })
      }
      console.log(res1)
      this.$clear()
    }
  }
}
</script>
<style scoped lang="less">
.minWidth {
  min-width: 120px;
}
.info {
  margin-left: 10px;
  margin-right: 20px;
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
  color: #2f2f2f;
}
.van-checkbox {
  float: right;
  margin-left: 12px;
}
.van-cell:not(:last-child)::after {
  border-bottom: 1px solid #dbdbdb;
}
.checkBtn {
  width: 54px;
  height: 25px;
  border-radius: 4px;
  border: 1px solid rgba(140, 140, 140, 1);
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(112, 112, 112, 1);
}
.isFalse {
  background: rgba(69, 192, 163, 1);
  color: rgba(255, 255, 255, 1);
  border: none;
}
textarea {
  width: 335px;
  height: 77px;
  border-radius: 4px;
  border: 1px solid rgba(225, 225, 225, 1);
  font-size: 12px;
  color: rgba(47, 47, 47, 1);
  margin: 0 20px;
}
.footer {
  width: 375px;
  background: rgba(255, 255, 255, 1);
  margin: 0 20px;
}
.btn {
  width: 110px;
  height: 40px;
  background: rgba(69, 192, 163, 1);
  text-align: center;
  line-height: 40px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  margin: 20px 132px;
}
</style>
