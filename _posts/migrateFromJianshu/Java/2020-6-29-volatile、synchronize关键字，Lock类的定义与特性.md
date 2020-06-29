---
layout: post
title: volatile、synchronize关键字，Lock类的定义与特性.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - Java
---

# volatile关键字
##### 定义：对该变量禁止使用CPU缓存，而从主内存中读写
##### 特性：
1. 禁止编码优化（禁止指令重排序）
2. 保证变量的线程可见性，即线程B对线程A的操作是可见的，即原则1 *遵循happens-before原则*
3. 不会对线程阻塞，而只是对变量的"读或写"保证原子性，但不对"读并且写"保证原子性。可以理解为有两个锁：读锁和写锁，但不可同时读和写，见increase方法；故此时一写多读时可以保证数据一致。
若要多写多读，synchronize关键字或Lock类
```
    volatile static int inc = 0;

    public static void main(String[] args) {
        Runnable runnable = ()->{
            increase();
        };
        ExecutorService executorService = Executors.newFixedThreadPool(20);
        for (int i = 0; i < 20; i++) {
            executorService.execute(runnable);
        }
        // 等待所有线程结束
        executorService.shutdown();
        System.out.println(inc);
    }

    private static /*synchronized*/ void increase() {
        for (int i = 0; i < 1000; i++) {
            // 如线程A执行至256次内存读到256，线程B已经执行完1000次写入内存1000，此时线程A第257次内存读到1000，继续剩下的743次循环
            inc++; // inc = inc + 1 读inc并且写inc
        }
    }

19418
Process finished with exit code 0
```
### happens-befores原则：
##### 定义：前一个操作的结果对后续操作是可见的
共8条原则
主要为
1. 顺序性
2. volatile原则
3. 传递性
...
见[Java并发编程实战](https://time.geekbang.org/column/article/84017)
[java 8大happen-before原则超全面详解](https://www.jianshu.com/p/1508eedba54d)
# synchronize关键字
##### 定义：Java中互斥锁技术的实现
##### 特性：
1. 可修饰方法，代码块
```
class X {
  // 修饰非静态方法
  synchronized void foo() {
    // 临界区
  }
  // 修饰静态方法
  synchronized static void bar() {
    // 临界区
  }
  // 修饰代码块
  Object obj = new Object()；
  void baz() {
    synchronized(obj) {// lock()
      // 临界区
    //unlock()
    }
  }
}
```
2. 修饰static方法时，实际锁的是该类的.class对象；修饰非static方法时，锁的时该this对象
注意：使用锁synchronized要注意以哪个对象为锁，和要保护的资源(临界区)，在同一个锁下的临界区是保证原子性的
```
class obj {
  synchronized(obj.class) static void foo1(){}
  // obj.class是单例的
  synchronized(this) void foo2(){}
  // this是可以new出多个的
}
```
3. wait()、notify()、notifyAll()只能在sychronized代码块中使用
```
sychronized(this){
  this.wait() // 此处释放的锁一定为this，即锁对象
  // 若锁对象为targer，则为target.wait()
}
```
wait():释放该互斥锁，同时该线程进入等待队列，使其他线程可以抢占该锁 *sleep()使线程阻塞，不会释放锁*
notify(): 随机通知等待队列中的一个线程，条件满足，可以执行wait()之后代码
使用notifyAll():通知队列中所有线程，条件满足
# Lock接口
##### 定义：Lock为concurrent.locks包下的一个接口，该locks包提供对线程锁操作的方法。
##### 特性：
1.常用实现类:
```
        ReentrantLock lock = new ReentrantLock();   // 实现Lock接口
        ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();    // 实现ReadWriteLock,提供读锁或写锁
        readWriteLock.writeLock().lock();  // 读锁
```
2.常用方法：
```
        lock.lock();// 获得锁
        try{
            //处理任务
        }catch(Exception ex){
        }finally{
            lock.unlock();   // 释放锁
        }
        lock.tryLock(); // 尝试获得锁，得到true，得不到false，立即返回
```
# 悲观锁与乐观锁CAS机制
## 悲观锁
定义：总是假设最坏的情况，假设每次取数据后都认为数据会被其他线程修改，需要保证数据的强一致性。如sychronized关键字和ReentrantLock类，都是悲观锁。
## 乐观锁与CAS
定义：假设每次取得数据后，数据不会被其他线程修改。
CAS：全称compareAndSwap，望文生义，即比较与替换。
每次进行对数据写操作时进行一次CAS：
compare：比较工作内存中的值A1，是否与主内存中地址V中的值A2一致；
swap：若A1与A2一致，则修改地址V中的A2为B；若A1与A2不一致，则重新读取地址V中的值，再进行任务处理，称为回旋，该情况可能一直循环直到一致为止。

CAS下带来的ABA问题：
按时间顺序有以下任务：
线程1任务：读地址V，A值修改为B值
线程2任务：读地址V，A值修改为B值
线程3任务：读地址V，B值修改为A值
根据CAS原则，线程1执行后，线程2回旋，线程3执行，最终值为A
若此时线程2阻塞，则只执行1和3，线程2释放，根据CAS原则，执行完1和3后，线程2回旋判定A值一致，修改为B，最终值为B
解决方法：每次写数据时，加入版本号，判断A1与A2一致时，同时判断版本号是否一致
如concurrent包下的Atomic类，为乐观锁。
