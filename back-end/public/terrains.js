class terrain {
    constructor(type, x, y, hitbox, drop) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.hitbox = hitbox;
        if (type == 3) {
            this.health = 50;
        } else {
            this.health = 100;
        }
        this.drop = drop;
    }

    takeDamage(type, damage, index) {
    	this.health -= damage;
    	console.log("HIT");
    	if (type == 3 && this.health <= 0) {
    		// drops.push(this.drop);
    		// asteroids.splice(index,1);
            tank.points += 10;
    		socket.emit("destroyAsteroid",index);
    	} else if (type == 4 && this.health <= 0) {
            socket.emit("destroyAsteroid",index);
        }
    }
}