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
    	if (type == 3 && this.health <= 0) {
            tank.points += 30;
    		socket.emit("destroyAsteroid",index);
    	} else if (type == 4 && this.health <= 0) {
            socket.emit("destroyAsteroid",index);
        }
    }
}