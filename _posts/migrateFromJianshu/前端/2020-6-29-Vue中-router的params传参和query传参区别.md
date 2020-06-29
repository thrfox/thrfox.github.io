---
layout: post
title: Vue中-router的params传参和query传参区别.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 前端
---

### 获取参数与跳转
```
this.$router.push({path:"xxx",query:"yyy"}) // 跳转 可用name和params
this.$route.query // 获取

// 一个有r 一个无r
```
### 区别
1. params是路由的一部分,必须要有。query是拼接在url后面的参数，没有也没关系。

params一旦设置在路由，params就是路由的一部分，如果这个路由有params传参，但是在跳转的时候没有传这个参数，会导致跳转失败或者页面会没有内容。

比如：跳转/router1/:id

```
    <router-link :to="{ name:'router1',params: { id: status}}" >正确</router-link>
    <router-link :to="{ name:'router1',params: { id2: status}}">错误</router-link>
```
2. params、query不设置也可以传参，但是params不设置的时候，刷新页面或者返回参数会丢失，query并不会出现这种情况
注意:params传参，push里面只能是 name:'xxxx',不能是path:'/xxx',因为params只能用name来引入路由，如果这里写成了path，接收参数页面会是undefined！！！
