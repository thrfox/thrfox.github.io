---
layout: post
title: 【JavaScript】三种方法循环map取key和value.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 随笔
---

```js
//cssMap为一个Map
for(var key in cssMap) {
  content.css(key, cssMap[key]);
}
```
```js
var key = Object.keys(cssMap);
for(var j = 0;j < key.length;j++) {
  content.css(key[j], cssMap[key[j]]);
}
```
```js
$.each(cssMap,function (i,v) {
  content.css(i,v);
})

```
