---
layout: post
title: 配置supervisor自启动与使用.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - linux
---

### 配置Supervisor开机启动：
新建一个“supervisord.service”文件
```sh
# dservice for systemd (CentOS 7.0+) 
# by ET-CS (https://github.com/ET-CS) 
[Unit] 
Description=Supervisor daemon
[Service] 
Type=forking 
ExecStart=/usr/bin/supervisord -c /etc/supervisor/supervisord.conf 
ExecStop=/usr/bin/supervisorctl shutdown 
ExecReload=/usr/bin/supervisorctl reload 
KillMode=process 
Restart=on-failure 
RestartSec=42s
[Install] 
WantedBy=multi-user.target
```

将文件拷贝至：“/usr/lib/systemd/system/supervisord.service”
`systemctl enable supervisord`
验证一下是否为开机启动：`systemctl is-enabled supervisord


`supervisord -c /etc/supervisor/supervisord.conf` 以该conf文件启动
```sh 
# supervisord.conf中的
[include]
supervisor.d/*.conf  加载该相对文件夹下conf文件，建议一个程序配置一个conf
```
```ideaServer.conf
[program:idea-server]
command=/home/thrza/IntelliJIDEALicenseServer -p 1027
directory = /home/thrza
autostart=true
autorestart=true
startsecs=3
stdout_logfile=/home/thrza/supervisor/IdeaServer.log
```

### supervisor基本使用指南
[supervisor基本使用指南1](https://www.cnblogs.com/zhoujinyi/p/6073705.html)

