/*
 * 游戏引擎对象
 */
var Game = {
	bullets : [], // 存放所有子弹的数组
	enemies : [], // 存放所有敌机的数组
	scores : 0, // 总积分

	init : function(){
		// 注册事件监听
		this.registerEventListener();
	},
	startGame : function(){ // 启动游戏
		// 战机初始化
		Self.init();
		this.play();
	},
	play : function(){ // 组织游戏逻辑
		var count = 0; // 计数
		// 每隔一定时间，生成子弹、子弹移动
		var timer = setInterval(function(){
			count++;
			if (count % 10 === 0) { // 生成子弹
				// 创建子弹对象
				var bullet = new Bullet();
				// 初始化
				bullet.init();
				// 将当前创建子弹对象添加到数组中保存
				Game.bullets.push(bullet);
			}

			if (count % 60 === 0) { // 生成小敌机
				// 创建敌机对象
				var enemy = new Enemy({
					width : 34,
					height : 24,
					x : Game.random(0, Map.width - 34),
					y : 0,
					imgSrc : "images/small_fly.png",
					speed : Game.random(1, 4),
					score : 100
				});
				// 初始化
				enemy.init();
				// 将当前创建敌机添加到所有敌机的数组中保存
				Game.enemies.push(enemy);
			}

			if (count % 120 === 0) { // 生成中敌机
				// 创建敌机对象
				var enemy = new Enemy({
					width : 46,
					height : 60,
					x : Game.random(0, Map.width - 46),
					y : 0,
					imgSrc : "images/mid_fly.png",
					speed : Game.random(1, 3),
					score : 500
				});
				// 初始化
				enemy.init();
				// 将当前创建敌机添加到所有敌机的数组中保存
				Game.enemies.push(enemy);
			}

			// 让所有子弹移动一步
			for (var i = Game.bullets.length - 1; i >= 0; i--) {
				Game.bullets[i].move();
				if (!Game.bullets[i].isAlive)
					Game.bullets.splice(i, 1);
			}
			// 让所有敌机移动
			for (var i = Game.enemies.length - 1; i >= 0; i--) {
				Game.enemies[i].move();
				if (!Game.enemies[i].isAlive) {
					Game.enemies.splice(i, 1);
				}
			}
			// 碰撞检测
			// 检测子弹与敌机的碰撞
			for (var i = Game.bullets.length - 1; i >= 0; i--) {
				var bullet = Game.bullets[i];
				for (var j = Game.enemies.length - 1; j >= 0; j--) {
					var enemy = Game.enemies[j];
					// 判断遍历到的敌机与子弹是否碰撞
					if (Game.intersect(bullet, enemy)) { // 碰撞
						// 销毁资源
						bullet.destroy();
						enemy.destroy();
						Game.enemies.splice(j, 1);
						Game.bullets.splice(i, 1);
						// 记录积分
						Game.scores += enemy.score;
						// 显示总积分
						Map.scoreContainer.innerText = "积分：" + Game.scores;
						break;
					}
				}
			}
			// 检测敌机与战机的碰撞
			for (var j = Game.enemies.length - 1; j >= 0; j--) {
				var enemy = Game.enemies[j];
				if (Game.intersect(enemy, Self)) {
					enemy.destroy();
					Game.enemies.splice(j, 1);
					clearInterval(timer);
				}
			}
		}, 1000/60);
	},
	random : function(lower, upper){ // 产生随机数
		return Math.floor(Math.random() * (upper - lower + 1)) + lower;
	},
	registerEventListener : function(){ // 绑定元素事件
		// 在地图上点击开始
		Map.startContainer.onclick = function(){
			// 隐藏元素
			hide(this);
			// 启动游戏
			Game.startGame();
		}
		// 在游戏界面中绑定鼠标移动事件
		Map.gameContainer.onmousemove = function(e){
			e = e || event;
			// 战机跟随鼠标移动
			Self.move(e);
		}
	},
	intersect : function(obj1, obj2){ // 判断是否相交，返回true表示出现相交情况，否则不相交
		return !(obj1.x > obj2.x + obj2.width
				|| obj1.x + obj1.width < obj2.x
				|| obj1.y > obj2.y + obj2.height
				|| obj1.y + obj1.height < obj2.y);
	}
};