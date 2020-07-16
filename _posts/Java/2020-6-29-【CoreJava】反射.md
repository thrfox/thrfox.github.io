---
layout: post
title: 【CoreJava】反射.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Java
---

#反射基本介绍
Class 也是一个类.
#获取类的方法
1. getClass() 获取类的实例
2. 实例.getName() 获取类的名字
3. (static) Class.forName("java.util.Date") 通过类名加载Class对象
#Class对象理解为一个类型,但这个类型未必是一种类.
如int类型,但不是类.
e.getClass().newInstance() 创建类的实例  
`Object obj = Class.forName(className).newInstance`

#使用反射检查类的结构
Field 域 变量
Method 方法
Constructor 构造器
Modifier 参数
(int) getModifuers() 获得该FMC的修饰符 
getType() 获得该Field的类型
getReturnType() 获得Method的返回类型
getName() 取得FMC的名字
(Class) getParameterType()  取得参数类型

Modifier.toString(int) 可以将getModifuers()返回的int转为str
(boolean)Modifier.ispublic(int modifiers) 将该int检测...
