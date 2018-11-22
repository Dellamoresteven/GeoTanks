var speed = 10;

class bullet {

    // let slope = 
    /* y - mouseY = slope(x-mouseX) */
    /* y = slope(x-mouseX) + mouseY */
    /* x = (y-mouseY)/slope + mouseX */
    constructor(mouseX, mouseY, x, y, bulletType) {
        this.moX = mouseX;
        this.moY = mouseY;
        this.x = x;
        this.y = y;
        this.xx = 0;
        this.yy = 0;
        this.bulletType = bulletType;
        // console.log(pow(this.y - this.moY, 2));
        // console.log(pow(this.x - this.moX, 2));
        // console.log(pow(this.y - this.moY, 2) + pow(this.x - this.moX, 2));
        this.H = sqrt(pow(this.y - this.moY, 2) + pow(this.x - this.moX, 2));
        // console.log(this.H);
        this.intervalX = (this.y - this.moY) / this.H;
        this.intervalY = (this.x - this.moX) / this.H;
    }
    get nextPoint() {
        push();
        fill(255);
        translate(this.x, this.y);
        // console.log(mou)
        ellipse(this.xx, this.yy, 20, 20);
        this.xx -= this.intervalY * speed;
        this.yy -= this.intervalX * speed;
        pop();
    }
}