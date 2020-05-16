<template>
  <div id="camera">
    <div id="scan"></div>
    <div class="tips">"加载中...</div>
    <div class="action">
      <div class="items">
        <div
          class="item"
          @click="openLight"
        ><img src="../../assets/img/light.jpg"></div>
        <div
          class="item"
          @click="getPicture()"
        ><img src="../../assets/img/xc.jpg"></div>

        <div
          class="item"
          @click="cancelScan()"
        ><img src="../../assets/img/cancel.jpg"></div>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
let scan = null
export default {
  data () {
    return {
      codeUrl: '',
      isLight: false,
      showEnter: false,
      extra: null,
      scan: null,
      type: ''
    }
  },

  mounted () {
    setTimeout(() => {
      // 设置500毫秒等资源加载
      if (window.plus) {
        this.startScan() // `进入页面就调取扫一扫
      }
    }, 500)
  },
  beforeDestroy () {
    if (!window.plus) return
    scan.cancel()
    scan.close()
    // scan = null;
  },
  methods: {
    // 打开闪光灯
    openLight () {
      this.isLight = !this.isLight
      scan.setFlash(this.isLight)
    },
    // 创建扫描控件
    startRecognize () {
      if (!window.plus) return
      // eslint-disable-next-line no-undef
      scan = new plus.barcode.Barcode(
        'scan',
        // eslint-disable-next-line no-undef
        [plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13],
        {
          frameColor: '#1294cb',
          scanbarColor: '#1294cb',
          top: '100px',
          left: '0px',
          width: '100%',
          height: '500px',
          position: 'fixed'
        }
      )
      scan.onmarked = onmarked
      function onmarked (type, result, file) {
        result = result.replace(/\n/g, '')
        // eslint-disable-next-line no-undef
        var w = plus.webview.open(
          result, 'test',
          {
            errorPage: '404.html',
            top: '0px',
            bottom: '0px',
            statusbar: {
              // 顶部电量栏 背景颜色
              background: window.backgroundColor
            },
            // backButtonAutoControl: "close",
            backButtonAutoControl: 'close',
            titleNView: {
              backgroundColor: window.backgroundColor,
              titleColor: '#CCCCCC',
              autoBackButton: true,
              buttons:
                {
                  type: 'close',
                  float: 'left',
                  onclick: clickButton
                }
            },
            progress: window.backgroundColor,
            zindex: 1000
          },
          'auto',
          200
        )

        function clickButton () {
          w.close()
          console.log('点击了关闭按钮')
          removeEventTest()
        }

        // 取消监听“返回”按钮事件
        function removeEventTest () {
          // eslint-disable-next-line no-undef
          plus.key.removeEventListener('backbutton', function () {
            // 不打印 但是移除生效
            console.log('成功取消js监听“返回”按钮事件')
          })
        }
        // eslint-disable-next-line no-undef
        if (plus.webview.all().length > 1) {
          // 扫码成功后关闭当前的webview
          // eslint-disable-next-line no-undef
          const ws = plus.webview.currentWebview()
          // eslint-disable-next-line no-undef
          plus.webview.close(ws)
        }
      }
    },
    // //开始扫描
    startScan () {
      if (!window.plus) return
      this.startRecognize() // 创建控件
      setTimeout(() => {
        scan.start()
      }, 200)
    },
    // 取消扫描
    cancelScan () {
      // eslint-disable-next-line no-undef
      const l = plus.webview.all().length; if (l > 1) {
        // eslint-disable-next-line no-undef
        const ws = plus.webview.currentWebview()
        // eslint-disable-next-line no-undef
        plus.webview.close(ws)
      } else {
        this.$router.go(-1)
      }
      // this.$router.go(-1);
      if (!window.plus) return
      // eslint-disable-next-line no-undef
      plus.navigator.setStatusBarStyle('dark')
      if (scan) {
        scan.cancel() // 关闭扫描
        scan.close() // 关闭条码识别控件
      }
    },
    // 从相册选择图片扫码
    getPicture () {
      // eslint-disable-next-line no-undef
      plus.gallery.pick(src => {
        // eslint-disable-next-line no-undef
        plus.barcode.scan(
          src,
          (type, result) => {
            scan.cancel()
            scan.close()
            result = result.replace(/\n/g, '')
            // eslint-disable-next-line no-undef
            var w = plus.webview.open(
              result, 'test',
              {
                errorPage: '404.html',
                top: '0px',
                bottom: '0px',
                statusbar: {
                  // 顶部电量栏 背景颜色
                  background: window.backgroundColor
                },
                // backButtonAutoControl: "close",
                backButtonAutoControl: 'close',
                titleNView: {
                  backgroundColor: window.backgroundColor,
                  titleColor: '#CCCCCC',
                  autoBackButton: true,
                  buttons:
                {
                  type: 'close',
                  float: 'left',
                  onclick: clickButton
                }
                },
                progress: window.backgroundColor,
                zindex: 1000
              },
              'auto',
              200
            )

            function clickButton () {
              w.close()
              console.log('点击了关闭按钮')
              removeEventTest()
            }

            // 取消监听“返回”按钮事件
            function removeEventTest () {
              // eslint-disable-next-line no-undef
              plus.key.removeEventListener('backbutton', function () {
                // 不打印 但是移除生效
                console.log('成功取消js监听“返回”按钮事件')
              })
            }
            // eslint-disable-next-line no-undef
            if (plus.webview.all().length > 1) {
              // 扫码成功后关闭当前的webview
              // eslint-disable-next-line no-undef
              const ws = plus.webview.currentWebview()
              // eslint-disable-next-line no-undef
              plus.webview.close(ws)
            }
          },
          error => {
            this.$toast({
              message: error.message
            })
          }
        )
      })
    }
  }
}
</script>
<style lang="less" scoped>
#camera {
  height: 100%;
  width: 100%;
  .van-icon {
    top: -2px;
    font-size: 30px;
    color: #fff;
    &.back {
      left: 10px;
    }
    &.light {
      right: 10px;
    }
  }
  #scan {
    width: 100%;
    height: 100%;
    z-index: 2;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 1);
  }
  .tips {
    text-align: center;
    position: absolute;
    width: 100%;
    top: 40%;
    color: #fff;
    z-index: 3;
    left: 0%;
  }
  .action {
    position: fixed;
    z-index: 777;
    width: 100%;
    left: 0;
    bottom: 0;
    .items {
      display: flex;
      justify-content: space-around;
      background: rgba(0, 0, 0, 0.35);
      width: 60%;
      padding: 4px;
      margin: 4px auto;
      .item {
        flex-basis: 50px;
        text-align: center;
        img {
          width: 27px;
        }
      }
    }
  }
}
</style>
