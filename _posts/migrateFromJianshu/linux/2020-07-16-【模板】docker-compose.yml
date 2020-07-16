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
  janus-server:
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
~~~