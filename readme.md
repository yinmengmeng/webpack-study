[https://webpack.docschina.org/](https://webpack.docschina.org/)

---

- 安装在全局的模块，一般可以使用命令进行操作
   - 电脑上所以项目都可以用，但也存在“版本冲突问题”
   - 所以，只有需要直接使用相关命令操作，而且不容易产生版本冲突问题的情况下，我们把模块安装在全局，例如：`@vue/cli`/`create-react-app`/`yarn`/`pm2`/`nrm`等
- 类似`webpack`这种，我们都是安装在本地项目中
   - 有效避免冲突问题，而且可以导入到代码中调用
   - 不能直接使用相关的命令，比如直接使用`webpack`命令，会提示不存在
      - 如果想使用命令，则需要在`package.json`中，基于`scripts`配置可执行的脚本
         1. 首先看是否是可使用的命令，在`node_modules/.bin`文件夹下出现的命令才是可以使用的
         2. 去scripts中配置脚本
```json
"scripts": {
	"serve": "webpack server",
	"build": "webpack"
}
```

         3. 开始执行脚本 `npm run 脚本名`/`yarn 脚本名`
<a name="VTyJ7"></a>
# 一、安装webpack模块

- `$ npm init -y`
- `$ npm install webpack webpack-cli --save-dev`
- OR
- `$ yarn add webpack webpack-cli -D`
<a name="wtydg"></a>
# 二、配置`webpack.config.js`文件
<a name="nMhw3"></a>
## 1、零配置使用
配置好脚本后，执行`yarn build`，webpack的默认入口文件是`src/index.js`，打包后的文件默认放在`dist`文件夹下
> 从webpack5开始，自带treeshaking效果，只打包模块中用到的，没有用到的代码会自动剪辑掉

<a name="lgxnY"></a>
## 2、自定义基础配置
> 通过webpack.config.js OR webpackfile.js

```javascript
const path = require('path');//通过path模块的path.resolve来得到绝对路径


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
  }
}
```
<a name="gNhq7"></a>
## 3、plugins 使用插件
<a name="Onwyn"></a>
### 3-1、html-webpack-plugin 
> 编译一个HTML，把打包压缩后的css和js文件插入到HTML中，并且也对这个html文件打包压缩

> npm i html-webpack-plugin --save-dev

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');//作用：把打包压缩后的css和js文件插入到HTML中，并且也对html打包压缩


module.exports = {
// ...
	
  /* 使用插件 */
  plugins: [
    new HtmlWebpackPlugin({
      // 设置把哪个文件作为页面模板
      template: './public/index.html',
      // 设置文件名
      filename: 'index.html',
      // 把这个模板html文件也进行压缩
      minify: true
    })
  ],

	// ...
}

```
<a name="qDAR1"></a>
### 3-2、**clean-webpack-plugin**
> 打包生成新的压缩文件同时，删除掉旧的压缩文件

> npm i clean-webpack-plugin --save-dev

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//作用：打包生成新的压缩文件同时，删除掉旧的压缩文件


module.exports={
	// ...
	
    plugins:[
        new CleanWebpackPlugin()
    ]
	
	// ...
};
```
<a name="Xjkrv"></a>
### 3-3、mini-css-extract-plugin
> 把css样式提取出一个单独的文件
> npm i mini-css-extract-plugin --save-dev

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// 把css样式提取出一个单独的文件

module.exports = {
// ...
  plugins: [
		// ...
    new MiniCssExtractPlugin({
      filename:"[hash:8].min.css",//提取出的css文件的文件名
    })
  ],

	
  module: {
    rules: [
      {
        // 处理CSS相关的{含less等的处理}
        test: /\.(css|less)$/i,
        use: [
          MiniCssExtractPlugin.loader,//使用插件中的loader代替style-loader方式
          // "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      }
    ]
  }
}
```

<a name="elCgs"></a>
## 4、module 使用模块加载器
<a name="MzUk2"></a>
### 4-1、处理CSS相关的loader加载器
>  npm i css-loader style-loader less less-loader autoprefixer postcss-loader --save-dev

**模块规则：使用loader加载器时（默认从右向左，从下向上）**

- `less-loader` ：把less编译成css
- `**postcss-loader**`**处理CSS3样式的兼容**：
   1. `postcss-loader` ：识别CSS3样式
   2. `autoprefixer`插件：自动添加属性前缀 ，在`postcss.config.js`里对`postcss-loader`单独配置使用此插件
   3. 还需要在`package.json`里配置`browserslist`（配置浏览器兼容列表）
- `css-loader` ：编译解析`@import/URL()`这种语法
- `style-loader`：把css样式以内嵌式插入到标签中 「不常用」

**webpack.config.js :**
```javascript
module.exports = {
// ...
	
  /* 使用模块加载器 */
  module: {
    // 模块规则：使用loader加载器时（默认从右向左，从下向上）
    rules: [
      {
        // 处理CSS相关的{含less等的处理}
        test: /\.(css|less)$/i,
        use: [
					 MiniCssExtractPlugin.loader,//使用插件中的loader代替style-loader方式
          // "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      }
    ]
  }

	// ...
}

```
**postcss.config.js：**
```javascript
/* 针对postcss-loader 的配置项*/
module.exports={
  plugins:[
    // 在postcss-loader里使用autoprefixer插件，自动添加属性前缀
    require('autoprefixer')
  ]
}
```
**package.json：**
```javascript
{
	//...
	
	"browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
```
<a name="p8MxL"></a>
### 4-2、处理JS相关的loader
> $ npm i babel-loader @babel/preset-env --save-dev**（开发依赖）**
> $ npm i @babel/polyfill **(生产依赖)**

- 处理JS中ES6语法的兼容：
   1. `babel-loader`：把ES6语法转成ES5语法
   2. `@babel/preset-env` ：指定`babel-loader`使用的语法包，在`babel.config.js`里对`babel-loader`单独配置使用这个语法包
   3. 还需要在`package.json`里配置`browserslist`（配置浏览器兼容列表）
- 处理ES6中内置API的兼容
   - `@babel/polyfill`：处理ES6里自己的内置API（例如Promise等）「**在入口文件**`**main.js**`**中导入**`**@babel/polyfill**`**，**`**@babel/polyfill**`**对ES6里的内置API进行了重写**」

**webpack.config.js：**
```javascript
module.exports = {
// ...
	
  module: {
    rules: [
      // 处理JS相关
      {
        test: /\.(js|jsx)$/i,
        use: [
          "babel-loader"//把ES6语法转成ES5语法
        ],
      }
    ]
  }

	// ...
}

```
**babel.config.js**
```javascript
/* 针对babel-loader的配置 */
module.exports = {
  // 指定babel-loader使用的语法包
  presets: [
    "@babel/preset-env"
  ]
}
```
**package.json**
```javascript
{
	//...
	
	"browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
```
**main.js**
```javascript
import '@babel/polyfill';

new Promise((resolve, reject) => {
  
})
```
<a name="RcmhR"></a>
### 4-3、处理图片的相关loader
> npm i file-loader url-loader --save-dev

```javascript
module.exports = {
// ...
	
  module: {
    rules: [
			// ...
			
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
  }

	// ...
}

```
<a name="vV8QW"></a>
## 5、optimization 设置优化项
<a name="Nahz0"></a>
### 5-1、设置CSS/JS压缩优化项
> npm i optimize-css-assets-webpack-plugin  terser-webpack-plugin --save-dev

```javascript
const TerserPlugin = require('terser-webpack-plugin');//指定JS压缩方式的插件
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');//指定CSS压缩方式的插件


module.exports={
	// ...
	
  /* 设置优化项 */
  optimization: {
    //设置压缩方式
    minimizer: [
      //压缩CSS（但是必须指定JS的压缩方式）
      new CssMinimizerWebpackPlugin(),
      //压缩JS
      new TerserPlugin()
    ]
  }
}
```
<a name="IS18K"></a>
## 6、resolve 解析器
> 配置路径解析

```javascript
module.exports={
	// ...
	
  /* 解析器 */
  resolve: {
    //alias： 设置路径别名，设置完成后，"@"代表的就是src目录的路径，然后在main.js里就可以用@代表路径了
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  }
}
```
例如：<br />main.js
```javascript
import '@/assets/css/reset.min.css';//@代表的是配置好的src这个目录
import '@/index.less'
```
<a name="uVH7R"></a>
## 7、webpack-dev-server

- 在本地创建一个web服务器，用来预览我们的项目
- 自动打开浏览器预览
- 当代码更改后，自动编译，编译后浏览器会自动刷新
- 实现proxy跨域代理「启动的这个web服务器充当代理服务器」
> 会把编译的内容，放到虚拟内存中，启动的代理服务器，会从虚拟内存中读取这些内容进行预览

> 运行脚本yarn serve，来启动

```javascript
module.exports={
	// ...
	
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
```
**main.js**
```javascript
import axios from 'axios';
axios.get('/A/subscriptions/recommended_collections')
    .then(response => response.data)
    .then(value => {
        console.log('简书:', value);
    });

```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2557214/1691132972533-6bde51a4-2cf3-4dba-96fe-f77b2596017e.png#averageHue=%23fefefe&clientId=uaee4bc49-d29d-4&from=paste&height=123&id=u75889f5e&originHeight=185&originWidth=1110&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=14326&status=done&style=none&taskId=u21a362ce-ba21-478d-9100-e72015eb131&title=&width=740)<br />main.js里get请求地址只要写了“/”，默认就是向当前服务器发请求，“/A”也就是http://127.0.0.1:8080/A，<br />也就是请求地址是http://127.0.0.1:8080/A/subscriptions/recommended_collections，<br />因为我们的`proxy`代理中配置了“`/A`”前缀的，都会代理到https://www.jianshu.com/asimov/，<br />所以请求地址变为https://www.jianshu.com/asimov**/A/**subscriptions/recommended_collections，<br />又因为我们在`proxy`里配置了 `pathRewrite: { '^/A': '' }`，**把/A路径重写成了**`**''**`，所以**最终的真实请求地址是：**https://www.jianshu.com/asimov/subscriptions/recommended_collections

---


---

<a name="vIgKD"></a>
# 三、各个配置文件参考
webpack.config.js
```javascript
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
```
postcss.config.js
```javascript
/* 针对postcss-loader 的配置项*/
module.exports={
  plugins:[
    // 在postcss-loader里使用autoprefixer插件，自动添加属性前缀
    require('autoprefixer')
  ]
}
```
babel.config.js
```javascript
/* 针对babel-loader的配置 */
module.exports = {
  // 指定babel-loader使用的语法包
  presets: [
    "@babel/preset-env"
  ]
}
```
main.js
```javascript
import '@/assets/css/reset.min.css';
import '@/index.less'
import '@babel/polyfill';
import sum from '@/A';
import { average } from '@/B';
// import * as B from './B.js'; //也可以这么写  B.average()
import axios from 'axios'

let arr = [10, 20, 30, 40, 50];
console.log(sum(...arr));
console.log(average(...arr));


axios.get('/A/subscriptions/recommended_collections')
.then(response=>response.data)
.then(value=>{
  console.log('简书',value);
  
})
axios.get('/B/news/latest')
    .then(response => response.data)
    .then(value => {
        console.log('知乎:', value);
    });

/* 
get请求地址只写“/A/subscriptions/recommended_collections”，默认请求地址是http://127.0.0.1:8080/A/subscriptions/recommended_collections，
因为我们的proxy代理中配置了“/A”前缀的，都会代理到https://www.jianshu.com/asimov/，
所以请求地址变为https://www.jianshu.com/asimov/A/subscriptions/recommended_collections，
又因为我们在proxy里配置了 pathRewrite: { '^/A': '' }，把/A路径重写成了''，所以最终的真实请求地址是：https://www.jianshu.com/asimov/subscriptions/recommended_collections
*/
```
