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
#      - 19020:3000
    restart: unless-stopped
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
    restart: unless-stopped
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
    ports:
      - '28080:8080'
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
      
  # 日志采集
  loki:
    container_name: loki
    image: grafana/loki:2.4.1
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai
      - LANG=zh_CN.UTF-8
    expose:
      - 3100
    ports:
      - 3100:3100
    networks:
      - grafana-network
    volumes:
      - ./loki:/etc/loki
    command:
      - '-config.file=/etc/loki/loki-config.yaml'

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
  # 日志采集
  promtail:
    image: grafana/promtail:2.4.2
    container_name: promtail
    restart: unless-stopped
    privileged: true
    command:
      - '-config.file=/mnt/config/promtail-config.yaml'
    volumes:
      - ./promtail:/mnt/config
      # docker info 展示的docker目录
      - /data/docker:/var/lib/docker:ro
```


### prometheus配置文件 prometheus.yml
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

### loki配置文件  loki-config.yaml
```yml
auth_enabled: false

server:
  http_listen_port: 3100

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

ruler:
  alertmanager_url: http://localhost:9093

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  ingestion_rate_mb: 30  #修改每用户摄入速率限制，即每秒样本量，默认值为4M
  ingestion_burst_size_mb: 15  #修改每用户摄入速率限制，即每秒样本量，默认值为6M

chunk_store_config:
        #max_look_back_period: 168h   #回看日志行的最大时间，只适用于即时日志
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: false #日志保留周期开关，默认为false
  retention_period: 0s  #日志保留周期
```

### promtail-config.yaml
```yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

#把loki当客户端连接
clients:
  - url: http://192.168.7.13:3100/loki/api/v1/push

scrape_configs:
 - job_name: system
   pipeline_stages:
   static_configs:
   - targets:
      - localhost
     labels:
      #标签，用于后面的查询
      job: docker
      __path__: /var/lib/docker/containers/**/*.log
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

# 离线安装 loki-docker-driver插件
## 1.将已经安装有插件的机器上的插件拷贝下来
tar -czvf loki-plugins.tar.gz /var/lib/docker/plugins/307feaef893c5f8e493c6492d52e86264faa3f253de38c49da66f96aa578aef7 
## 2.到目标机器解压，然后重启docker
tar -zxf loki-plugins.tar.gz 
systemctl restart docker
```
##### 配置全局容器日志，发送到loki，全局配置需要重启容器
```sh
vi /etc/docker/daemon.json
{
  "log-driver": "loki",
  "log-opts": {
    "loki-url": "http://192.168.7.13:3100/loki/api/v1/push",
    "max-size": "50m",
    "max-file": "10"
  }
}

# 配置完后重新创建容器,重新创建容器！重新创建容器！不是重启docker，也不是重启restart容器
docker-compose down
docker-compose up -d
# 或者
docker rm {{ContainerId}} -f
docker run {{ImageId}}
```

##### 单独配置服务的docker-compose的log配置发送到loki
```yml
# docker-compose 示例服务
services:
  logger:
    image: grafana/grafana
    logging:
      driver: loki
      options:
        loki-url: "http://221.7.133.178:19021/loki/api/v1/push"
        max-size: "50m"
        max-file: "10"
```


### 将loki过滤的host改为自定义
```shell
# 该项读取的是uname -n的hostname，修改后重启docker生效
# centos7 为例
$ uname -n
$ localhost.localdoamin
# 修改hostname
$ hostnamectl set-hostname 192-168-7-13
# 修改hosts
$ vi /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4 192-168-7-13
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
$ systemctl restart docker
```


