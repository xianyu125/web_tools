/*
 * 角色父类
 */
function Role(options) {
	options = options || {};
	this.width = options.width;
	this.height = options.height;
	this.element = null;
	this.imgSrc = options.imgSrc;
	this.x = options.x;
	this.y = options.y;
	this.speed = options.speed;
	this.isAlive = true; // 角色是否还存在
}

Role.prototype = {
	constructor : Role,
	init : function(){ // 初始化
		// 创建元素
		var e = this.element = document.createElement("img");
		// 设置src
		e.src = this.imgSrc;
		// 添加到地图中
		Map.addRole(this);
		// CSS样式
		e.style.cssText = `width:${this.width}px;
							height:${this.height}px;
							position: absolute;
							top : ${this.y}px;
							left : ${this.x}px;`;
	},
	move : function(){ // 移动
		// 定位 y 坐标加上速度
		this.y += this.speed;
		// 重新设置DOM元素定位位置
		this.element.style.top = this.y + "px";
		// 判断是否销毁资源
		if (this.y < 0)
			this.destroy();
	},
	destroy : function(){ // 销毁
		// 移除DOM元素
		this.element.parentNode.removeChild(this.element);
		// 标记不存在 
		this.isAlive = false;
	}
}