/*
combined files : 

gallery/taginput/1.0/index
gallery/taginput/1.0/mini

*/
/**
 * @fileoverview 
 * @author 首作<aloysious.ld@taobao.com>
 * @module taginput
 **/
KISSY.add('gallery/taginput/1.0/index',function (S, Node, Base) {

	'use strict';

    var $ = Node.all;
    
	/**
     * 
     * @class Taginput
     * @constructor
     * @extends Base
     */
    function Taginput(cfg) {
        //调用父类构造函数
        Taginput.superclass.constructor.call(this, cfg);
		this.init();
    }

    S.extend(Taginput, Base, {

		init: function() {
			this.con = $(this.get('container'));
			this.tags = [];
			this.render();
		},

		render: function() {
			this.renderUI();
			this.bindUI();
			this.syncUI();
		},

		renderUI: function() {
			this.con.addClass('taginput');
			this._renderInput();		  
		},

		bindUI: function() {
			if (this.get('editable')) {
				this._bindInputEvents();
				this._bindTagDelete();
			}

			this._bindCustomEvents();
		},

		syncUI: function() {},

		/* -------------------- 私有函数 ------------------------ */
		_renderInput: function() {
			this.inputWrap = $('<div id="J_tagInput_addWrap" class="input-wrap"></div>').appendTo(this.con);
			
			this.con.css({
				width: this.get('width'),
				'min-height': this.get('height'),
				height: '100%'
			});

			// 如果是可编辑，才渲染输入框
			if (this.get('editable')) {
				this.inputNode = $('<input id="J_textInput"'
						+ ' autocomplete="off" type="text" value="" data-placeholder="' 
						+ this.get('placeholder') + '"/>').appendTo(this.inputWrap);

				console.log(this.get('placeholder'));
				this.inputNode.val(this.inputNode.attr('data-placeholder'));
			}

			this.importTags(this.get('defaultTags'));
		},

		_isTagExist: function(tag) {
			return S.inArray(tag, this.tags);		 
		},

		_bindInputEvents: function() {
			this.con.on('click', this._onConClick, this);
			this.inputNode.on('focus', this._onInputFocus, this);
			this.inputNode.on('blur', this._onInputBlur, this);
			this.inputNode.on('keypress', this._onKeyPress, this);
			this.inputNode.on('keydown', this._onKeyDown, this);
		},

		_onConClick: function() {
			this.inputNode.getDOMNode().focus();
		},

		_onInputFocus: function() {
			var node = this.inputNode;
			if (node.attr('data-placeholder') === S.trim(node.val())) {
				node.val('');
			}				   
		},

		_onInputBlur: function() {
			var node = this.inputNode,
				phText = node.attr('data-placeholder'),
				val = S.trim(node.val());

			if (val !== '' &&
					val !== phText &&
					val.length >= this.get('minChar') &&
					val.length <= this.get('maxChar')) {
				//this.addTag(val);
			
			} else {
				node.val(node.attr('data-placeholder'));
			}
		},

		_onKeyPress: function(e) {
			// 如果按下逗号或者enter，添加一个tag
			if (e.keyCode === 13 || e.keyCode === 44) {
				e.halt();
				var val = this.inputNode.val(),
					phText = this.inputNode.attr('data-placeholder');

				if (val !== '' &&
						val !== phText &&
						val.length >= this.get('minChar') &&
						val.length <= this.get('maxChar')) {
					this.addTag(val);
				}
			}			 
			
		},

		_onKeyDown: function(e) {
			// 如果输入为空，并且按下delete键，删除上一个tag
			if (this.get('canDeleteByKey') && e.keyCode === 8 && this.inputNode.val() === '') {
				e.halt();
				var tagName = this.tags[this.tags.length-1];
				this.removeTag(tagName);
			}

			// 如果改变输入
			if(e.keyCode === 8 || String.fromCharCode(e.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,]+/)) {
				this.inputNode.removeClass('not-valid');
			}
		},

		_bindTagDelete: function() {
			this.con.delegate('click', '.delete-btn', this._onClickDelete, this);
		},

		_onClickDelete: function(e) {
			e.halt();
			var tagName = $(e.currentTarget).parent('.tag').attr('data-name');
			this.removeTag(tagName);
		},

		_bindCustomEvents: function() {
			this.on('event:addTag', this._onAddTag, this);				   
			this.on('event:removeTag', this._onRemoveTag, this);				   
		},

		_onAddTag: function(e) {
			var tagAddFn = this.get('onTagAdd');

			this.inputNode.val('');
			this.inputNode.removeClass('not-valid');

			if (tagAddFn && S.isFunction(tagAddFn)) {
				tagAddFn.call(this, e.tag);
			}
		},

		_onRemoveTag: function(e) {
			var tagRemoveFn = this.get('onTagRemove');

			if (tagRemoveFn && S.isFunction(tagRemoveFn)) {
				tagRemoveFn.call(this, e.tag);
			}
		},

		/* ----------------- 公有函数 --------------------- */

		/**
		 * 导入默认显示的tag
		 * @param tags {Array} 标签列表
		 */
		importTags: function(tags) {
			var that = this;
			this.con.all('.tag').remove();
			this.tags = [];
			S.each(tags, function(t) {
				that.addTag(t);
			});
		},

		/**
		 * 添加一个标签
		 * @param tag {string} 标签名
		 */
		addTag: function(tag) {
			tag = S.trim(tag);
			
			var isTagExist = this._isTagExist(tag);

			if (isTagExist) {
				this.inputNode && this.inputNode.addClass('not-valid');
			}

			if (tag === '' || isTagExist) return;

			var tpl = '<span class="tag" data-name="{tag}">'
					+	'<span>{tag}</span>'
					+   '<a class="delete-btn" href="javascript:void(0);" style="display:{display}">x</a>'
					+ '</span>';

			$(S.substitute(tpl, {
				tag: tag,
				display: this.get('editable')? 'inline-block': 'none'
			})).insertBefore(this.inputWrap);
			this.tags.push(tag);
	
			this.fire('event:addTag', {
				tag: tag
			});
		},

		/**
		 * 删除一个标签
		 * @param tag {String} 标签名
		 */
		removeTag: function(tag) {
			tag = S.trim(tag);
			
			var isTagExist = this._isTagExist(tag),
				that = this;

			if (!isTagExist) return;

			S.each(this.con.all('.tag'), function(tagNode) {
				tagNode = $(tagNode);
				if (tagNode.attr('data-name') === tag) {
					tagNode.remove();
					return false;
				}
			});

			S.each(this.tags, function(t, i) {
				if (tag === t) {
					that.tags.splice(i, 1);
					return false;
				}
			});

			this.fire('event:removeTag', {
				tag: tag
			});
		},

		/**
		 * 获取tag输入框包裹器node节点
		 */
		getInputWrap: function() {
			return this.inputWrap;
		}

    }, {
		ATTRS : {
			
			container: {
				value: '#J_tagInput'		   
			},

			// 默认的tag标签
			defaultTags: {
				value: []			 
			},

			// 是否可编辑
			editable: {
				value: true		  
			},

			// 高度
			height: {
				value: '100px'
			},

			// 宽度
			width: {
				value: '300px'	   
			},

			// 无标签时的占位文字
			placeholder: {
				value: '请添加标签'			 
			},

			// 每个标签的最少字符数
			minChar: {
				value: 0		 
			},

			// 每个标签的最多字符数
			maxChar: {
				value: 20		 
			},

			// 添加标签的回调函数
			onTagAdd: {
				value: S.noop		  
			},

			// 删除标签的回调函数
			onTagRemove: {
				value: S.noop			 
			},

			// 是否可以通过delete键回退删除标签
			canDeleteByKey: {
				value: true				
			}
    	}
	});

    return Taginput;

}, {requires:['node', 'base', './index.css']});

/**
 * @fileoverview 
 * @author 首作<aloysious.ld@taobao.com>
 * @module taginput
 **/
KISSY.add('gallery/taginput/1.0/mini',function(S, Component) {

  return Component;

}, {
  requires: ["./index"]
});
