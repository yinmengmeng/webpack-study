const path = require('path');//通过path模块的path.resolve来得到绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin');//作用：把打包压缩后的css和js文件插入到HTML中，并且也对html打包压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//作用：打包生成新的压缩文件同时，删除掉旧的压缩文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// 把css样式提取出一个单独的文件
const TerserPlugin = require('terser-webpack-plugin');//指定JS压缩方式的插件
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');//指定CSS压缩方式的插件


/* 自定义打包规则 */
module.exports = {
  /* 基础规则 */
  // 模式: 开发模式 development & 生产模式production
  mode: "production",

  // 打包的入口{支持相对路径}   默认 src/index.js 
  entry: './src/main.js',

  // 打包后的出口{只能是绝对路径} 需要导入path模块来获取绝对路径
  output: {
    // __dirname 获取的是当前文件webpack.config.js的绝对路径
    // 通过path.resolve配置出口文件的绝对路径
    path: path.resolve(__dirname, 'dist'),
    // 打包后的文件名  因为浏览器的强缓存机制，设置每次打包后不同的文件名
    // [hash:8]生成一个8位的hash值
    filename: '[hash:8].min.js'
  },



  /* 使用插件 */
  plugins: [
    new HtmlWebpackPlugin({
      // 设置把哪个文件作为页面模板
      template: './public/index.html',
      // 设置文件名
      filename: 'index.html',
      // 把这个模板html文件也进行压缩
      minify: true
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[hash:8].min.css",//提取出的css文件名
    })
  ],



  /* 使用模块加载器 */
  module: {
    // 模块规则：使用加载器时（默认从右向左执行，从下向上）
    rules: [
      // 处理CSS相关的{含less等的处理}
      {
        test: /\.(css|less)$/i,

        // less-loader ：把less编译成css
        /* 
        1、postcss-loader ：识别CSS3样式
        2、安装使用autoprefixer插件：设置css3属性前缀 ，在postcss.config.js里对postcss-loader单独配置
        3、还需要在package.json里配置browserslist（浏览器兼容列表）
       */
        //  css-loader ：编译解析@import/URL()这种语法
        //  style-loader：把样式以内嵌式插入到标签中 不常用
        use: [
          MiniCssExtractPlugin.loader,//使用插件中的loader代替style-loader方式
          // "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      },


      // 处理JS相关
      {
        test: /\.(js|jsx)$/i,
        use: [
          "babel-loader"//把ES6转成ES5
        ],
        // 忽略node_modules下的js文件
        exclude: /node_modules/
        // include: path.resolve(__dirname, 'src')//只处理src下的js文件
      },


      // 处理图片
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{
          // url-loader： 把指定大小的图片转为base64格式
          // 不在指定范围的采用file-loader进行处理
          loader: 'url-loader',
          options: {
            // limit：边界大小
            limit: 100000
          }
        }]
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/i,
        use: [
          "file-loader"
        ]
      }
    ]
  },


  /* 设置优化项 */
  optimization: {
    //设置压缩方式
    minimizer: [
      //压缩CSS（但是必须指定JS的压缩方式）
      new CssMinimizerWebpackPlugin(),
      //压缩JS
      new TerserPlugin()
    ]
  },


  /* 解析器 */
  resolve: {
    // 设置路径别名，设置完成后，"@"代表的就是src的目录
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },


  /* webpack-dev-server的配置 */
  devServer: {
    host: '127.0.0.1',// host、port：启动的代理服务器的域名，端口
    port: 8080,
    open: true,//编译后自动打开浏览器
    hot: true,//热更新：修改代码后，自动编译，页面自动刷新
    compress: true,//开启压缩，访问的可以更快些


    // proxy跨域代理
    // '/A或/B' 只是临时设置的请求前缀，代理服务会根据不同的请求前缀，帮我们代理到不同的服务器「一般情况下，请求地址中的/A或/B前缀，在真正的请求地址中是不存在的」
    proxy: {
      '/A': {
        target: 'https://www.jianshu.com/asimov',//要跨域的那个服务器的地址
        changeOrigin: true,//修改请求头中源的信息
        ws: true,//开启websocket通信
        // secure: false, //如果只能https协议才能访问的话，就要开启 true则表示是https，false是http

        pathRewrite: {// 路径重写，/A或/B只是用来区分代理到哪个服务器，在真实请求地址中是不存在的，所以把/A去掉
          '^/A': ''
        }
      },
      '/B': {
        target: 'https://news-at.zhihu.com/api/4',
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/B': '' }
      }
    }
  }

}


/* 兼容处理 */
// @1 处理CSS3兼容：
// postcss-loader「webpack配置项中」 & autoprefixer「postcss.config.js」 & browserslist「package.json」: 根据指定的浏览器兼容列表，自动为CSS3样式属性设置相关的前缀，以此来实现浏览器的兼容性！！

/* 
@2 处理JS兼容
      + babel-loader「webpack配置项中」& @babel/preset-env「babel.config.js」& browserslist「package.json」：基于babel把ES6“语法”转换为ES5语法，以此实现IE浏览器的兼容！！

      + 对于ES6内置API，babel语法包是无法转换的，此时需要基于 @babel/polyfill 来处理「在入口文件main.js中导入@babel/polyfill，其中包含了常用ES6内置API的重写」 
*/