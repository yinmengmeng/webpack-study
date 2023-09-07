/* 针对postcss-loader 的配置项*/
module.exports={
  plugins:[
    // 在postcss-loader里使用autoprefixer插件，自动添加属性前缀
    require('autoprefixer')
  ]
}