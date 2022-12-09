---
layout: post
title: 配置systemctl自启动服务.md
subtitle: 配置systemctl自启动服务
author: "Azukin"
header-style: text
tags:
  - linux
---

## systemctl 命令示例
~~~sh
# 启动nginx服务
systemctl start nginx.service
# 停止nginx服务
systemctl stop nginx.service
# 重启nginx服务
systemctl restart nginx.service
# 查看nginx服务当前状态
systemctl status nginx.service
# 查看所有已启动的服务
systemctl list-units --type=service
~~~

## 自定义服务文件，添加到系统服务，通过Systemctl管理
1.写自定义服务文件,
~~~conf
[Unit]:服务的说明
Description:描述服务
After:描述服务类别

[Service]服务运行参数的设置
Type=forking            是后台运行的形式
ExecStart              为服务的具体运行命令
ExecReload              为服务的重启命令
ExecStop                为服务的停止命令
PrivateTmp=True        表示给服务分配独立的临时空间
注意：启动、重启、停止命令全部要求使用绝对路径

[Install]              服务安装的相关设置，可设置为多用户
WantedBy=multi-user.target
~~~

2.设置754权限并放到/usr/lib/systemd/system目录
~~~sh
chmod 754 xxx.service
cp xxx.service /usr/lib/systemd/system
~~~

3.文件示例
~~~conf
# frpc.service进程管理服务文件
[Unit]
Description=frpc service
After=network.target syslog.target
Wants=network.target
[Service]
Type=simple
Restart=always #当程序退出时，自动重启。
#最好使用非root用户启动
#User=frp
#Group=frp
#启动服务的命令（此处写你的frpc的实际安装目录）
ExecStart=/opt/frpc -c /opt/frpc/frpc.ini
ExecStop=/bin/kill $MAINPID
ExecReload=/bin/kill $MAINPID && /opt/frpc -c /opt/frpc/frpc.ini
[Install]
WantedBy=multi-user.target
~~~

~~~conf
# supervisord.service进程管理服务文件
[Unit]
Description=Process Monitoring and Control Daemon  # 内容自己定义：Description=Supervisor daemon
After=rc-local.service nss-user-lookup.target

[Service]
Type=forking
ExecStart=/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
ExecStop= /usr/bin/supervisorctl shutdown
ExecReload=/usr/bin/supervisorctl reload
Restart=on-failure
RestartSec=42s
KillMode=process

[Install]
WantedBy=multi-user.target
~~~

~~~conf
# nginx.service服务文件
[Unit]
Description=Process Monitoring and Control Daemon  # 内容自己定义：Description=Supervisor daemon
After=rc-local.service nss-user-lookup.target

[Service]
Type=forking
ExecStart=/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
ExecStop= /usr/bin/supervisorctl shutdown
ExecReload=/usr/bin/supervisorctl reload
Restart=on-failure
RestartSec=42s
KillMode=process

[Install]
WantedBy=multi-user.target
~~~

~~~conf
# redis.service服务文件
[Unit]
Description=Redis
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
ExecStart=/usr/local/bin/redis-server /etc/redis.conf
ExecStop=kill -INT `cat /tmp/redis.pid`
User=www
Group=www

[Install]
WantedBy=multi-user.target
~~~