class terrain {
    constructor(type, x, y, hitbox, drop) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.hitbox = hitbox;
        this.health = 50;
        this.drop = drop;
    }

    takeDamage(type, damage, index) {
    	this.health -= damage;
    	console.log(index);
    	if (type == 3 && this.health <= 0) {
    		// drops.push(this.drop);
    		// asteroids.splice(index,1);
    		socket.emit("destroyAsteroid",index);
    	}
    }
}