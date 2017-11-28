/* 敌机 */
function Enemy(options) {
	Role.call(this, options);
	this.score = options.score;
}
Enemy.prototype = new Role();