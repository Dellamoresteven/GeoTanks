// var socket = io();
var socket;
// var w = windowWidth;
// var h = windowHeight;
var tank;
var GeoTankLength = 40;
var GoeTankWidth = 30;
var player = [];
var drops = [];
var BodyOfTank;
var HeadOfTank;
var socketID;
var mouseDownID = -1;
var CoolDown = 0;
var map;



/**
 * This function is the first thing that is called when setting up the program. 
 * I put a super simple program to help you get started. 
 */

function setup() {
    map = new MapObjects();
    cursor(CROSS);
    socket = io.connect(window.location.host);
    socket.on('data', newDraw);
    // socket.on('bulletUpdate', addNewBullet);
    socket.on('Drop', addNewDrop);
    socket.on('disconnects', disconnectUser);
    socket.on('init', init);
    minusHealth
    socket.on('hit', minusHealth);
    // socket.on('bulletHits', BulletHit);
    // socket.on('Tankkilled', tankKilled);
    socket.on('gameOver', () => {
        console.log("THE GAME ENDED!");
        window.location.href = "http://localhost:3000/results";
    })
    createCanvas(windowWidth, windowHeight);
    tank = new GeoTank();
    // angleMode(DEGREES);
    rectMode(CENTER);
    imageMode(CENTER);
    BodyOfTank = loadImage("jpgs/Tank_body.png");
    HeadOfTank = loadImage("jpgs/Tank_head.png");

    // console.log(socket.id);
    socket.emit('inilizeGame');
}
/**
 * init all the varibles we need to init 
 */
function init(data) {
    for (var i = 0; i < data.drop.length; i++) {
        addNewDrop(data.drop[i]);
    }
    socketID = data.socketID;
    // console.log(drops);
}

/** 
 * @fixed works perfectly with 2 tanks, but once u try to have 3
 * it does some wanky stuff.
 *
 * @params data holds the meta data of the other tanks. 
 */
function newDraw(data) {
    // console.log(data.bullets);
    //console.log(data);
    if (data.drop != -1) {
        // console.log(data.drop);
        drops.splice(data.drop, 1);
    }
    if (data.socketID != undefined) {
        let newPlayer = true;
        for (var i = 0; i < player.length; i++) {
            if (player[i].socketID == data.socketID) {
                player[i].settank(data);
                newPlayer = false;
            }
        }
        if (newPlayer) {
            player.push(new Players(data));
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

function minusHealth(data) {
    // console.log(data.dmg);
    // console.log(data);
    if (data.socketID == socketID) {
        if (tank.armor < data.dmg) {
            data.dmg -= tank.armor;
            tank.armor = 0;
            if (tank.health <= data.dmg) {
                tank.TankStatus = false;
            } else {
                tank.health -= data.dmg;
            }
        } else {
            tank.armor -= data.dmg;
        }
    }
}

/**
 * This keeps printing people, because the server is not sending us anyhting if they
 * are not moving, we have to save there position. 
 */
function updateCanvas() {
    for (var i = 0; i < player.length; i++) {
        if (player[i].TankStatus) {
            push();
            // console.log(player[i].bulletss.length);
            translate(player[i].x, player[i].y);
            rotate(player[i].TankAng);
            image(BodyOfTank, 0, 0, BodyOfTank.width / 10, BodyOfTank.height / 10);
            rotate(player[i].ang - player[i].TankAng);
            image(HeadOfTank, 0, 0, HeadOfTank.width / 10, HeadOfTank.height / 10);
            pop();
            let x = new bullet(0, 0, 0, 0, 0);
            for (var j = 0; j < player[i].bulletss.length; j++) {
                x.display(player[i].bulletss[j]);
            }
        }
    }
}

/**
 * Disconnects a user by splcing them from the player array.
 */
function disconnectUser(data) {
    for (var i = 0; i < player.length; i++) {
        if (player[i].socketID == data.socketID) {
            player.splice(i, 1);
        }
    }
}


/**
 * This is called at 60 FPS, u can change the framerate with frameRate(int) in setup()
 * You want to "repaint" the canvas every time it updates with the new values. 
 */
function draw() {
    camera.on();
    camera.zoom = tank.zoom;
    camera.position.x = tank.x;
    camera.position.y = tank.y;
    noStroke();
    background("#009933"); //repaints the background to black
    tank.update(); //calls update in GeoTank
    updateCanvas();
    keyPressed();

    if (mouseIsPressed && (mouseDownID == -1) && tank.currentBullet.automatic) {
        mouseDownID = setInterval(AutoMaticShoot, tank.currentBullet.attackSpeed);
    }
    if ((mouseDownID != -1) && !mouseIsPressed) {
        clearInterval(mouseDownID);
        mouseDownID = -1;
    }
    map.renderMap();

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
    this.weps = [];
    this.wepUsing = 7;
    this.currentBullet = new bullet(0, 0, 0, 0, this.wepUsing, socketID);
    this.wepinUse = -1;
    this.utility = [];
    this.health = 100;
    this.armor = 50;
    // this.TankBody = loadImage("jpgs/Tank_body.png");
    // this.TankTop = loadImage("jpgs/Tank_head.png");
    this.basicMgImage = loadImage("jpgs/LightMachineGun.png");
    // this.abilityBar = loadImage("jpgs/Tank_head.png");
    this.TankAngle = 0;
    this.TankStatus = true;
    this.moX = mouseX;
    this.moY = mouseY;
    this.zoom = 2.5;
    this.update = function() {
        // console.log(wep)
        if (this.weps.length != 0) {
            // this.wepUsing = this.weps[this.weps.length - 1];
            this.currentBullet = new bullet(0, 0, 0, 0, this.wepUsing, socketID);
        }
        // console.log(this.wepUsing);
        this.moX = mouseX;
        this.moY = mouseY;
        let ch = -1;
        if (this.TankStatus) {
            /* displays the current health and armor */
            this.displayHealth();
            this.displayWep();
            /* displays all the drops on the map */
            for (var i = 0; i < drops.length - 1; i++) {
                drops[i].displayDrop();
            }

            for (var i = 0; i < drops.length; i++) {
                ch = drops[i].checkDrops(this.x, this.y);
                if (ch != -1) {
                    drops.splice(i, 1);
                    ch = i;
                    break;
                }
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
                this.y = 0 + GoeTankWidth - 5;
            }
            /* translate the x y plane to be around the rect */
            translate(this.x, this.y);
            /* finding the angle of a vector of the mouseX and mouse Y */
            this.angle = atan2(mouseY - displayHeight/2, mouseX -displayWidth/2);
            this.angle += PI / 2;

            /* setting up what we want to be shared to everything */

            fill(255, 20, 40, 255); //fills the rect with RGBA 255,20,40,255
            rotate(this.TankAngle);
            image(BodyOfTank, 0, 0, BodyOfTank.width / 10, BodyOfTank.height / 10);
            rotate(this.angle - this.TankAngle);
            image(HeadOfTank, 0, 0, HeadOfTank.width / 10, HeadOfTank.height / 10);
            // rect(0, 0, GoeTankWidth, GeoTankLength);

            /* to reset the translated screen to the old value that push() saved */
            pop();
            for (var i = 0; i < this.bullets.length; i++) {
                this.bullets[i].nextPoint(this.x, this.y, 0, i, this.bullets, socketID);
            }

        }
        let bulletData = [];
        for (var i = 0; i < this.bullets.length; i++) {
            let bulletIndv = {
                xx: this.bullets[i].xx,
                yy: this.bullets[i].yy,
                angle: this.bullets[i].angle,
                bulletType: this.bullets[i].bulletType,
                explosionState: this.bullets[i].explosionState,
                x: this.bullets[i].x,
                y: this.bullets[i].y
            }

            bulletData.push(bulletIndv);
        }

        // console.log(bulletData);
        let data = {
            x: this.x,
            y: this.y,
            angle: this.angle,
            TankAngle: this.TankAngle,
            TankStatus: this.TankStatus,
            socketID: socketID,
            bullets: bulletData,
            drop: ch
        }
        // console.log("\n\n\n\n\n\n");
        // console.log(data.bullets);




        // var data = {
        //     tank: tank,
        //     socketID: socketID,
        //     drop: ch
        // }
        /* SEND IT */
        socket.emit('update', data);
    }
    this.shoot = function() {
        /* maybe when we render the bullets we translate the whole screen to a x-y axis type thing */
        this.bullets.push(new bullet(mouseX, mouseY, this.x, this.y, this.wepUsing, socketID));
    }
    this.displayHealth = function() {
        if (this.armor > 100) {
            this.armor = 100;
        }
        fill(255, 20, 40, 255);
        // rect(0, 0, this.health * 5, 30);
        let Hbars = this.health / 5;
        let Abars = this.armor / 5;
        let placement = 15;
        for (var i = 0; i < Hbars; i++) {
            rect(placement, 15, 20, 20);
            placement += 23;
        }
        fill(0, 255, 255, 255);
        placement = 15;
        for (var i = 0; i < Abars; i++) {
            rect(placement, 40, 20, 20);
            placement += 23;
        }
    }
    this.displayWep = function() {
        textSize(25);
        let rectSpace = 320;
        let textSpace = 310;
        for (var i = 0; i < 4; i++) {
            if (this.wepinUse == i) {
                fill(0, 0, 0, 150);
                rect(windowWidth - (windowWidth - 65), windowHeight - rectSpace, 120, 75, 10);
                fill(255, 255, 255, 255);
                text(i + 1, windowWidth - (windowWidth - 25), windowHeight - textSpace);
                push();
                translate(windowWidth - (windowWidth - 80), windowHeight - rectSpace);
                rotate(PI / 4);
                image(this.basicMgImage, 0, 0, this.basicMgImage.width / 6, this.basicMgImage.height / 6);
                pop();
            } else {

                fill(0, 0, 0, 80);
                rect(windowWidth - (windowWidth - 65), windowHeight - rectSpace, 120, 75, 10);

                fill(255, 255, 255, 150);
                text(i + 1, windowWidth - (windowWidth - 25), windowHeight - textSpace);
            }
            rectSpace -= 80;
            textSpace -= 80;
        }
    }
}


/* mouse clicked */
function mouseClicked() {

    let typ = new bullet(0, 0, 0, 0, tank.wepUsing, socketID);
    // console.log(typ.automatic);
    if (tank.TankStatus && mouseIsPressed && typ.automatic) {
        tank.shoot();
        return;
    }

    if (tank.TankStatus && !mouseIsPressed && (CoolDown == 0)) {
        CoolDown = setInterval(realeaseCD, tank.currentBullet.attackSpeed);
        tank.shoot();
    }
}


function realeaseCD() {
    // console.log("CLEAR");
    clearInterval(CoolDown);
    CoolDown = 0;
}


function AutoMaticShoot() {
    // let typ = new bullet(0, 0, 0, 0, tank.wepUsing, socketID);
    tank.shoot();
}

/**
 * Checks to see if a key is pressed. Function name is important in p5. 
 * If it a key is pressed it can change the direction of the rect moving
 */
function keyPressed() {
    if (tank.TankStatus) {
        if (keyIsDown(68)) {
            tank.x += 6;
            tank.TankAngle = 80;
        }
        if (keyIsDown(65)) {
            tank.TankAngle = 80;
            tank.x -= 6;
        }
        if (keyIsDown(87)) {
            tank.TankAngle = 0;
            tank.y -= 6;
        }
        if (keyIsDown(83)) {
            tank.TankAngle = 0;
            tank.y += 6;
        }
        if (keyIsDown(49)) {
            if (tank.weps.indexOf(1) != -1) {
                tank.wepinUse = 0;
                tank.wepUsing = 1;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            }
        }
        if (keyIsDown(50)) {
            if (tank.weps.indexOf(2) != -1) {
                tank.wepinUse = 1;
                tank.wepUsing = 2;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            }
        }

        if (keyIsDown(51)) {
            if (tank.weps.indexOf(3) != -1) {
                tank.wepinUse = 2;
                tank.wepUsing = 3;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            }
        }

        if (keyIsDown(52)) {
            if (tank.weps.indexOf(6) != -1) {
                tank.wepinUse = 3;
                tank.wepUsing = 6;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            }
        }
        /* FOR TESTING -- press 0 to get all guns */
        if (keyIsDown(48)) {
            tank.weps.push(1);
            tank.weps.push(2);
            tank.weps.push(3);
            tank.weps.push(6);
        }
    }
}

/**
 * Rezises the window when they change the size. P5 shit.
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}