class Players {
    constructor(socketID, x, y, ang) {
        this.socketID = socketID;
        this.x = x;
        this.y = y;
        this.ang = ang;
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
}