---
layout: post
title: 【IDEA】导入Maven多模块项目时无法找到dependency.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - IDE编辑器
---

###必须先导入多模块项目中的parent项目，否则maven的dependency会红线无法找到依赖
![image.png](https://upload-images.jianshu.io/upload_images/8222680-b766e2b23a55e7cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###然后依次导入子模块项目即可

![image.png](https://upload-images.jianshu.io/upload_images/8222680-4b96d85e7c075b88.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

