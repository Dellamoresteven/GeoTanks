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
        // console.log(type + ":" + x + ":" + y + ":" + intervalX + ":" + intervalY)
        imageMode(CENTER);
        this._id = type;
        this.x = x;
        this.y = y;
        this.intervalX = intervalX;
        this.intervalY = intervalY;
        this.currDist = 0;
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
        //translate(this.x, this.y);
        fill(this.bulletColor);
        if (this.explosionState == 0) {
            if ("Rocket" == guns[this._id].name) {
                // push();
                // //console.log((this.xx + this.x), (this.yy + this.x));
                // translate(this.xx, this.yy);
                // rotate(this.angle - PI / 2);
                // // console.log(this.angle);
                // rect(0, 0, 50 / 1.5, 50 / 4);
                // fill(255);
                // triangle(15, 50 / 5, 15, -50 / 5, 30, 0);
                // // line(0,0, 1000, 1000);
                // stroke(0);
                // strokeWeight(4);
                // line(3, 50 / 10, 3, -50 / 10)
                // line(-9, 50 / 10, -9, -50 / 10)
                // pop();
            } else {
                ellipse(this.x, this.y, this.bulletSize, this.bulletSize);
            }


            // image(this.BasicBulletIcon, this.xx, this.yy, this.BasicBulletIcon.width / 3, this.BasicBulletIcon.height / 3);
            this.x += this.intervalX * this.speed;
            this.y += this.intervalY * this.speed;
        }
        // console.log("S");
        this.currDist += 1;
        if (this.currDist > this.travelDist) {
            arr.splice(i, 1);
        }
        // if (check != 0) {
        // if (check == 1) {
        //     for (var i = 0; i < player.length; i++) {
        //         for (var j = 0; j < player[i].bulletss.length; j++) {
        //             if (dist((player[i].bulletss[j].xx + player[i].bulletss[j].x), (player[i].bulletss[j].yy + player[i].bulletss[j].y), tank.x, tank.y) < this.bulletHitBox) {
        //                 if (tank.armor < this.dmg) {
        //                     this.dmg -= tank.armor;
        //                     tank.armor = 0;
        //                     if (tank.health < this.dmg) {
        //                         tank.TankStatus = false;
        //                         tank.health = 0;
        //                     } else {
        //                         tank.health -= this.dmg;
        //                     }
        //                 } else {
        //                     tank.armor -= this.dmg
        //                 }
        //                 player[i].bulletss.splice(j, 1);
        //             }
        //         }
        //     }
        // }

        // if (check == 0) {
        //     for (var i = 0; i < player.length; i++) {
        //         if (player[i].TankStatus) {
        //             let d = dist(this.xx, this.yy, player[i].x - this.x, player[i].y - this.y);
        //             if (d < this.bulletHitBox) {
        //                 arr.splice(i, 1);
        //             }

        //         }
        //     }
        // }
        pop();
    }

    dealDamage(p,b) {
        if (tank.armor < this.dmg) {
            this.dmg -= tank.armor;
            tank.armor = 0;
            if (tank.health < this.dmg) {
                tank.TankStatus = false;
                tank.health = 0;
            } else {
                tank.health -= this.dmg;
            }
        } else {
            tank.armor -= this.dmg
        }
        player[p].bulletss.splice(b, 1);
    }
}