---
layout: post
title: 【Spring】测试
subtitle: 【Spring】测试
author: "thrfox"
header-style: text
category: Java
tags:
  - Java
  - Spring
  - TDD
---

### 使用junit4 测试
pom.xml 依赖
~~~xml
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
~~~

~~~java
@RunWith(SpringRunner.class) // 引入spring运行环境的context
@SpringBootTest
public class StorageBuildTest {
    
    // 设置配置文件属性
    @BeforeClass
    public static void setSystemProperty() {
        Properties properties = System.getProperties();
        properties.setProperty("property.type", "4");
    }
}
~~~