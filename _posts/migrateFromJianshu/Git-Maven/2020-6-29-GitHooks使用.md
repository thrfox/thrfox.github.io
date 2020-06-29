---
layout: post
title: GitHooks使用.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Git-Maven
---

问题描述: 服务器需要部署Django应用,且需要继续在本地windows下继续开发,GitHooks实现从本地推送至服务器并自动部署

----------------------------
###1. 服务器上建一个裸仓库(git的远端仓库)
```
cd /home/thrza/workspace
git init --bare AmazingCode.git
```
###2.建立一个普通仓库,拉取服务器远端仓库,存放网站源代码
```
cd /home/thrza/nginx/project/AmazingCode
git clone /home/thrza/workspace/AmazingCode.git
```

###3.配置GitHook
```
cd /home/thrza/workspace/AmazingCode.git/hooks
vi post-receive
```
该post-receive文件会在每次git push之后触发
```
post-receive

#!/bin/sh
unset GIT_DIR
Path="/usr/local/nginx/project/AmazingCode"
echo "deploying the blog web project"
cd $Path
git fetch --all
git reset --hard origin/master
touch /home/thrza/shell/uwsgi-reload
time='date'
echo "pull at webserver at time: $time."
```
还有post-commit等其他触发
详见[Git挂钩](https://git-scm.com/book/zh/v1/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git%E6%8C%82%E9%92%A9)或[Git-Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

###4.本地关联服务器的远端仓库
```
git init
git add .
git commit -m "first commit"
git remote add origin ssh://xxx:22/home/thrza/workspace/AmazingCode.git
git push -u origin master
```



