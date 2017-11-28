/*
 * 子弹类
 */
// 构造函数继承
function Bullet() {
	Role.call(this, {
		width : 6,
		height : 14,
		imgSrc : "images/bullet.png",
		x : Self.x + Self.width / 2,
		y : Self.y - 15,
		speed : -4
	});
}
// 原型继承
Bullet.prototype = new Role();