---
layout: post
title: 基于xboot项目的SpringBoot学习.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Java
---

该学习基于github上的xboot中文项目，贴下地址
https://github.com/Exrick/x-boot
# 配置文件application.yml
该文件结构梗概
```
# 配置文件加密key
jasypt:
  encryptor:
    password: xboot
server:
  port: 8888
spring:
# 数据源
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/xboot?useUnicode=true&characterEncoding=utf-8&useSSL=false
    username: root
    # Jasypt加密 可到common-utils中找到JasyptUtil加解密工具类生成加密结果 格式为ENC(加密结果)
    password: ENC(F4B0s6u9xcDw3V+P0qC4CA==)
    type: com.alibaba.druid.pool.DruidDataSource
    driverClassName: com.mysql.jdbc.Driver
    logSlowSql: true
  jpa:
    show-sql: true
    # 自动生成表结构
    generate-ddl: true
    hibernate:
      ddl-auto: none
 Redis
  redis:
    host: 127.0.0.1
    password:
    # 数据库索引 默认0
    database: 0
    port: 6379
    timeout: 3000
Elasticsearch
  data:
    elasticsearch:
      cluster-nodes: 127.0.0.1:9300
# 文件大小上传配置
  servlet:
    multipart:
      max-file-size: 5Mb
      max-request-size: 5Mb
```
#### 该文件类似与spring中的spring-application.property + web.xml + server.xml
可以配置端口，连接数据库，第三方组件等。

#### SpringBoot中常用注解
@SpringBootApplication 用于标识启动类
@RestController 相当于@ResponseBody加上@Controller
@ApiOperation 标识方法的api接口说明文档 (swagger-spring)



#### 配置文件加密工具Jasypt
有些时候，配置文件的一些信息需要加密处理，如数据库的密码等
Jasypt工具提供了对密码进行加密解密的功能
input为明文或密文，password为任意设置的秘钥
