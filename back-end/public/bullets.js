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
        this.H = sqrt(pow(this.moY - windowHeight / 2, 2) + pow(this.moX - windowWidth / 2, 2)); //PROBLEM HERE!!


        this.intervalY = (this.moX - windowWidth / 2) / this.H; //PROBLERM HERE!!!!
        this.intervalX = (this.moY - windowHeight / 2) / this.H; //PROBLEMM HERE!!!!
        if (this.moX != 0) {
            // console.log(this.H + " : " + this.intervalX + " : " + this.intervalY);
        }

        // push();
        // translate(this.x, this.y);
        this.angle = atan2(mouseY - windowHeight / 2, mouseX - windowWidth / 2);
        this.angle += PI / 2;

        // pop();
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
        this.explosionState = 0;
        this.setBullet(this.bulletType);
    }
    nextPoint(x, y, check, i, arr, socketIDD) {
        // console.log("F");
        angleMode(RADIANS);
        // console.log(this.socketIDE);

        // console.log(mou)
        push();
        // rotate(this.angle);
        translate(this.x, this.y);



        fill(this.bulletColor);
        if (this.explosionState == 0) {
            if (this.bulletType == 6) {
                push();
                //console.log((this.xx + this.x), (this.yy + this.x));
                translate(this.xx, this.yy);
                rotate(this.angle - PI / 2);
                rect(0, 0, this.bulletSize / 1.5, this.bulletSize / 4);
                fill(255);
                triangle(15, this.bulletSize / 5, 15, -this.bulletSize / 5, 30, 0);
                // line(0,0, 1000, 1000);
                stroke(0);
                strokeWeight(4);
                line(3, this.bulletSize / 10, 3, -this.bulletSize / 10)
                line(-9, this.bulletSize / 10, -9, -this.bulletSize / 10)
                pop();
            } else {
                ellipse(this.xx, this.yy, this.bulletSize, this.bulletSize);
            }


            // image(this.BasicBulletIcon, this.xx, this.yy, this.BasicBulletIcon.width / 3, this.BasicBulletIcon.height / 3);

            this.xx += this.intervalY * this.speed;
            this.yy += this.intervalX * this.speed;
        }

        if (abs(this.xx) + abs(this.yy) > this.travelDist) {
            arr.splice(i, 1);
        }
        // if (check != 0) {
        for (var i = 0; i < player.length; i++) {
            if (player[i].TankStatus) {

                let d = dist(this.xx, this.yy, player[i].x - this.x, player[i].y - this.y);
                // console.log(d);
                if (d < this.bulletHitBox) {
                    // this.explode(this);

                    // console.log("HERE");
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
        // }
    }


    display(data) {
        push();

        translate(data.x, data.y);
        this.setBullet(data.bulletType);
        fill(this.bulletColor);
        if (data.explosionState == 0) {
            if (data.bulletType == 6) {
                push();
                //console.log((this.xx + this.x), (this.yy + this.x));
                translate(data.xx, data.yy);
                rotate(data.angle - PI / 2);

                rect(0, 0, this.bulletSize / 1.5, this.bulletSize / 4);
                fill(255);
                triangle(15, this.bulletSize / 5, 15, -this.bulletSize / 5, 30, 0);
                // line(0,0, 1000, 1000);
                stroke(0);
                strokeWeight(4);
                line(3, this.bulletSize / 10, 3, -this.bulletSize / 10)
                line(-9, this.bulletSize / 10, -9, -this.bulletSize / 10)
                pop();
            } else {
                ellipse(data.xx, data.yy, this.bulletSize, this.bulletSize);
            }
        } else {
            this.explode(data);
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
             * 7 - STARTING WEP
             */
            case 1:
                this.dmg = 10;
                this.speed = 20;
                this.travelDist = 600;
                this.attackSpeed = 1;
                this.automatic = false;
                //this.bulletIcon = loadImage("jpgs/Tank_Bullet.png")
                this.bulletColor = "#EF330B";
                this.bulletSize = 10;
                this.bulletHitBox = 2 * this.bulletSize;
                break;
            case 2:
                this.dmg = 5;
                this.speed = 25;
                this.travelDist = 700;
                this.attackSpeed = 100;
                this.automatic = true;
                this.bulletColor = "#C0C0C0";
                this.bulletSize = 10;
                this.bulletHitBox = 50;
                //this.bulletIcon = loadImage("jpgs/Tank_Bullet.png")
                break;
            case 3:
                this.dmg = 7;
                this.speed = 40;
                this.travelDist = 370;
                this.attackSpeed = 100;
                this.automatic = true;
                this.bulletColor = "#0BDAEF";
                this.bulletSize = 15;
                this.bulletHitBox = 50;
                //this.bulletIcon = loadImage("jpgs/Tank_Bullet.png")
                break;
            case 6:
                this.dmg = 40;
                this.speed = 10;
                this.travelDist = 500;
                this.attackSpeed = 1500;
                this.automatic = false;
                this.bulletColor = "#cc0000";
                this.bulletSize = 50;
                this.bulletHitBox = 50;
                // this.bulletIcon = loadImage("jpgs/rocket.png")
                break;
            case 7:
                this.dmg = 5;
                this.speed = 10;
                this.travelDist = 600;
                this.attackSpeed = 500;
                this.automatic = false;
                this.bulletColor = "#000000";
                this.bulletSize = 10;
                this.bulletHitBox = 50;
                // this.bulletIcon = loadImage("jpgs/rocket.png")
                break;
        }
    }
    // polygon(x, y, radius, npoints) {
    //     var angle = TWO_PI / npoints;
    //     beginShape();
    //     for (var a = 0; a < TWO_PI; a += angle) {
    //         var sx = x + cos(a) * radius;
    //         var sy = y + sin(a) * radius;
    //         vertex(sx, sy);
    //     }
    //     endShape(CLOSE);
    // }

    explode(data) {
        // console.log(data);
        // console.log("HERE");
        if (data.explosionState != 0) {
            if (data.bulletType == 6) {
                push();
                fill("#ffff00");
                translate(data.xx, data.yy);
                ellipse(0, 0, 50 + data.explosionState * 4, 50 + data.explosionState * 4);
                /* Rocket explosion phase */
                pop();
            }
        }

    }
}