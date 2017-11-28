/*
 * 自已的战机
 */
var Self = {
	width : 66, // 宽度
	height : 80, // 高度
	element : null, // DOM元素
	imgSrc : "images/self.gif", // 战机图片
	x : 0, // x坐标
	y : 0, // y坐标
	init : function(){ // 初始化创建DOM元素，添加到地图中
		// 创建元素
		var e = this.element = document.createElement("img");
		// 设置图像路径
		e.src = this.imgSrc;
		// 添加到地图，即在地图中添加战机
		Map.addRole(this);
		// 设置DOM元素样式
		e.style.cssText = `width:${this.width}px;
							height:${this.height}px;
							position: absolute;
							top : ${this.y}px;
							left : ${this.x}px;`;
	},
	move : function(event){ // 战机移动
		// 先让战机在文档中设置定位位置到光标处
		offset(this.element, {
			top : page(event).y - this.height / 2,
			left : page(event).x - this.width / 2
		});
		// 移动过程中重新设置元素坐标属性
		this.x = this.element.offsetLeft;
		this.y = this.element.offsetTop;
	}
};