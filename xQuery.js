;
(function(){
	"use strict";
	var xQuery = function(selector, context){
		return new xQuery.prototype.init(selector, context);
	}

	xQuery.fn = xQuery.prototype = {
		constructor : xQuery,
		length : 0, // 长度
		/*
		 * 初始化
		 * @param selector 选择器
		 * @return 
		 */
		init : function(selector, context){
			// 如果有查询上下文，则使用 xQuery 对象的第一个DOM元素
			if (context)
				context = context[0];
			else
				context = document;

			if (typeof selector === "string") {
				// 根据选择器查找所有元素节点列表
				var nodeList = context.querySelectorAll(selector);
				// 遍历所有元素，将每个元素包装到当前对象的属性中
				for (var i = 0, len = nodeList.length; i < len; i++) {
					this[i] = nodeList[i];
				}
				// 设置当前对象的 length
				this.length = len;
			} else if(typeof selector === "object") {
				this[0] = selector;
				this.length = 1;
			}
		},
		/*
		 * 获取/设置CSS样式
		 * @param attrName 属性名
		 * @param attrValue 属性值
		 */
		css : function(attrName, attrValue){
			if (this.length <= 0) // 当前xQuery对象中没有包装的DOM元素
				return this;

			// 获取
			if (typeof attrName === "string" && typeof attrValue === "undefined") {
				return getComputedStyle(this[0])[attrName];
			} 

			// 设置
			if (typeof attrName === "object") { // 将对象传递的数据作为CSS属性设置
				for (var prop in attrName) {
					for (var i = 0, len = this.length; i < len; i++) {
						this[i].style[prop] = attrName[prop];
					}
				}
			} else {
				for (var i = 0, len = this.length; i < len; i++) {
					this[i].style[attrName] = attrValue;
				}
			}
			return this;
		},
		/*
		 * 运动方法
		 * @param options
		 * @param speed
		 * @param fn
		 */
		animate : function(options, speed, fn){
			for (var i = 0, len = this.length; i < len; i++) {
				// 当前 xQuery 对象中遍历到的DOM对象
				let element = this[i];

				// 停止元素上已有运动动画效果
				clearInterval(element.timer);
				// 定义对象，保存各运动属性初值、运动区间范围
				// 对象属性名与 options 一致
				var start = {}, range = {};
				for ( var attr in options ) { // 遍历options每个属性
					start[attr] = parseFloat(xQuery(element).css(attr));
					range[attr] = options[attr] - start[attr];
				}
				// 记录运动起始时间
				var startTime = new Date();
				// 启动计时器
				element.timer = setInterval(function(){
					// 计算运动消耗时间
					var elapsed = Math.min(new Date() - startTime, speed);
					// 遍历每个属性，设置当前值
					for (var attr in options) {
						// 计算各属性当前值
						var result = elapsed * range[attr] / speed + start[attr];						
						// 设置当前值
						element.style[attr] = result + (attr === "opacity" ? "" : "px");						
					}
					// 判断是否停止计时器
					if (elapsed === speed){
						// 运动动画结束
						clearInterval(element.timer);
						// 如果有运动结束后执行的函数，则调用
						fn && fn();
					}
				}, 1000/60);
			}
			return this;
		},
		fadeIn : function(speed, fn){
			for (var i = 0, len = this.length; i < len; i++) {
				let element = this[i];
				element.style.opacity = 0;
				$(element).show();
				$(element).animate({opacity:1}, speed, fn);
			}			
		},
		fadeOut : function(speed, fn){
			console.log("淡出")
			for (var i = 0, len = this.length; i < len; i++) {
				let element = this[i];
				$(element).animate({opacity:0}, speed, function(){
					$(element).hide();
					fn && fn();
				});
			}	
		},
		/*
		 * 注册事件监听
		 */
		on : function(type, callback){
			for (var i = 0, len = this.length; i < len; i++) {
				var element = this[i];
				if (element.addEventListener) { // 支持使用 addEventListener 方法
					if (type.indexOf("on") === 0) // 以 on 开头，则去掉 on 前缀
						type = type.slice(2);
					
					element.addEventListener(type, callback);
				} else { // 支持使用 addEventListener 方法
					if (type.indexOf("on") !== 0) // 不以 on 开头，添加 on 前缀
						type = "on" + type;
					
					element.attachEvent(type, callback);
				}
			}

			return this;
		},
		extend : function(obj){
			for (var attr in obj) {
				xQuery.prototype[attr] = obj[attr];
			}
		},
		// 相当于 dom 对象的 innerHTML 属性
		html : function(val){
			if (this.length <= 0) // 当前xQuery对象中没有包装的DOM元素
				return this;

			// 获取第一个元素的 innerHTML 属性值
			if (!val) {
				return this[0].innerHTML;
			}

			// 设置
			for (var i = 0, len = this.length; i < len; i++) {
				this[i].innerHTML = val;
			}
			return this;
		},
		// 添加类名，为 DOM 元素添加类名
		addClass : function(className){
			for (var i = 0, len = this.length; i < len; i++) {
				// 获取当前元素所有类名
				var classNames = this[i].className.split(" ");
				// 当前添加类名是否已存在
				if (xQuery.inArray(className, classNames) === -1)
					classNames.push(className);
				// 重新设置当前元素的类名
				this[i].className = classNames.join(" ");
			}
			return this;
		},
		// 删除类名，为 DOM 元素移除类名
		removeClass : function(className){
			for (var i = 0, len = this.length; i < len; i++) {
				// 获取当前元素所有类名
				var classNames = this[i].className.split(" ");
				// 当前添加类名是否已存在
				var index = xQuery.inArray(className, classNames);
				if (index !== -1)
					classNames.splice(index, 1);
				// 重新设置当前元素的类名
				this[i].className = classNames.join(" ");
			}
			return this;
		},
		show : function(){
			for (var i = 0, len = this.length; i < len; i++) {
				this[i].style.display = "block";
			}
			return this;
		},
		hide : function(){
			for (var i = 0, len = this.length; i < len; i++) {
				this[i].style.display = "none";
			}
			return this;
		}
	}

	// 直接在 xQuery 函数对象下挂载方法
	xQuery.inArray = function(value, array){
		return array.indexOf(value);
	}

	xQuery.extend = function(obj){
		for (var attr in obj) {
			xQuery[attr] = obj[attr];
		}
	}

	// 修改 xQuery.prototype.init 的 prototype 指向，以保证 xQuery 的对象调用到如css之类的方法
	xQuery.prototype.init.prototype = xQuery.prototype;

	window.$ = window.xQuery = xQuery;
}());