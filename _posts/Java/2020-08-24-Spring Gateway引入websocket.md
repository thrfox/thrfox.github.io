---
layout: post
title: Spring Gateway引入websocket
subtitle: Spring Gateway引入websocket
author: "thrfox"
header-style: text
category: Java
tags:
  - Java
  - Spring
---

### 版本
- spring boot starter 2.2.1-release

### 引入websocket，并设置endpoint，并允许跨域
[设置websocket的CORS](https://stackoverflow.com/questions/54497267/spring-websocket-message-broker-adding-extra-access-control-allow-origin-header)
[doc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/socket/config/annotation/SockJsServiceRegistration.html#setSupressCors-boolean-)
~~~java
@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfiguration implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/sockJs")
                .setAllowedOrigins("*")
                .addInterceptors(httpSessionHandshakeInterceptor())
                .withSockJS()
                // 如果在这里设置了跨域并且带上了cors的header，gateway会返回两个Access-Control-Allow-Origin，所以要关闭掉
                .setSupressCors(true);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // topic前缀 全体广播, queue前缀 用户点对点
        registry.enableSimpleBroker("/topic", "/queue");
    }


    @Bean
    public HttpSessionHandshakeInterceptor httpSessionHandshakeInterceptor() {
        // ws升级为http前缀
        return new HttpSessionHandshakeInterceptor();
    }

}
~~~

### gateway配置文件设置跨域
~~~yml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods: "*"
            allowedHeaders: "*"
            allowCredentials: true
~~~
以下要解决一下冲突，
如果在项目里单独设置了有关的 Access-Control-Allow-Origin 等response的filter，需要解决，避免重复加上 Access-Control-Allow-Origin等header
~~~java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class WebFluxSecurityCorsFilter implements WebFilter {

    @Override
    @SuppressWarnings("all")
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        // nacos 配置文件配置了跨域，这里就不要重复配置了
        // @link https://cloud.spring.io/spring-cloud-static/Greenwich.SR1/single/spring-cloud.html#_cors_configuration
        // 这里如果request有cors，会在response加上跨域 *，但spring配置的Allow-Origin 是request的origin而不是*，此时response会带上两个Allow-Origin导致请求报错
//        if (CorsUtils.isCorsRequest(request)) {
//            ServerHttpResponse response = exchange.getResponse();
//            HttpHeaders headers = response.getHeaders();
//            headers.add("Access-Control-Allow-Origin", "*");
//            headers.add("Access-Control-Allow-Methods", "*");
//            headers.add("Access-Control-Max-Age", "3600");
//            headers.add("Access-Control-Allow-Headers", "*");
//            if (request.getMethod() == HttpMethod.OPTIONS) {
//                response.setStatusCode(HttpStatus.OK);
//                return Mono.empty();
//            }
//        }
        return chain.filter(exchange);
    }

}
~~~

### gateway转发
~~~yml
spring:
  cloud:
    gateway:
      routers:
        - id: <配置的id>
          uri: lb://<服务名>
          predicates:
            # 如果在上面那步配置了HttpSessionHandshakeInterceptor，就不需要单独设置ws的转发
            - Path=/<前缀>/**
~~~
