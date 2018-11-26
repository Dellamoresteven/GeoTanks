var speed = 20;

class bullet {
    constructor(mouseX, mouseY, x, y, bulletType, socketID) {
        // console.log(socketID);
        this.dmg = 0;
        this.moX = mouseX;
        this.moY = mouseY;
        this.x = x;
        this.y = y;
        this.xx = 0;
        this.yy = 0;
        this.bulletType = bulletType;
        this.H = sqrt(pow(this.y - this.moY, 2) + pow(this.x - this.moX, 2));
        this.intervalX = (this.y - this.moY) / this.H;
        this.intervalY = (this.x - this.moX) / this.H;
        this.BasicBulletIcon = loadImage("jpgs/Tank_Bullet.png");
        this.angle = atan2(mouseY - this.yy, mouseX - this.xx);
        this.angle += PI / 2;
        this.socketIDE = socketID;
        if (this.bulletType == "basic") {
            this.dmg = 10;
        }
    }
    nextPoint(x, y, check, i, arr, socketIDD) {
        // console.log(this.socketIDE);
        push();
        fill(0);
        // rotate(this.angle);
        translate(this.x, this.y);
        // console.log(mou)
        ellipse(this.xx, this.yy, 10, 10);

        // image(this.BasicBulletIcon, this.xx, this.yy, this.BasicBulletIcon.width / 3, this.BasicBulletIcon.height / 3);
        this.xx -= this.intervalY * speed;
        this.yy -= this.intervalX * speed;
        if (abs(this.xx) + abs(this.yy) > 1500) {
            arr.splice(i, 1);
        }
        for (var i = 0; i < player.length; i++) {
            if (player[i].TankStatus) {
                let d = dist(this.xx, this.yy, player[i].x - this.x, player[i].y - this.y);
                // console.log(d);
                if (d < 45) {
                    var data = {
                        socketID: player[i].socketID,
                        dmg: this.dmg
                    }
                    /* SEND IT */
                    socket.emit('hitSomeone', data);
                    arr.splice(i, 1);
                }
            }
        }
        pop();
    }
    display(data) {
        push();
        translate(data.x, data.y);
        if (data.bulletType == "basic") {
            ellipse(data.xx, data.yy, 10, 10);
        }
        pop()
    }
}