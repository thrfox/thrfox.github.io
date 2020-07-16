---
layout: post
title: 【CoreJava】随笔.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Java
---

##1.break 通过标签可以用来跳出深层次的循环
```    
mark_point:    //紧跟冒号
while(n < 10){    //紧跟循环
  ......
  while(n == 1){
    ......
    break mark_point;
  }
}
```
##2.二维数组[][]
取到第二组可以用嵌套循环
取单个 array[1][5]
可以用来制表
##3.识别类(类的设计)
从问题中找寻名词与动词.
名词:通常代表着类.
动词:通常代表着类的方法.
解决实际问题过程:将一个抽象的问题实体化,现实化.再分析问题中实体与动作.
##4.关于private可变数据域的set和get
```
private Date d
public Date getd{
  return d.clone()  //在这里,Date为可变的,应该实用clone()
}
```
若return d,则该Date并没有经过一个new,即会随着某些因素随时变化.
##5.static修饰符含义
```
private static int nextId = 1;
private int id;  

public void setId(){
  id = nextId;
  nextId++;
}
```
static修饰的变量或函数属于这个类,而不属于类对象.
即这个类有1000个实例,但只有1个nextId,但可能有1000个id
