var speed = 10;

class bullet {
    constructor(mouseX, mouseY, x, y, bulletType) {
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
    }
    nextPoint(x, y, check) {
        push();
        fill(0);
        // rotate(this.angle);
        translate(this.x, this.y);
        // console.log(mou)
        ellipse(this.xx, this.yy, 10, 10);
        
        // image(this.BasicBulletIcon, this.xx, this.yy, this.BasicBulletIcon.width / 3, this.BasicBulletIcon.height / 3);
        this.xx -= this.intervalY * speed;
        this.yy -= this.intervalX * speed;
        let d = dist(this.xx,this.yy,x-this.x,y-this.y);
        // console.log(d);
        if(d < 45 && check){
            this.xx = -1000;
            this.yy = -1000;
        }
        // for (var i = 0; i < player.length; i++) {
        //     player[i]
        // }
        pop();
    }
}