---
layout: post
title: 【Spring】logback配置记录
subtitle: 【Spring】logback配置记录
author: "Azuki"
header-style: text
category: Java
tags:
  - Java
  - Spring
---

~~~xml  logback-spring.xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false" scan="true" scanPeriod="30 seconds">
    <include resource="org/springframework/boot/logging/logback/base.xml"/>
    <springProperty scope="context" name="springAppName" source="spring.application.name"/>
    <contextName>${springAppName}</contextName>

    <springProperty scope="context" name="log.path" source="logging.file.path"/>


    <property name="log.maxFileSize" value="300MB"/>
    <property name="log.totalSizeCap" value="500MB"/>
    <property name="log.maxHistory" value="30"/>
    <property name="log.colorPattern"
              value="%magenta(%d{yyyy-MM-dd HH:mm:ss}) %highlight(%-5level) %boldCyan(${springAppName:-}) %yellow(%thread) %green(%logger) %msg%n"/>
    <property name="log.pattern" value="%d{yyyy-MM-dd HH:mm:ss} %-5level ${springAppName:-} %thread %logger %msg%n"/>

    <!-- 开发 -->
    <!--    <springProfile name="dev">-->
    <!--    </springProfile>-->

    <!--测试环境、生产环境 -->

    <!--输出到控制台-->
    <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${log.colorPattern}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>INFO</level>
        </filter>
    </appender>

    <!--输出全部到总文件，除了DEBUG类型-->
    <appender name="file_all" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/all.%d{yyyy-MM-dd HH}.%i.log.gz</fileNamePattern>
            <maxFileSize>${log.maxFileSize}</maxFileSize>
            <totalSizeCap>${log.totalSizeCap}</totalSizeCap>
            <MaxHistory>${log.maxHistory}</MaxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${log.pattern}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>DEBUG</level>
            <onMatch>DENY</onMatch>
            <onMismatch>ACCEPT</onMismatch>
        </filter>
    </appender>

    <!--输出INFO到特定文件-->
    <appender name="file_info" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/info/info.%d{yyyy-MM-dd HH}.%i.log.gz</fileNamePattern>
            <maxFileSize>${log.maxFileSize}</maxFileSize>
            <totalSizeCap>${log.totalSizeCap}</totalSizeCap>
            <MaxHistory>${log.maxHistory}</MaxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${log.pattern}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>INFO</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!--输出ERROR到特定文件-->
    <appender name="file_error" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/error/error.%d{yyyy-MM-dd HH}.%i.log.gz</fileNamePattern>
            <maxFileSize>${log.maxFileSize}</maxFileSize>
            <totalSizeCap>${log.totalSizeCap}</totalSizeCap>
            <MaxHistory>${log.maxHistory}</MaxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${log.pattern}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!--输出DEBUG到特定文件-->
    <appender name="file_debug" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/debug/debug.%d{yyyy-MM-dd HH}.%i.log.gz</fileNamePattern>
            <maxFileSize>${log.maxFileSize}</maxFileSize>
            <totalSizeCap>${log.totalSizeCap}</totalSizeCap>
            <MaxHistory>${log.maxHistory}</MaxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${log.pattern}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>DEBUG</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <root level="ALL">
        <appender-ref ref="file_debug"/>
    </root>

    <root level="info">
        <appender-ref ref="file_all"/>
        <appender-ref ref="file_info"/>
        <appender-ref ref="file_error"/>
    </root>


</configuration>
~~~

