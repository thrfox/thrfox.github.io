---
layout: post
title: 新项目本地Git关联远程GitHub.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Git-Maven
---

# 1.GItHub上新建工程
![image.png](https://upload-images.jianshu.io/upload_images/8222680-e886b9633f3d12e9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
# 2.编辑.gitignore文件,该配置文件不git
格式为绝对路径,可以使用通配符
如.idea/* 即.idea文件夹下的所有文件(包括下属所有文件夹)
.idea/*.* 即.idea文件夹下的所有文件(所有后缀,但不包括下属文件夹)

# 3.初始化仓库,与远程仓库建立连接
git init
git add .
git commit -m "first commit"
git remote add origin https://xxxx.git
git push -u origin master
提示输入GitHub用户名,密码,输入即可
![image.png](https://upload-images.jianshu.io/upload_images/8222680-84070c3e03278926.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


