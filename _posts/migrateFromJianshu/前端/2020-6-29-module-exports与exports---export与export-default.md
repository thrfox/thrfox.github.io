---
layout: post
title: module-exports与exports---export与export-default.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 前端
---

###一.module.exports与exports
是nodeJS的commonJS规范，定义为模块/对象，类似于java的class
导入：require('abc')
导出：module.exports = {aaa: x},文件名abc.js
###二.export与export default
是ES6的规范
导入：import ... from ...
导出：export 或者export default(为模块制定默认输出)
