---
layout: post
title: 【模板】docker-compose
subtitle: 【模板】docker-compose
author: "thrfox"
header-style: text
category: linux
tags:
  - linux
  - docker
  - 模板
---

~~~yml
version: '3'
services:
  <service_name>:
    container_name: <container_name>
    restart: always
    image: <image_name>:<image_version>
    expose:
      - <container_port>
    ports:
      - <host_port>:<container_port> 
    command: <run_command>
    volumes:
      - <host_path>:<container_path>
    depends_on:
      - <container_name>
    links:
      - <container_name>
    external_links:
      - <outside_container_name> # 可以单向的连接外部的容器(在别的docker-compose文件里的容器)
    networks:
      - <network_name>
networks:
  # 1.使用已存在的网络
  <network_name>:  # 网络名称
    external: true
  # 2.创建网络
  <network_name>:
    driver:bridge # 常用的有bridge/host/none等
    name:<network_name> # 指定网络名字，如果不指定会按默认规则创建
  

~~~