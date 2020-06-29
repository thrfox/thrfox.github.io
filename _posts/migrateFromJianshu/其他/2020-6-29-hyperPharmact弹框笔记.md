---
layout: post
title: hyperPharmact弹框笔记.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 其他
---

# 获取所选文字
```
document.selection	//bool
document.selection.createRange().tex	//String
window.getSelection()	//String
```

# 判断是否有某字符(回车，空格，制表符等)
      new String(TEXT).indexOf('\n') != -1

# 绑定事件
```
bind('click|mouseup',FUNCTION)
unbind()
```
hyperMouseUp先unbind('mouseup',hyperMouseUp)  原因：选择文字后若不unbind事件会重复弹出
后bind('mouseup',closeHyperPharmacyIconForBodyMouseDown)  //点进弹窗范围外后关闭弹窗


```关闭弹窗
function closeHyperPharmacyIconForBodyMouseDown(e){
	if (!($(e.target).parents(".hyper-pharmacy-icon").length>0)) {
		closeHyperPharmacyIcon();
		$('body').unbind('mouseup', hyperMouseUp);  //弹窗后解绑弹窗有关事件
		$('body').unbind('mouseup', closeHyperPharmacyIconForBodyMouseDown);
		$('body').unbind('mouseup', closeHyperPharmacy);
		$('body').bind('mouseup', hyperMouseUp);  //关闭后重新绑定为下次调用
	}
}
```
e.target  获得event目标节点元素
parents()遍历祖先级的元素
.length!>0没有获取到该class内元素时执行

# Ajax下使用a标签
      <a href="javascript:;" onclick="hyperPharmacy(0);"><i class="fa fa-search"></i>查询</a>  
href="javascript:;" a标签的href使用该伪函数可以避免页面刷新，即不作任何操作；区别于刷新页面的href="#"。常用于ajax

# JS实现Tab按钮切换
```
function bindHyperItemsEvent(){
	$('.hyper-items a').click(function(){
		$('.hyper-items a').removeClass('active'); 
		$(this).addClass('active');
		$('.hyper-item').hide();  //**隐藏所有tab页内容
		var id = $(this).attr('item_id');
		$('.hyper-container #item_'+id).show();//通过id显示该tab页
	});
}
```

# 搜索时，搜索内容为空格、制表符等时的处理
```
//		获取查询内容
		var content = $.trim($('#hyper_pharmacy_content').val());
//		如果无内容则提示错误并返回
		if(content==''){
			alert('请输入需要查询的药品信息。');
			return;
		}
```

# JS避免str为null进行替换
```
function hyperFixNullString(str, _default){
	_default = !_default?' ':_default;  //避免参数_defalut为false，若为则空串
	return str==null?_default:str;       //若str为空则为设置的_defalut
}
```
