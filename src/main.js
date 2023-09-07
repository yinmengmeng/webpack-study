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