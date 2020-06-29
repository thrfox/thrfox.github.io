---
layout: post
title: HandlerInterceptor-和-Filter.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Java
---

首先,一张图可以清晰的表示之间的关系
![image.png](https://upload-images.jianshu.io/upload_images/8222680-ba7afe9d648ace34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
Filter的运行是依赖于Servlet容器的,与spring框架没有关系,init与destory只在servletContext阶段执行
而HandlerInterceptor是基于于WebApplicationContext,在WebApplicationContext内的controller可以多次调用
![image.png](https://upload-images.jianshu.io/upload_images/8222680-e5fd327222def6c0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
即ServletContext大于WebApplicationContext
```
public interface Filter {
    public void init(FilterConfig filterConfig) throws ServletException;
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException;
    public void destroy();
}
```
```
public interface HandlerInterceptor {
	boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
	    throws Exception;
	void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
			throws Exception;
	void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception;

}
```

