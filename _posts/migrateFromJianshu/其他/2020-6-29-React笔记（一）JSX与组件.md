---
layout: post
title: React笔记（一）JSX与组件.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 其他
---

###定义一个变量
      const element = <h1>Hello，world.</h1>
该变量既不是string也不是HTML，而是被称作JSX
>JSX is an XML/HTML-like syntax used by React that extends ECMAScript so that XML/HTML-like text can co-exist with JavaScript/React code.
JSX我理解为JS语法混合着XML语法
JSX不是React所必须的，但其可以更简便的使UI设计混合在JS语法中
###在JSX中可以嵌入任意JS语句
```
function add(x,y){
  return x + y;
}
const element = (
  <h1>加法:{add(3,5)}</h1>
);
ReactDOM.render(
  element,
  document.getElementById('root')
);
```
###组件与props
props可以理解为一个object
```
function Welcome(prop){  //称为组件
  return <h1>Hello,{prop.name}</h1>;
};

const element = <Welcome name='Sara' />;  //此处相当于给Welcome传入String:Sara，组件中用name接到

ReactDOM.render(
  element,
  document.getElementById('root')
);
```
在以上代码中，分为四步
  1.ReactDOM.render渲染element
  2.element中发现Welcome作为组件并且带有props对象，该对象可以携带多个参数如String,Date,object等，如该例携带了JSON {name: 'Sara'}
  3.Welcome组件返回结果<h1>Hello, Sara</h1>
  4.ReactDOM可以根据'Welcome'的DOM内容即时渲染最新结果
> 注意：
  时刻注意组件名称首字母大写，有一下原因：
  1.React识别首字母小写的为DOM标签，如<div />。
  2.首字母大写则视为组件，如<Welcome />。
###在一个复杂的App中提取部分作为组件
######以下为需渲染的app
```
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```
######提取关键部分为组件后
```
function formatDate(date) {
  return date.toLocaleDateString();
}

function Avatar(props) {
  return (
    <img
      className="Avatar"
      src={props.user.avatarUrl}  //此处的props.user为UserInfo传入的user参数，即不用关心Comment最顶层传入的是author
      alt={props.user.name}
    />
  );
}

function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} //此处的props.user即Comment中的props.author;同时再封装成user参数传入至Avatar
        />  
      <div className="UserInfo-name">{props.user.name}</div>
    </div>
  );
}

function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">{props.text}</div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

const comment = {
  date: new Date(),
  text: 'I hope you enjoy learning React!',
  author: {
    name: 'Hello Kitty',
    avatarUrl: 'http://placekitten.com/g/64/64',
  },
};
ReactDOM.render(
  <Comment
    //此处的Comment即传入一个带参数的【组件】并进行渲染
    date={comment.date} //传入comment对象下的date对象
    text={comment.text}
    author={comment.author}//传入comment对象下的author对象
  />,
  document.getElementById('root')
);
```
>注意：在React中，
所有的组件中的props都应该为只读的(read-only)
即props对象不应该被组件中的代码所修改，比较以下两个代码

```
function sum(a, b) {
  return a + b;
}
```
____
```
function withdraw(account, amount) {
  account.total -= amount;
}
```
____
