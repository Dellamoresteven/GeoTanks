class asteroid {
    constructor(type, x, y, hitbox, drop) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.hitbox = hitbox;
        if (drop == -1) {
        	this.drop = undefined;
        } else {
        	this.drop = new Drop;
        }
    }

    setDrop(type) {
    	this.drop = new 
    }
}