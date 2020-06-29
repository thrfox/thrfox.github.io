---
layout: post
title: SQL-Server存储过程学习笔记.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 其他
---

## 什么是SQL Server存储过程
> 是一种完成特定功能的SQL语句的集合，可视为批处理文件。类似于Java中的方法，可以有参数输入值，输出值，和输入输出值。
## SQL Server存储过程的优缺点
##### 优点
1. 降低网络流量，存储过程代码直接存储于数据库中，在客户端与服务器的通信过程中，不会产生大量的T_SQL代码流量。
2. 加快系统运行速度，存储过程只在创建时编译，以后每次执行时不需要重新编译。
3. 可以多次调用。
##### 缺点
1. 无法移植到其他数据库中。
2. 代码可读性差，不易维护。
## 分类
##### 分为系统存储过程，与自定义存储过程，和扩展存储过程。
1. 系统存储过程以'sp_'开头，是系统创建的存储过程，目的在于能够方便的从系统表中查询信息或完成与更新数据库表相关的管理任务或其他的系统管理任务。
2. 扩展存储过程是以在SQL SERVER环境外执行的动态连接(DLL文件)来实现的，可以加载到SQL SERVER实例运行的地址空间中执行，扩展存储过程可以用SQL SERVER扩展存储过程API编程，扩展存储过程以前缀"xp_"来标识，对于用户来说，扩展存储过程和普通话存储过程一样，可以用相同的方法来执行。 
## 基本语法
##### 创建，定义变量，使用输入、输出参数
```sql
create proc|procedure proc_name(
    --变量用@符号标识
    @id int=100,    --输入参数 有默认值
    @name varchar2(50) out,    --输出参数
    @school varchar2(50)='东软%' output;    --输入输出参数  默认值可以使用通配符
)
as    --该存储过程所要执行的内容
    select * from student;
go    --类似于结束符
--执行带该返回值的存储过程
--1.定义变量
declare @stu_name int,    --declare定义变量用来接收输出参数
        @stu_school varchar2(50);    --可以写在一个关键字里 注意,与;的使用
set @stu_school='清华'  --给定义的变量赋值
--2.执行存储过程
exec proc_name 99,@stu_name out,@stu_school output;    --方式一按顺序输入参数
--exec proc_name @school=@stu_school output,@id=99;    --方式二不按位置输出参数
--3.查询输出值
select @stu_name,@stu_school
```
#####创建带游标的存储过程
```
水平有限，过后补上
```

##引用
[参考1](http://www.cnblogs.com/selene/p/4483612.html)
[参考2](http://www.cnblogs.com/hoojo/archive/2011/07/19/2110862.html)
[参考3](http://www.cnblogs.com/chaoa/articles/3894311.html)
