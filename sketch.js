/* Globel Varibles */
w = 1000;
h = 500;
var speed;
var tank;
var speed;
/**
 * This function is the first thing that is called when setting up the program. 
 * I put a super simple program to help you get started. 
 */


function setup() {
    createCanvas(w, h);
    background(0);
    speed = 10; //change to go faster!
    tank = new GeoTank();
}

/**
 * This is called at 60 FPS, u can change the framerate with frameRate(int) in setup()
 * You want to "repaint" the canvas every time it updates with the new values. 
 */
function draw() {
    background(0); //repaints the background to black
    tank.update(); //calls update in GeoTank
}


/**
 * This is the tank object, keeps track of where it is and which way it 
 * moving.
 */
function GeoTank() {
    /* Position */
    this.x = 0;
    this.y = 0;

    /* direction */
    this.xspeed = 0;
    this.yspeed = 0;
    this.update = function() {
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
        fill(255, 20, 40, 255); //fills the rect with RGBA 255,20,40,255
        rect(this.x, this.y, 50, 50);
    }
    this.dir = function(x, y) {
        this.xspeed = x;
        this.yspeed = y;
    }
}


/**
 * Checks to see if a key is pressed. Function name is important in p5. 
 * If it a key is pressed it can change the direction of the rect moving
 */
function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        tank.dir(-1 * speed, 0);
    } else if (keyCode === RIGHT_ARROW) {
        tank.dir(speed, 0);
    } else if (keyCode === UP_ARROW) {
        tank.dir(0, -1 * speed);
    } else if (keyCode === DOWN_ARROW) {
        tank.dir(0, speed);
    }
}