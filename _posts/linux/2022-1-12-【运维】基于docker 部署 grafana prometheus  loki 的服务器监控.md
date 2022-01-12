---
layout: post
title: 【运维】基于docker 部署 grafana prometheus  loki 的服务器监控
subtitle: 【运维】基于docker 部署 grafana prometheus loki 的服务器监控
author: "Azukin"
header-style: text
category: linux
tags:
  - linux
---

### docker-compose.yml文件
```yml
version: '3'
services:
  # 视图化界面
  grafana:
    container_name: grafana
    image: grafana/grafana:8.3.3
    networks:
      - grafana-network
    user: '0'
    environment:
      - TZ=Asia/Shanghai
    expose:
      - 3000
    ports:
      - 3000:3000
      - 19020:3000
    restart: always
    volumes:
      - ./grafana/storage:/var/lib/grafana
  # 日志存储
  prometheus:
    container_name: prometheus
    image: prom/prometheus:v2.32.1
    networks:
      - grafana-network
    user: '0'
    environment:
      - TZ=Asia/Shanghai
    expose:
      - 9090
    ports:
      - 9090:9090
    restart: always
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    command:
    # 热加载 curl -X POST http://localhost:9090/-/reload
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--web.enable-lifecycle'
  # cadvisor docker 容器监控
  cadvisor:
    image: google/cadvisor:v0.33.0
    container_name: cadvisor
    restart: unless-stopped
    networks:
      - grafana-network
    expose:
      - 8080
    #ports:
    #  - '8080:8080'
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /home/docker/:/var/lib/docker:ro
  # 系统监控
  node-exporter:
    image: prom/node-exporter:v1.3.1
    container_name: node-exporter
    restart: unless-stopped
    networks:
      - grafana-network
    expose:
      - 9100
    ports:
      - 9100:9100
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
      - '--collector.textfile.directory=/node_exporter/prom'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
      - ./node_exporter/prom:/node_exporter/prom
      
  # 日志采集
  loki:
    container_name: loki
    image: grafana/loki:2.4.1
    restart: always
    environment:
      - TZ=Asia/Shanghai
      - LANG=zh_CN.UTF-8
    expose:
      - 3100
    ports:
      - 3100:3100
    networks:
      - grafana-network

networks:
  grafana-network:
    external: true
```

### 子节点监控编排 docker-compose -f sys-node-client.yml up -d
```yml
version: '3'
services:
  # cadvisor docker 容器监控
  cadvisor:
    image: google/cadvisor:v0.33.0
    container_name: cadvisor
    restart: unless-stopped
    expose:
      - 8080
    ports:
      - 28080:8080
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      # docker info 展示的docker目录
      - /home/docker/:/var/lib/docker:ro
  # 系统监控
  node-exporter:
    image: prom/node-exporter:v1.3.1
    container_name: node-exporter
    restart: unless-stopped
    expose:
      - 9100
    ports:
      - 29100:9100
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
      - '--collector.textfile.directory=/node_exporter/prom'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
      - ./node_exporter/prom:/node_exporter/prom
```


### prometheus.yml
```yml
global:
  scrape_interval:     60s
  evaluation_interval: 60s
          
scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['prometheus:9090']
        labels:
          instance: prometheus

  - job_name: 'node-exporter'
    scrape_interval: 5s
    static_configs:
    # 子节点IP配置
      - targets: ['node-exporter:9100']
        labels:
          instance: '192.168.7.13'
      - targets: ['192.168.7.12:29100']
        labels:
          instance: '192.168.7.12'

  - job_name: 'cadvisor'
    scrape_interval: 5s
    static_configs:
      - targets: ['cadvisor:8080']
        labels:
          instance: '192.168.7.13'
      - targets: ['192.168.7.12:28080']
        labels:
          instance: '192.168.7.12'
```

### grafana配置loki数据源
# 在左边列表找到Configuration 添加数据源

### docker 安装 loki插件，并将容器日志发送到loki
```sh
# docker安装loki 插件
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
# 启用
docker plugin enable loki
systemctl restart docker

# 更新
docker plugin disable loki --force
docker plugin upgrade loki grafana/loki-docker-driver:latest --grant-all-permissions
docker plugin enable loki
systemctl restart docker

# 配置全局容器日志，发送到loki，全局配置需要重启docker
vi /etc/docker/daemon.json
{
  "log-driver": "loki",
  "log-opts": {
    "loki-url": "http://192.168.7.13:3100/loki/api/v1/push",
    "max-size": "50m",
    "max-file": "10"
  }
}

systemctl restart docker
```



