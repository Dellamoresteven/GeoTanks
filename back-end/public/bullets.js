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
    }
    nextPoint(x, y, check) {
        push();
        fill(255);
        translate(this.x, this.y);
        // console.log(mou)
        ellipse(this.xx, this.yy, 20, 20);
        this.xx -= this.intervalY * speed;
        this.yy -= this.intervalX * speed;
        let d = dist(this.xx,this.yy,x-this.x,y-this.y);
        // console.log(d);
        if(d < 20 && check){
            console.log("HIT");
            this.xx = -1000;
            this.yy = -1000;
        }
        pop();
    }
}