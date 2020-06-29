---
layout: post
title: ES6中的Promise.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 前端
---

有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）
该代码创建了一个promise实例
```
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```
若成功，则将resolve(value)的里的值返回出去，即const promise = value
若失败，则将reject(error)的里的值返回出去，即const promise = error

