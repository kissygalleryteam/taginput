## 综述

Taginput是一个快速输入和管理标签的组件，满足各个业务的打标需求。

![](http://gtms02.alicdn.com/tps/i2/T1imbkFLxXXXbK9Akw-642-284.png_300x300.jpg)

* 版本：1.0
* 作者：首作
* demo：[http://gallery.kissyui.com/taginput/1.0/demo/index.html?ks-debug](http://gallery.kissyui.com/taginput/1.0/demo/index.html?ks-debug)

## 快速使用
		
    KISSY.use('gallery/taginput/1.0/index', function (S, Taginput) {
         var taginput = new Taginput({
         	
         	// 在此添加属性配置项
         	
         });
    })
	
	

## API说明

### 属性
* **container**，组件的容器节点id或类名，Selector，默认为"#J_tagInput"
* **defaultTags**，默认显示的tag标签列表，Array，默认为[]
* **editable**，标签是否可编辑（添加或删除），Boolean，默认为true
* **height**，组件高度，String，默认为"100px"
* **width**，组件宽度，String，默认为"300px"
* **placeholder**，标签输入框的提示语，默认为"请添加标签"
* **minChar**，每个标签的最少字符数，默认为0
* **maxChar**，每个标签的最多字符数，默认为20
* **canDeleteByKey**，是否可通过delete键快速删除标签，默认为true
* **onTagAdd**，添加标签后的回调函数，默认为S.noop
* **onTagRemove**，删除标签后的回调函数，默认为S.noop

### 方法
* **importTags(tags)**，导入默认显示的标签列表，tags(Array)为标签列表
* **addTag(tag)**，添加一个标签，tag(String)为需要添加的标签名
* **removeTag(tag)**，添加一个标签，tag(String)为需要删除的标签名

### 更多说明
* 组件可进行输入字符数和去重的简单校验，校验不通过时无法输入标签
* 输入标签时键入逗号或回车可快速插入一个标签
* 输入delete可快速删除一个标签


