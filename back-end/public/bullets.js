// "_id": 0,
// "name": "Basic",
// "dmg": 5,
// "speed": 10,
// "distance": 600,
// "cd": 500,
// "auto": false,
// "size": 10,
// "hitbox": 50,
// "iconname": "",
// "iconf



class bullet {
    constructor(type, x, y, intervalX, intervalY, angle) {
        // if (type == 5) {
        //     for (var i = 0; i < tank.bullets.length; i++) {
        //         if (tank.bullets[i]._id == 5) {
        //             tank.bullets.splice(i, 1);
        //         }
        //     }
        // }
        imageMode(CENTER);
        this._id = type;
        // console.log("shooting");
        // bulletShotArrayMP3[this._id].play();
        this.x = x;
        this.y = y;
        this.intervalX = intervalX;
        this.intervalY = intervalY;
        this.currDistXXXX = 0;
        // this.xx = 0;
        // this.yy = 0;
        this.angle = angle;
        // console.log(Object.keys(guns[0])._id);
        // console.log("F");
        // console.log(this._id)
        // console.log(guns[0]);
        this.dmg = guns[this._id].dmg;
        // console.log(this.dmg);
        this.bulletHitBox = guns[this._id].hitbox;
        this.speed = guns[this._id].speed;
        this.bulletIcon = guns[this._id].iconname;
        this.travelDist = guns[this._id].distance;
        this.attackSpeed = guns[this._id].cd;
        this.automatic = guns[this._id].auto;
        this.bulletColor = guns[this._id].color;
        this.bulletSize = guns[this._id].bulletsize;
        this.explosionState = 0;

        // this.setBullet(this.bulletType);
    }

    nextPoint(i, arr, check) {
        angleMode(RADIANS);

        push();
        if (this.currDistXXXX > this.travelDist) {
            console.log(this.currDistXXXX +"?" + this.travelDist + ":" + i)

            arr.splice(i, 1);
            return;
        }
        //translate(this.x, this.y);
        fill(this.bulletColor);
        if (this.explosionState == 0) {
            if ("Rocket" == guns[this._id].name) {
                push();
                // console.log("F");
                //console.log((this.xx + this.x), (this.yy + this.x));
                translate(this.x, this.y);
                rotate(this.angle - PI / 2);
                // console.log(this.angle);
                rect(60, -20, 80, 5, 255);
                rect(60, 20, 80, 5, 20, 255);
                pop();
            } else if ("greenLazer" == guns[this._id].name) {
                push();
                fill("#7CFC00");
                translate(this.x, this.y);
                rotate(this.angle - PI / 2);
                rect(30, -40, 50, 5, 255);
                rect(30, 40, 50, 5, 20, 255);
                pop();
                // console.log("X");
            } else if ("shotgun" == guns[this._id].name) {
                push();
                fill("#ff00b4");
                translate(this.x, this.y);
                rotate(this.angle - PI / 2);
                rect(40, -10, 20, 5, 255);
                rect(0, 0, 20, 5, 255);
                rect(40, 10, 20, 5, 20, 255);
                pop();
                // console.log("X");
            } else {
                ellipse(this.x, this.y, this.bulletSize, this.bulletSize);
            }

            // image(this.BasicBulletIcon, this.xx, this.yy, this.BasicBulletIcon.width / 3, this.BasicBulletIcon.height / 3);
            this.x += this.intervalX * this.speed;
            this.y += this.intervalY * this.speed;
        }
        // console.log("S");
        pop();
        this.currDistXXXX += 10;
    }

    dealDamage(p, b) {
        if (tank.TankStatus) {
            if (tank.armor < this.dmg) {
                this.dmg -= tank.armor;
                tank.armor = 0;
                if (tank.health < this.dmg) {
                    tank.TankStatus = false;
                    tank.health = 0;
                    const data = {
                        name: playerPreferences['playerName'],
                        score: tank.score
                    }
                    // socket.emit("sendScores", data);
                } else {
                    tank.health -= this.dmg;
                }
            } else {
                tank.armor -= this.dmg
            }
            console.log("X");
            player[p].bulletss.splice(b, 1);
        }
    }
}

















//