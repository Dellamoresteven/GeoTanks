class bullet {
    constructor(mouseX, mouseY, x, y, bulletType, socketID) {
        // console.log(socketID);
        imageMode(CENTER);
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
        this.angle = atan2(mouseY - this.yy, mouseX - this.xx);
        this.angle += PI / 2;
        this.socketIDE = socketID;

        //Bullet Damage and Icon
        this.dmg = -1;
        this.bulletHitBox = -1;
        this.speed = -1;
        this.bulletIcon = -1;
        this.travelDist = -1;
        this.attackSpeed = -1;
        this.automatic = -1;
        this.bulletColor = -1;
        this.bulletSize = -1;
        this.setBullet(this.bulletType);
    }
    nextPoint(x, y, check, i, arr, socketIDD) {
        angleMode(RADIANS);
        // console.log(this.socketIDE);

        // console.log(mou)
        fill(this.bulletColor);
        if (this.bulletType == 6) {
            push();
            console.log((this.xx + this.x), (this.yy + this.x));
            translate(this.xx + this.x, this.yy + this.x);
            // rotate(this.angle + PI/2);
            rect(0,0, this.bulletSize / 1.5, this.bulletSize / 4);
            pop();
        }
        push();
        // rotate(this.angle);
        translate(this.x, this.y);

        // ellipse(this.xx, this.yy, this.bulletSize, this.bulletSize);


        // image(this.BasicBulletIcon, this.xx, this.yy, this.BasicBulletIcon.width / 3, this.BasicBulletIcon.height / 3);
        this.xx -= this.intervalY * this.speed;
        this.yy -= this.intervalX * this.speed;
        if (abs(this.xx) + abs(this.yy) > this.travelDist) {
            arr.splice(i, 1);
        }
        for (var i = 0; i < player.length; i++) {
            if (player[i].TankStatus) {
                let d = dist(this.xx, this.yy, player[i].x - this.x, player[i].y - this.y);
                // console.log(d);
                if (d < this.bulletHitBox) {
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
        this.setBullet(data.bulletType);
        fill(this.bulletColor);
        if (this.bulletType == 6) {
            push();
            // rotate(PI);
            // image(this.bulletIcon, data.xx, data.yy, this.bulletIcon.width / 50, this.bulletIcon.height / 50);

            pop();
        } else {
            ellipse(data.xx, data.yy, this.bulletSize, this.bulletSize);
        }

        pop()
    }
    setBullet(type) {
        switch (type) {
            /**
             * 0 - Armour Basic
             * 1 - Basic SMG
             * 2 - MG
             * 3 - Heavy MG
             * 4 - Armor level 2
             * 5 - armor level 3
             * 6 - Rocket Launcher
             */
            case 1:
                this.dmg = 10;
                this.speed = 20;
                this.travelDist = 1500;
                this.attackSpeed = -1;
                this.automatic = false;
                //this.bulletIcon = loadImage("jpgs/Tank_Bullet.png")
                this.bulletColor = "#EF330B";
                this.bulletSize = 10;
                this.bulletHitBox = 2 * this.bulletSize;
                break;
            case 2:
                this.dmg = 2;
                this.speed = 25;
                this.travelDist = 1000;
                this.attackSpeed = 100;
                this.automatic = true;
                this.bulletColor = "#C0C0C0";
                this.bulletSize = 15;
                this.bulletHitBox = 2 * this.bulletSize;
                //this.bulletIcon = loadImage("jpgs/Tank_Bullet.png")
                break;
            case 3:
                this.dmg = 3;
                this.speed = 40;
                this.travelDist = 500;
                this.attackSpeed = 100;
                this.automatic = true;
                this.bulletColor = "#0BDAEF";
                this.bulletSize = 10;
                this.bulletHitBox = 2 * this.bulletSize;
                //this.bulletIcon = loadImage("jpgs/Tank_Bullet.png")
                break;
            case 6:
                this.dmg = 40;
                this.speed = 5;
                this.travelDist = 2000;
                this.attackSpeed = -1;
                this.automatic = false;
                this.bulletColor = "#cc0000";
                this.bulletSize = 50;
                this.bulletHitBox = 50;
                this.bulletIcon = loadImage("jpgs/rocket.png")
                break;
        }
    }
    polygon(x, y, radius, npoints) {
        var angle = TWO_PI / npoints;
        beginShape();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius;
            var sy = y + sin(a) * radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }
}