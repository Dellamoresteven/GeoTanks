/* Globel Varibles */
// var socket = io();
var socket;
// var w = windowWidth;
// var h = windowHeight;
var speed = 10;
var tank;
var GeoTankLength = 40;
var GoeTankWidth = 30;
var player = [];
var drops = [];

/**
 * This function is the first thing that is called when setting up the program. 
 * I put a super simple program to help you get started. 
 */


function setup() {
    cursor(CROSS);
    // oldData = createVector(0, 0);
    socket = io.connect('http://localhost:4001');
    socket.on('data', newDraw);
    socket.on('bulletUpdate', addNewBullet);
    socket.on('Drop', addNewDrop);
    socket.on('disconnects', disconnectUser);
    socket.on('gameOver', () => {
        console.log("THE GAME ENDED!");
        window.location.href = "http://localhost:3000/results";
    })
    createCanvas(windowWidth, windowHeight);
    tank = new GeoTank();
    // angleMode(DEGREES);
    rectMode(CENTER);
}
/** 
 * @fixed works perfectly with 2 tanks, but once u try to have 3
 * it does some wanky stuff.
 *
 * @params data holds the meta data of the other tanks. 
 */
function newDraw(data) {
    // console.log(data.bullet);
    let newPlayer = true;
    for (var i = 0; i < player.length; i++) {
        if (player[i].SocketID == data.socketID) {
            player[i].setCords(createVector(data.x, data.y));
            player[i].setAngle(data.ang);
            newPlayer = false;
        }
    }
    if (newPlayer) {
        player.push(new Players(data.socketID, data.x, data.y, data.ang));
    }
}

/* Adds someone elses bullet to the canvas */
function addNewBullet(data) {
    for (var i = 0; i < player.length; i++) {
        if (player[i].SocketID == data.socketID) {
            player[i].addNewBullet(data);
        }
    }
}
/**
 * Adds a new drop to a random place in the canvas, this is coded in the server
 * since we want everyone to get the same one at the same time. 
 */
function addNewDrop(data) {
    drops.push(new Drop(data));
}

/**
 * This keeps printing people, because the server is not sending us anyhting if they
 * are not moving, we have to save there position. 
 */
function updateCanvas() {
    for (var i = 0; i < player.length; i++) {
        push();
        translate(player[i].Cords.x, player[i].Cords.y);
        rotate(player[i].Angle);
        fill(0, 180, 150, 255);
        rect(0, 0, GoeTankWidth, GeoTankLength)
        // player[i]
        pop();
        player[i].bullets(tank.x, tank.y);
    }
}

/**
 * Disconnects a user by splcing them from the player array.
 */
function disconnectUser(data) {
    for (var i = 0; i < player.length; i++) {
        if (player[i].SocketID == data.socketID) {
            player.splice(i, 1);
        }
    }
}

/**
 * This is called at 60 FPS, u can change the framerate with frameRate(int) in setup()
 * You want to "repaint" the canvas every time it updates with the new values. 
 */
function draw() {
    background(0); //repaints the background to black
    tank.update(); //calls update in GeoTank
    updateCanvas();
    keyPressed();
}


/**
 * This is the tank object, keeps track of where it is and which way it 
 * moving.
 */
function GeoTank() {
    /* Position */
    this.x = windowWidth / 2;
    this.y = windowHeight / 2;
    this.angle = 0;
    /* this can hold the x,y pos, and the TYPE of projectile that is being shot */
    this.bullets = [];
    this.health = 100;
    this.armor = 0;
    this.update = function() {
        /* displays the current health and armor */
        this.displayHealth();
        /* displays all the drops on the map */
        for (var i = 0; i < drops.length; i++) {
            drops[i].displayDrop(this.x, this.y);
        }
        /* This is to start translating the screen */
        push();
        /* check to make sure they cant go off the screen */
        if ((this.x > windowWidth - GoeTankWidth + 10)) {
            this.x = windowWidth - GoeTankWidth + 10;
        }
        if ((this.x < 0 + GoeTankWidth - 10)) {
            this.x = GoeTankWidth - 10;
        }
        if ((this.y > windowHeight - GeoTankLength + 25)) {

            this.y = windowHeight - GeoTankLength + 25;
        }
        if ((this.y < 0 + GoeTankWidth)) {

            this.y = 0 + GoeTankWidth - 10;
        }
        /* translate the x y plane to be around the rect */
        translate(this.x, this.y);
        /* finding the angle of a vector of the mouseX and mouse Y */
        this.angle = atan2(mouseY - this.y, mouseX - this.x);
        this.angle += PI / 2
        rotate(this.angle);
        /* setting up what we want to be shared to everything */
        var data = {
            x: this.x,
            y: this.y,
            ang: this.angle
        }
        /* SEND IT */
        socket.emit('update', data);

        fill(255, 20, 40, 255); //fills the rect with RGBA 255,20,40,255
        rect(0, 0, GoeTankWidth, GeoTankLength);

        /* to reset the translated screen to the old value that push() saved */
        pop();
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].nextPoint(this.x, this.y, 0);
        }
    }
    this.shoot = function(bulletType) {
        /* maybe when we render the bullets we translate the whole screen to a x-y axis type thing */
        this.bullets.push(new bullet(mouseX, mouseY, this.x, this.y, bulletType));
        let bulletData = {
            mouseX: mouseX,
            mouseY: mouseY,
            x: this.x,
            y: this.y,
            bulletType: bulletType
        }
        socket.emit('newBullet', bulletData);
    }

    this.displayHealth = function() {
        fill(255, 20, 40, 255);
        rect(0, 0, this.health * 5, 30);
        fill(0, 255, 255, 255);
        rect(0, 23, this.armor * 5, 15);
    }
}


/* mouse clicked */
function mouseClicked() {
    tank.shoot("basic");
}

/**
 * Checks to see if a key is pressed. Function name is important in p5. 
 * If it a key is pressed it can change the direction of the rect moving
 */
function keyPressed() {
    if (keyIsDown(68)) {
        tank.x += speed;
    }
    if (keyIsDown(65)) {
        tank.x -= speed;
    }
    if (keyIsDown(87)) {
        tank.y -= speed;
    }
    if (keyIsDown(83)) {
        tank.y += speed;
    }
}

/**
 * Rezises the window when they change the size. P5 shit.
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}