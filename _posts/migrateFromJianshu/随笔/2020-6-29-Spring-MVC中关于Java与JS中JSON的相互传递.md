---
layout: post
title: Spring-MVC中关于Java与JS中JSON的相互传递.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 随笔
---

###Java中从model转换JSON
```Java
JSONObject JSONgoods  = JSONObject.fromObject(goods);
JSONgoods.toString();
```
###JS中解析JSON
```JS
var json2map = JSON.parse(data);
var map2json = JSON.stringify(str)
```
