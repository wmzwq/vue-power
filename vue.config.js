// const autoprefixer = require('autoprefixer')
// const pxtorem = require('postcss-pxtorem')
const popxex = require('postcss-px2rem-exclude')
module.exports = {
  // chainWebpack: config => {
  //   // 发布模式
  //   config.when(process.env.NODE_ENV === 'production', config => {
  //     config
  //       .entry('app')
  //       .clear()
  //       .add('./src/main-prod.js')

  //     config.set('externals', {
  //       vue: 'Vue',
  //       'vue-router': 'VueRouter',
  //       axios: 'axios',
  //       lodash: '_',
  //       echarts: 'echarts'
  //     })
  //   })

  //   // 开发模式
  //   config.when(process.env.NODE_ENV === 'development', config => {
  //     config
  //       .entry('app')
  //       .clear()
  //       .add('./src/main-dev.js')
  //   })
  // },
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://122.228.89.215:8897/', // 你请求的第三方接口
  //       changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
  //       pathRewrite: { // 路径重写，
  //         '^/api': '' // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
  //       }
  //     }
  //   }

  //   // before: app => {}
  // },
  configureWebpack: {
    externals: {
      BMap: 'BMap'
    }
  },
  lintOnSave: true,
  css: {
    // modules:false,
    // extract:true,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          // autoprefixer(),
          // pxtorem({
          //   rootValue: 37.5, // vant使用375设计稿,其他使用750设计稿，rootValue:75
          //   selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
          //   propList: ['*']
          // })
          // eslint-disable-next-line no-undef
          popxex({
            remUnit: 37.5, // 结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
            exclude: /node_modules|folder_name/i // 屏蔽node_modules里的css，使用postcss-px2rem不能屏蔽，所以会导致引入的一些ui变形
          })
        ]
      }
    }
  },
  publicPath: './' // 需要配置 否则打包后的apk文件安装在手机可能白屏
}
