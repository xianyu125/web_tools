/*
 * 地图对象
 */
var Map = {
	width : 320, // 宽度
	height : 568, // 高度
	startContainer : $("#start"), // 启动界面容器
	gameContainer : $("#game"), // 游戏界面容器
	scoreContainer : $("#score"), // 显示积分

	addRole : function(role){ // 添加地图中的游戏角色
		this.gameContainer.appendChild(role.element);
	}	
};