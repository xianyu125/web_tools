// 作用：查找指定的值在数组中第一次出现的索引
// 参数：
//		value : 待查找的值
//		array : 数组
// 返回值：
//		如果找到在数组中存在，则返回第一次出现的索引（大于等于0）
// 		如果数组中不存在，则返回-1
function inArray(value, array) {
	if (Array.prototype.indexOf) // 支持ES5数组的indexOf()方法
		return array.indexOf(value);

	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] === value)
			return i;
	}
	return -1;
}

// 作用：生成验证码
// 参数：
//		len : 可选参数，表示验证码长度，默认长度为4
// 返回值：
//		返回生成后的验证码字符串
function generateValidateCode(len) {
	/*if (typeof len === "undefined")
		len = 4;*/
	len = len || 4;
	var validateCode = ""; // 存放验证码字符串的变量
	while(validateCode.length < len) {
		// 产生 48 ~ 122 之间的随机数
		var rand = Math.floor(Math.random() * 75) + 48;
		// 判断是否在合理范围
		if (rand >= 48 && rand <= 57 // 数字
			|| rand >= 65 && rand <= 90 // 大写字母
			|| rand >= 97 && rand <= 122 ) { // 小写字母
			validateCode += String.fromCharCode(rand);
		}
	}

	return validateCode;
}

// 格式化日期时间
// 参数：
// 		date : 待格式化的日期时间对象
// 返回值：
//		返回格式化后的日期时间字符串：yyyy-MM-dd HH:mm:ss
function format(date) {
	var year = date.getFullYear(),
		month = ("0" + (date.getMonth() + 1)).slice(-2),
		_date = ("0" + date.getDate()).slice(-2),
		hour = ("0" + date.getHours()).slice(-2),
		min = ("0" + date.getMinutes()).slice(-2),
		sec = ("0" + date.getSeconds()).slice(-2),
		mill = ("00" + date.getMilliseconds()).slice(-3);

	return year + "-" + month + "-" + _date + " " + hour + ":" + min + ":" + sec+"."+mill;
}

// 作用：根据id、类、标签查找元素
// 参数：
//		selector : 选择器
//		context : 查询上下文，默认为 document
// 返回值：
//		查找到的满足条件的DOM元素或集合
function $(selector, context) {
	// 未传递context时，默认为 document
	context = context || document;
	// 判断选择器类型
	if (selector.indexOf("#") === 0) // id选择器
		return document.getElementById(selector.slice(1));
	if (selector.indexOf(".") === 0) // 类选择器
		return getElementsByClassName(selector.slice(1), context);
	// 元素选择器
	return context.getElementsByTagName(selector);
}

// 作用：解决根据类名查找元素的兼容问题
// 参数：
//		className : 类名
//		context : 查询上下文，默认为 document
// 返回值：
//		返回查找到的满足条件的元素集合或数组
function getElementsByClassName(className, context) {
	// 未传递 context 时，默认为 document
	context = context || document;
	// 判断，浏览器是否支持使用 getElementsByClassName() 方法
	if (context.getElementsByClassName) // 支持
		return context.getElementsByClassName(className);

	/* 不支持使用 getElementsByClassName() 方法 */
	// 定义数组，保存查找结果
	var result = [];
	// 将上下文中所有后代元素查找出来
	var elements = context.getElementsByTagName("*");
	// 遍历所有元素
	for (var i = 0, len = elements.length; i < len; i++) {
		// 将当前遍历到的元素的类名保存到数组中
		var classNames = elements[i].className.split(" ");
		// 判断在该数组中是否存在要查找的类名
		if (inArray(className, classNames) !== -1)  // 说明在数组中存在待查找的类名，即当前遍历到的元素是等查找的元素之一
			result.push(elements[i]);
	}
	// 返回查找结果数组
	return result;
}

// 作用：获取/设置 指定元素的某CSS属性值
// 参数：
//		element : DOM元素对象
//		attrName : CSS属性名
//		attrValue : 待设置的 CSS 属性值
// 返回值：
//		返回的是查找到的CSS属性值
function css(element, attrName, attrValue) {
	// 获取
	if (typeof attrValue === "undefined") {
		return window.getComputedStyle 
				? window.getComputedStyle(element)[attrName]
				: element.currentStyle[attrName];
	}

	// 设置
	element.style[attrName] = attrValue;
}

// 作用：显示指定元素
// 参数：
//		element: DOM元素
function show(element) {
	element.style.display = "block";
	// css(element, "display", "block");
}

// 作用：隐藏指定元素
// 参数：
//		element: DOM元素
function hide(element) {
	element.style.display = "none";
}

// 作用：获取滚动距离顶部高度 
function scrollTop() {
	return document.documentElement.scrollTop || document.body.scrollTop;
}

// 作用：获取滚动距离左侧宽度
function scrollLeft() {
	return document.documentElement.scrollLeft || document.body.scrollLeft;
}

// 作用：注册事件监听，事件冒泡方式处理事件
// 参数：
//		element: 待注册事件监听的元素
//		type: 事件类型字符串
//		callback: 回调函数，事件处理程序
function on(element, type, callback) {
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

// 作用：求元素的内容宽度
function width(element) {
	if (element === window)
		return document.documentElement.clientWidth || document.body.clientWidth;

	var _width = 0;
	if (css(element, "display") !== "none"){
		_width = element.clientWidth 
		    - parseFloat(css(element, "paddingLeft"))
			- parseFloat(css(element, "paddingRight"));
	} else {
		_width = parseFloat(css(element, "width"));
	}

	return _width;
}

// 作用：求元素的内容宽度
function height(element) {
	if (element === window)
		return document.documentElement.clientHeight || document.body.clientHeight;
	
	var _height = 0;
	if (css(element, "display") !== "none"){
		_height = element.clientHeight 
		    - parseFloat(css(element, "paddingTop"))
			- parseFloat(css(element, "paddingBottom"));
	} else {
		_height = parseFloat(css(element, "height"));
	}

	return _height;
}

// 作用：求元素的边框以内的宽度
function innerWidth(element) {
	if (css(element, "display") !== "none")
		return element.clientWidth;

	return parseFloat(css(element, "width"))
			+ parseFloat(css(element, "paddingLeft"))
			+ parseFloat(css(element, "paddingRight"));
}

// 作用：求元素的边框以内的高度
function innerHeight(element) {
	if (css(element, "display") !== "none")
		return element.clientHeight;

	return parseFloat(css(element, "height"))
			+ parseFloat(css(element, "paddingTop"))
			+ parseFloat(css(element, "paddingBottom"));
}

// 作用：求元素的边框及以内的宽度
// 参数：
//		element: 待求解宽度的DOM元素
//		containsMargin: 布尔值，是否包含外边距(margin)
// 返回值：
//		返回计算宽度：元素的边框及以内的宽度（可能包含margin）
function outerWidth(element, containsMargin) {
	var _width = 0;

	if (css(element, "display") !== "none")
		_width = element.offsetWidth;
	else 
		_width = parseFloat(css(element, "width"))
				+ parseFloat(css(element, "paddingLeft"))
				+ parseFloat(css(element, "paddingRight"))
				+ parseFloat(css(element, "borderLeftWidth"))
				+ parseFloat(css(element, "borderRightWidth"));

	if (containsMargin) 
		_width += parseFloat(css(element, "marginLeft"))
					+ parseFloat(css(element, "marginRight"));

	return _width;
}

// 作用：求元素的边框及以内的高度
function outerHeight(element, containsMargin) {
	var _height = 0;
	if (css(element, "display") !== "none")
		_height = element.offsetHeight;
	else
		_height = parseFloat(css(element, "height"))
			+ parseFloat(css(element, "paddingTop"))
			+ parseFloat(css(element, "paddingBottom"))
			+ parseFloat(css(element, "borderTopWidth"))
			+ parseFloat(css(element, "borderBottomWidth"));

	if (containsMargin) 
		_height += parseFloat(css(element, "marginTop"))
					+ parseFloat(css(element, "marginBottom"));

	return _height;
}

// 作用：获取/设置 元素在文档中的定位坐标
// 参数：
//		element: DOM元素对象
//		coordinates : 待设置文档中的定位坐标，{top, left}
// 返回值：
//		DOM元素对象在文档中定位坐标，{top, left}
function offset(element, coordinates) {
	// 获取
	if (typeof coordinates === "undefined") {
		var _top = 0, _left = 0;
		// 循环求在文档中坐标
		while (element !== null) {
			_top += element.offsetTop;
			_left += element.offsetLeft;
			element = element.offsetParent;
		}
		// 返回在文档中坐标的对象
		return {
			top : _top,
			left : _left
		};
	}
	
	// 设置
	// 求父元素在文档中的坐标
	var _top = 0, _left = 0, currentElement = element.offsetParent;
	// 循环求在文档中坐标
	while (currentElement !== null) {
		_top += currentElement.offsetTop;
		_left += currentElement.offsetLeft;
		currentElement = currentElement.offsetParent;
	}
	// 计算元素相对其有定位的父元素坐标系中位置
	css(element, "top", (coordinates.top - _top) + "px");
	css(element, "left", (coordinates.left - _left) + "px");
}

// 获取光标在文档中的定位位置
function page(event) {
	var _top = event.clientY + scrollTop();
	var _left = event.clientX + scrollLeft();
	return {
		x : _left,
		y : _top
	}
}

// 保存/获取cookie
// 参数：
//		key : cookie名
//		value : cookie值，可选，不传递该参数时，表示读取cookie
//		options : 可配置对象 {expires:10, path:"/", domain:".jd.com", secure:true}
// 返回值：
//		读取到 cookie 的值
function cookie(key, value, options) {
	// reading
	if (typeof value === "undefined") {
		// 获取所有 cookie
		var cookies = document.cookie.split("; ");
		// 遍历每条 cookie 信息
		for (var i = 0, len = cookies.length; i < len; i++) {
			// 将当前遍历到的 cookie 以 = 分割
			var parts = cookies[i].split("=");
			// 当前cookie名
			var name = decodeURIComponent(parts.shift());
			// 判断是否为等查找的 cookie名
			if (name === key) 
				return decodeURIComponent(parts.join("="));
		}

		// 如果查找不到 cookie，则返回 null
		return null;
	}

	// writeing
	var _cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	// 判断是否有可配置信息
	options = options || {};
	if (options.expires) { // 有配置失效时间
		var date = new Date();
		date.setDate(date.getDate() + options.expires);
		_cookie += ";expires=" + date.toUTCString();
	}
	if (options.path) // 有配置路径
		_cookie += ";path=" + options.path;
	if (options.domain) // 有配置域
		_cookie += ";domain=" + options.domain;
	if (options.secure) // 有配置安全链接
		_cookie += ";secure";

	// 保存
	document.cookie = _cookie;
}

// 删除cookie
function removeCookie(key, options) {
	options = options || {};
	options.expires = -1;
	cookie(key, "", options);
}

/*
 * 作用：多属性运动框架，线性运动
 * 参数：
 *		element: 待添加运动动画效果的元素
 *		options: 运动终值对象
 *		speed: 限定运动总时间
 *		fn: 运动动画效果执行结束后要执行到的函数
 */
function animate(element, options, speed, fn) {
	// 停止元素上已有运动动画效果
	clearInterval(element.timer);
	// 定义对象，保存各运动属性初值、运动区间范围
	// 对象属性名与 options 一致
	var start = {}, range = {};
	for ( var attr in options ) { // 遍历options每个属性
		start[attr] = parseFloat(css(element, attr));
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
			// 如果是不透明度设置IE9之前
			if (attr === "opacity")
				element.style.filter = "alpha(opacity="+ (result*100) +")";
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

// 淡入
function fadeIn(element, speed, fn) {
	element.style.opacity = 0;
	show(element);
	animate(element, {opacity:1}, speed, fn);
}

// 淡出
function fadeOut(element, speed, fn) {
	animate(element, {opacity:0}, speed, function(){
		hide(element);
		fn && fn();
	});
}
