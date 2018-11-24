var speed = 10;

class bullet {
    constructor(mouseX, mouseY, x, y, bulletType, socketID) {
        console.log(socketID);
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
        let d = dist(this.xx, this.yy, x - this.x, y - this.y);
        // console.log(d);
        if (d < 45 && check) {
            var data = {
                i: i,
                socketID: socketID
            }
            /* SEND IT */
            // socket.emit('bulletHit', data);
            // console.log("HERE");
            arr.splice(i, 1);
        } else {
            for (var i = 0; i < player.length; i++) {
                let cords = player[i].Cords;
                // console.log(cords.x + ":" + cords.y);
                // console
                // console.log(() + ":" + (this.y+this.yy));
                d = dist(this.x + this.xx, this.y + this.yy, cords.x, cords.y);
                // console.log(d);
                if (player[i].SocketID != this.socketIDE) {
                    if (d < 45) {
                        arr.splice(i, 1);
                    }
                }

            }
        }
        // for (var i = 0; i < player.length; i++) {
        //     player[i]
        // }
        pop();
    }
}