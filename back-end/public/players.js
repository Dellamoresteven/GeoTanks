class Players {
    constructor(socketID, x, y, ang) {
        this.socketID = socketID;
        this.x = x;
        this.y = y;
        this.ang = ang;
        this.bulletss = [];
    }
    get SocketID() {
        return this.socketID;
    }

    get Cords() {
        return createVector(this.x, this.y);
    }
    setCords(cords) {
        this.x = cords.x;
        this.y = cords.y;
    }
    get Angle() {
        return this.ang;
    }
    setAngle(ang) {
        this.ang = ang;
    }
    addNewBullet(bulle){
        this.bulletss.push(new bullet(bulle.mouseX, bulle.mouseY, bulle.x, bulle.y, bulle.bulletType));
    }
    get bullets(){
        for (var i = 0; i < this.bulletss.length; i++) {
            this.bulletss[i].nextPoint;
        }
    }
}