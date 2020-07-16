---
layout: post
title: 一-Java-并发（concurrency）与多线程（multithreading）教程前言.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Java-并发与多线程教程(Java-Concurrency
---

原文：[Java Concurrency and Multithreading Tutorial](http://tutorials.jenkov.com/java-concurrency/index.html)
原文 Last update: 2018-09-27

对Java平台而言，Java并发是一个涵盖了多线程、并发和并行的术语。它包括Java并行工具，开发中的常见问题与解决方法。该Java并行教程包括：
1.多线程的核心概念
2.并发的结构
3.并发的常见问题
4.多线程的优点与多线程的花费
# 并发的简要历史
回顾计算机只有单个CPU的时代，计算机一次只能执行单个程序。后来出现了多任务处理，意味着在同一时间可以执行多个程序（AKA任务或处理 *注：AKA暂找不到释义）。尽管它并不是真正意义上的同时，而是单个cpu被多个程序同时占有。即操作系统会在两个程序之间切换执行，每次切换后对该程序执行一小段时间。

多任务处理的出现对软件开发者来说是一项新挑战。程序不能占有CPU的所有可用的处理时间，和所有的内存与其他计算机资源。一个优秀的程序应该释放长时间不再使用的资源，以便让出资源让其他程序使用。

再后来出现了多线程，意味着你可以将多个线程执行于同一个程序。执行线程可以被认为是执行程序的CPU，当你多线程执行同一个程序时，它就像多个CPU同时执行一个程序。

多线程是一种很好的提高程序性能的方式。然而，多线程比多任务处理更具挑战性。多线程执行同个程序的时候也会同时读写内存，这可能导致在单线程程序中无法发现错误。有一些错误在单CPU的机器上无法发现，因为两个线程从未真正"同时"执行。现代计算机通常带有多核CPU甚至多个CPU，这意味着每个核心或CPU可以同时执行多个线程。
![image.png](https://upload-images.jianshu.io/upload_images/8222680-97a7ceaa9dd30d15.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果一个线程读取一个内存地址的时候，另一个线程尝试对该地址进行写入，哪一个值是第一个线程最后读取出来的呢？旧的值或是被第二个线程改写的值？或者是混合了它们俩的一个值？
或者如果两个线程同时写入同一个内存地址，当它们都写入完成时该值是哪一个呢？被第一个线程改写的值还是被第二个线程改写的值？或者是混合值？

没有对这种情形做一定的处理，任何这些结果都是可能的，这些同时进行的操作甚至不能预测。所以结果可能会不时发生变化。因此开发者必须要知道如何对这些情形进行正确的处理-意味着必须学会如何让线程访问会被共享的资源，如内存、文件、数据库等等。这是Java并发教程的一个话题。

# Java的多线程和并发
Java是第一批使开发人员可以轻松使用多线程的语言之一。Java从一开始就具有多线程功能。因此，Java开发者经常会遇到上述问题。这就是我写Java并发这篇文章的原因。作为自己和任何可能从中受益的Java开发者的笔记。
该主要内容将主要关注Java中的多线程，但是多线程中通常会出现一些额外问题，如多任务处理和分布式系统中出现的问题。因此也可用于该种问题的参考。因此使用了（concurrency）并发一次而不是多线程（multithreading）

# 在2015年之后的Java并发
自从编写了第一本Java并发书以来，甚至自Java 5并发工具(java.util.concurrent)发布以来，在并发体系结构和设计领域发生了很多事情。

如，出现了异步处理的“无共享(shared-nothing)”框架和API如Vert.x和Play / Akka和Qbit。这些框架使用了与使用线程，共享内存和锁Java / JEE并发模型不同的并发模型。新的工具包中发布了新的非阻塞并发算法和非阻塞工具如LMax Disrupter，Java7中引入了并行的函数式编程的ForkAndJoin架构，和Java8中的处理集合的stream API （ the collection streams API）。

随着所有这些新的开发，我现在是时候更新这个Java Concurrency教程了。因此，本教程再次进行更新。只要有时间，就会发布新的教程。

# Java并发学习概览
如果您不熟悉Java并发，我建议您遵循以下学习计划。您也可以在本页左侧的菜单中找到指向所有主题的链接。
（*注：此为原文跳转，翻译完成后会补全翻译后跳转）
## 并行与多线程概论
*   [Multithreading Benefits](http://tutorials.jenkov.com/java-concurrency/benefits.html)
*   [Multithreading Costs](http://tutorials.jenkov.com/java-concurrency/costs.html)
*   [Concurrency Models](http://tutorials.jenkov.com/java-concurrency/concurrency-models.html)
*   [Same-threading](http://tutorials.jenkov.com/java-concurrency/same-threading.html)
*   [Concurrency vs. Parallelism](http://tutorials.jenkov.com/java-concurrency/concurrency-vs-parallelism.html)
## Java并发基础
*   [Creating and Starting Java Threads](http://tutorials.jenkov.com/java-concurrency/creating-and-starting-threads.html)
*   [Race Conditions and Critical Sections](http://tutorials.jenkov.com/java-concurrency/race-conditions-and-critical-sections.html)
*   [Thread Safety and Shared Resources](http://tutorials.jenkov.com/java-concurrency/thread-safety.html)
*   [Thread Safety and Immutability](http://tutorials.jenkov.com/java-concurrency/thread-safety-and-immutability.html)
*   [Java Memory Model](http://tutorials.jenkov.com/java-concurrency/java-memory-model.html)
*   [Java Synchronized Blocks](http://tutorials.jenkov.com/java-concurrency/synchronized.html)
*   [Java Volatile Keyword](http://tutorials.jenkov.com/java-concurrency/volatile.html)
*   [Java ThreadLocal](http://tutorials.jenkov.com/java-concurrency/threadlocal.html)
*   [Java Thread Signaling](http://tutorials.jenkov.com/java-concurrency/thread-signaling.html)
## Java并发典型问题
*   [Deadlock](http://tutorials.jenkov.com/java-concurrency/deadlock.html)
*   [Deadlock Prevention](http://tutorials.jenkov.com/java-concurrency/deadlock-prevention.html)
*   [Starvation and Fairness](http://tutorials.jenkov.com/java-concurrency/starvation-and-fairness.html)
*   [Nested Monitor Lockout](http://tutorials.jenkov.com/java-concurrency/nested-monitor-lockout.html)
*   [Slipped Conditions](http://tutorials.jenkov.com/java-concurrency/slipped-conditions.html)
## Java并发的构造原理有助于解决上述问题
*   [Locks in Java](http://tutorials.jenkov.com/java-concurrency/locks.html)
*   [Read / Write Locks in Java](http://tutorials.jenkov.com/java-concurrency/read-write-locks.html)
*   [Reentrance Lockout](http://tutorials.jenkov.com/java-concurrency/reentrance-lockout.html)
*   [Semaphores](http://tutorials.jenkov.com/java-concurrency/semaphores.html)
*   [Blocking Queues](http://tutorials.jenkov.com/java-concurrency/blocking-queues.html)
*   [Thread Pools](http://tutorials.jenkov.com/java-concurrency/thread-pools.html)
*   [Compare and Swap](http://tutorials.jenkov.com/java-concurrency/compare-and-swap.html)
## 学习更多：
*   [Anatomy of a Synchronizer](http://tutorials.jenkov.com/java-concurrency/anatomy-of-a-synchronizer.html)
*   [Non-blocking Algorithms](http://tutorials.jenkov.com/java-concurrency/non-blocking-algorithms.html)
*   [Amdahl's Law](http://tutorials.jenkov.com/java-concurrency/amdahls-law.html)
*   [References](http://tutorials.jenkov.com/java-concurrency/references.html)

