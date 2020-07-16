---
layout: post
title: SpringMVC视频初级教程笔记.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Java
---

# SpringMVC流程与图
1.客户发送request至前端控制器DispatcherServlet
2.DispatcherServlet请求HandlerMapping查找Handler  (xml配置或注解查找)
3.HandlerMapping返回Handler
4.DispatcherServlet调用处理器适配器(HandlerAdapter)执行Handler
5.HandlerAdapter执行Handler
6.Handler执行结束返回给HandlerAdapter  ModelAndView（底层对象）
7.处理器适配器向前端控制器返回ModelAndView
8.前端控制器请求视图解析器进行视图解析，解析成jsp
9.视图解析器向前端控制器返回View
10.前端控制器进行视图渲染（将ModelAndView数据填充到request）
11.前端控制器向用户相应response

组件
1.DispatcherServlet 接收请求，响应结果，相当于转发器，中央处理器。
减少 了其他组件之间的耦合度。

### 配置前端控制器
在web.xml中配置前端控制器
```
<servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>com.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/config/spring-mvc/*.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <!--mapping中的name与servlet中的name相同，此mapping才属于该servlet-->
        <url-pattern>*.action</url-pattern>
        <!--第一种:*.action    ,访问以.action结尾由DispatcherServlet进行解析
            第二种:/   ,所有访问的地址都由DispatcherServlet进行解析,对于静态文件的解析需要配置不让DispatcherServlet进行解析(JSP),
            使用此种风格实现RESTful风格的url
            第三种:/*  ,不对,使用这种配置,最终转发到一个jsp时,仍然会由DispatcherServlet解析jsp地址,不能根据jsp页面找到handler,会报错
        -->
    </servlet-mapping>
```
contextConfigLocation配置spring加载的配置文件（配置处理器映射器，适配器等）
###在classpath下的springmvc.xml中配置处理器映射器
###在classpath下的springmvc.xml中配置处理器适配器
###在classpath下的springmvc.xml中配置视图解析器
```
<!--处理器适配器-->
    <!--所有处理器适配器都实现HandlerAdapter接口-->
    <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>
    <!--该适配器能执行实现Controller接口的handler-->
    <!--实现Controller,返回ModelAndView-->

    <!--另一个处理器适配器-->
    <bean class="org.springframework.web.servlet.mvc.HttpRequestHandlerAdapter"/>


    <!--视图解析器-->
    <!--解析jsp视图,默认使用jstl标签,classpath得有jstl的包-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"/>
```
若不配置,则前端控制器默认从DispatcherServlet.properties中加载默认配置
上述配置为3.1之前过期的配置
3.2之后配置为
![image.png](https://upload-images.jianshu.io/upload_images/8222680-12a3aae4e6dae08d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<mvc:annotation-driven></mvc:annotation-driven>该元素可以代替上边映射器和适配器的配置

### 使用注解时,映射器与适配器同时使用
@Controller为适配器
@RequestMapping为映射器

对于注解的Handler,可以单个配置,也可以使用组件扫描,
可以扫描controller\service.....
<context:component-scan base-package="com.study.springmvc"></context:component-scan>

### 前端控制器源码简单分析
1.前端控制器接收请求调用doDispatch()
2.前端控制器根据映射器查找handler
3.调用适配器执行handler,返回ModelAndView
4.视图解析,得到view;
将model数据填充到request 

### 视图解析器中可以配置前缀和后缀
```
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!--视图解析器中配置前缀-->
        <property name="prefix" value="WEB-INF/jsp"/>
        <!--视图解析器中配置后缀-->
        <property name="suffix" value=".jsp"/>
    </bean>
```

### 整合mybatis
![image.png](https://upload-images.jianshu.io/upload_images/8222680-cf99229335bf1115.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1.整合dao层
mybatis和spring整合,通过spring管理mapper接口.
使用mapper的扫描器自动扫描mapper接口在Spring中进行注册
    整合文件applicationContext-dao.xml
    配置:数据源/sqlSessionFactory/扫描器
    ![image.png](https://upload-images.jianshu.io/upload_images/8222680-fa344c90656a14f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  
![image.png](https://upload-images.jianshu.io/upload_images/8222680-8dc1af9d37da9cc8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/8222680-8b147d7ce1376890.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



2.整合service层
  通过Spring管理service接口.
  使用配置方式将service接口配置在spring配置文件中
  整合文件applicationContext-service.xml
![image.png](https://upload-images.jianshu.io/upload_images/8222680-c10ae67e4975874b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  实现事务控制.
  整合文件applicationContext-transaction.xml
![image.png](https://upload-images.jianshu.io/upload_images/8222680-67e6ac828940b999.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3.整合SpringMVC
  SpringMVC是Spring的模块,不需要整合
  
在web.xml中加载spring容器


### RESTful
http访问的是资源,该资源可以被人或是软件访问,
1.对url进行规范,写RESTful的url
  非REST的url : http://..../query?id=001&type=t01
  REST的url  :  http://..../items/001/t01
2.对http的方法规范
  不论是删除,添加,更新.使用的url是一致的,如果进行删除,需要设置http的方法为delete,添加同理
  后台controller方法:判断http方法(ContentType),DELETE执行删除,POST执行添加
3.对http的contentType规范
  请求时,指定contentType,要json数据,设置成json格式的type

使用URL模板映射,实现RESTful风格的URL
@RequestMapping(value="query/{id}")
@pathVariable("id") int id
![image.png](https://upload-images.jianshu.io/upload_images/8222680-c5a4c00b371b9e7f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

注意:使用RESTful需要将前端控制器设置为<url-pattern>/</url-pattern>
并且静态资源需要在springmvc.xml中配置<mvc:resouces location="/js/" mapping="/js/**">

### 拦截器
定义拦截器,实现  HandleInterceptor接口,实现三个接口
1.preHandle()
  进入Handler方法之前执行
  场景:
    1.身份认证,身份授权
        如身份认证失败,需要此方法拦截不再向下执行
2.postHandle()
  进入Handle方法之后,在返回ModelAndView之前执行
  场景: 从ModelAndView出发:  
    1.将公用的模型数据传到视图(如菜单导航)
    2.统一指定视图
3.afterCompletion()
  执行Handler完成,执行此方法
  场景:
    1.统一的异常处理
    2.统一的日志处理
#### 拦截器配置
###### 一.spring拦截器针对HandleMapping进行拦截设置.
    即:配置某个HandlerMapping,经过该HandleMapping映射成功的Handle才使用该拦截器.
![image.png](https://upload-images.jianshu.io/upload_images/8222680-e5892ccbe080083a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 二.springmvc配置类似全局的拦截器:  
  即:springmvc框架将配置的类似全局拦截器注入到每个HandleMapping中
![image.png](https://upload-images.jianshu.io/upload_images/8222680-ded9fbf520da60af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

