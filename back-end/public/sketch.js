/* Globel Varibles */
// var socket = io();
var socket;
var w = 500;
var h = 500;
var speed;
var tank;
let oldData;
let oldAngle;

/**
 * This function is the first thing that is called when setting up the program. 
 * I put a super simple program to help you get started. 
 */


function setup() {
    oldData = createVector(0, 0);
    oldAngle = 0.0;
    socket = io.connect('http://localhost:4001');
    socket.on('data', newDraw);
    createCanvas(w, h);
    background(0);
    speed = 3; //change to go faster!
    tank = new GeoTank();
    // angleMode(DEGREES);
    rectMode(CENTER);
}
/** @bug works perfectly with 2 tanks, but once u try to have 3
 * it does some wanky stuff.
 *
 * @params data holds the meta data of the other tanks. 
 */
function newDraw(data) {
    push();
    if(data.ang != undefined){
        oldAngle = data.ang
    }
    translate(data.x, data.y);
    /* rotate other tanks */
    rotate(oldAngle);
    fill(0, 180, 150, 255); //fills the rect with RGBA 255,20,40,255

    rect(0, 0, 50, 70);
    oldData = createVector(data.x, data.y);
    pop();
}

/**
 * This is called at 60 FPS, u can change the framerate with frameRate(int) in setup()
 * You want to "repaint" the canvas every time it updates with the new values. 
 */
function draw() {
    background(0); //repaints the background to black
    tank.update(); //calls update in GeoTank
    newDraw(oldData); //*****
    keyPressed();
}


/**
 * This is the tank object, keeps track of where it is and which way it 
 * moving.
 */
function GeoTank() {
    /* Position */
    this.x = w / 2;
    this.y = h / 2;
    this.angle = 0;
    this.update = function() {
        /* This is to start translating the screen */
        push();
        /* translate the x y plane to be around the rect */
        translate(this.x, this.y);
        // console.log(height);
        /* finding the angle of a vector of the mouseX and mouse Y */
        this.angle = atan2(mouseY - this.y, mouseX - this.x);
        this.angle += PI/2
        rotate(this.angle);
        /* setting up what we want to be shared to everything */
        // console.log(this.angle);
        var data = {
            x: this.x,
            y: this.y,
            ang: this.angle
        }
        /* SEND IT */
        socket.emit('update', data);

        fill(255, 20, 40, 255); //fills the rect with RGBA 255,20,40,255
        rect(0, 0, 50, 70);
        /* to reset the translated screen to the old value that push() saved */
        pop();
    }
}


/**
 * Checks to see if a key is pressed. Function name is important in p5. 
 * If it a key is pressed it can change the direction of the rect moving
 */
function keyPressed() {
    if (keyIsDown(68)) {
        // console.log("HERE");
        tank.x += speed;
    }
    if (keyIsDown(65)) {
        // console.log("HERE");
        tank.x -= speed;
    }
    if (keyIsDown(87)) {
        // console.log("HERE");
        tank.y -= speed;
    }
    if (keyIsDown(83)) {
        // console.log("HERE");
        tank.y += speed;
    }
}