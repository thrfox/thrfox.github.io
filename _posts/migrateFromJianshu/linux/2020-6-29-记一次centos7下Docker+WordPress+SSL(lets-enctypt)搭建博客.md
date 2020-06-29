---
layout: post
title: 记一次centos7下Docker+WordPress+SSL(lets-enctypt)搭建博客.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - linux
---

需要组件：
1.docker
2.docker-compose
# 步骤1
安装上述组件
```
# 安装docker
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh
# 安装docker-compose
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
$ docker-compose --version
```
# 步骤2
查看uid与gid
```
$ id <用户名>
uid=1001(thrza) gid=0(root) groups=0(root),4(adm),39(video),994(docker),1000(google-sudoers)
# 没有docker组的需要创建
$ sudo groupadd docker
$ sudo usermod -aG docker <USER> # 用户名 
$ logout # 重新登录
```
docker-compose安装wordpress和mysql
```
$ cd ~/wordpress
$ vi docker-compose.yml
```
复制以下，需要有部分地方需要修改，不需要SSL的可以删去letsencrypt部分，但是需要将wordpress暴露80端口
```
version: '3.3'

services:
   mysql-wordpress:
     image: mysql:5.7
     volumes:
       - ./mysql-data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: wordpress # mysql root密码
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress
   wordpress:
     depends_on:
       - mysql-wordpress
     image: wordpress:5.2.0
     expose:
       - "80"
     restart: always
     volumes:
       - ./wordpress:/var/www/html
     environment:
       WORDPRESS_DB_HOST: mysql-wordpress:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
   letsencrypt:
    image: linuxserver/letsencrypt
    cap_add:
      - NET_ADMIN
    environment:
      - PUID=1001 # <uid>必填，用户ID
      - PGID=994 # <gid>必填，组ID，不能为root组=0
      - TZ=Asia/Shanghai
      - URL=lifeisff.fun # 域名地址
      - SUBDOMAINS=www,
      - VALIDATION=http
      - DUCKDNSTOKEN=token #optional
      - EMAIL=www4836@gmail.com #optional
      - ONLY_SUBDOMAINS=false #optional
      - STAGING=false #optional
    volumes:
      - ./letsencrypt:/config
    ports:
      - 443:443
      - 80:80 #optional
    restart: unless-stopped
```
# 步骤3
编辑nginx.conf
```
$ vi ~/wordpress/letsencrypt/nginx/site-confs/default
```
复制以下配置，转发至wordpress的80端口，来自参考文章
```
# redirect all traffic to https
server {
  listen 80;
  listen [::]:80;
  server_name _;
  return 301 https://$host$request_uri;
}

# main server block
server {
  listen 443 ssl http2 default_server;
  listen [::]:443 ssl http2 default_server;

  server_name _;

  # enable subfolder method reverse proxy confs
  include /config/nginx/proxy-confs/*.subfolder.conf;

  # all ssl related config moved to ssl.conf
  include /config/nginx/ssl.conf;

  client_max_body_size 0;

  location / {
    proxy_pass http://wordpress:80;
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
运行并等待配置ssl
```
$ docker-compose up -d
$ docker ps
```
# 步骤4
结束
参考文章
[Build a Website with WordPress, Let’s-Encrypt and Docker](https://www.bd16s.com/2018/12/25/build-a-website-with-wordpress-lets-encrypt-and-docker/)
