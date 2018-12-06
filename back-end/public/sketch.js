var socket;
var tank;
var player = [];
var asteroids = [];
var drops = [];
var terrains = [];
var BodyOfTank;
var HeadOfTank;
var socketID;
var mouseDownID = -1;
var CoolDown = 0;
var map;
var tireTracksPNG;
var randomNums;
var randomNumList = [];
var gunsList = [];
var guns = {};
var SMGPNG;
var MsixPNG;
var heavyMGPNG;
var rocketPNG;
var SniperPNG;
var playerPicList = [];
var bulletShotArrayMP3 = [];
var playerPreferences = {};
var astroids = [];
var hrefWithoutQueryString = "";
var gui;
var abilityCoolDown = 0;
var baseSpeed = 6;
var shopspeed = 0;
var coinPNG;
var speedupgradeCD = 0;

function preload() {
    // frameRate(30);

    randomNums = loadStrings("randomNums.txt");
    playerPicList.push(loadImage("jpgs/Tank_body-player-1.png"));
    playerPicList.push(loadImage("jpgs/Tank_body-player-2.png"));
    playerPicList.push(loadImage("jpgs/Tank_body-player-3.png"));
    playerPicList.push(loadImage("jpgs/Tank_body-player-4.png"));
    BodyOfTank = loadImage("jpgs/UFO.png");
    HeadOfTank = loadImage("jpgs/Tank_head.png");
    SMGPNG = loadImage("jpgs/LightMachineGun.png");
    MsixPNG = loadImage("jpgs/MachineGun_Basic.png");
    heavyMGPNG = loadImage("jpgs/Heavy_MG.png")
    rocketPNG = loadImage("jpgs/rocket.png")
    SniperPNG = loadImage("jpgs/Sniper.png")
    guns = loadJSON("guns.json");
    bulletShotArrayMP3.push(loadSound("mp3/LAZERS.mp3"));
    bulletShotArrayMP3.push(loadSound("mp3/BasicBulletShot.mp3"));
    bulletShotArrayMP3.push(loadSound("mp3/BasicBulletShot.mp3"));
    bulletShotArrayMP3.push(loadSound("mp3/SMG.mp3"));
    astroids.push(loadImage("jpgs/astroid1.png"));
    coinPNG = loadImage("jpgs/coin.png")
}

/**
 * This function is the first thing that is called when setting up the program. 
 * I put a super simple program to help you get started. 
 */
function getPlayerInfo() {
    let windowHref = window.location.href;
    // console.log("THE HREF IS " + windowHref);
    // hrefWithoutQueryString = windowHref.substr(windowHref.substring(0, windowHref.indexOf('g')));
    // console.log("I am here");
    // console.log("WIHTOUT THE STRING IS " + hrefWithoutQueryString);
    let playerInfo = windowHref.substr(windowHref.indexOf('?') + 1, windowHref.length);
    let nameAndClass = playerInfo.split("?");
    let nameInfo = nameAndClass[0].split('=');
    // console.log("EAFEAEW: " + nameInfo);
    let allPlayerInfo = {};

    allPlayerInfo['playerName'] = nameInfo[1];


    let classInfo = nameAndClass[1].split('=');

    allPlayerInfo['classType'] = classInfo[0];
    allPlayerInfo['option'] = classInfo[1];

    // console.log(allPlayerInfo);
    // returns the class player had chosen with option
    return allPlayerInfo;
}

function seeResults(allPlayerNames) {
    const data = {
        name: playerPreferences['playerName'],
        score: tank.score
    }
    socket.emit("sendScores", data);
    console.log("ALL THE NAMES" + allPlayerNames);
    console.log("HTE ORIGIN PORT IS " + window.location.origin);
    window.location.href = window.location.origin + "/results" + allPlayerNames;
}


function setup() {
    // get all the tiles that the player chose - FOR CURRENT PLAYER

    for (var i = 0; i < randomNums.length; i++) {
        randomNumList.push(parseInt(randomNums[i]));
    }
    map = new MapObjects();
    cursor(CROSS);
    socket = io.connect(window.location.host);

    // sending the player class preferences over

    playerPreferences = getPlayerInfo();
    socket.emit('playerPreferences', playerPreferences);

    // when game ends
    socket.on('gameDone', (allPlayerNames) => seeResults(allPlayerNames));

    socket.on('data', newDraw);
    // socket.on('bulletUpdate', addNewBullet);
    // socket.on('Drop', addNewDrop);
    socket.on('disconnects', disconnectUser);
    socket.on('bulletShot', bulletShot);
    socket.on('init', init);
    socket.on('spawnAsteroid', spawnAsteroid);
    socket.on('destroyAsteroid', destroyAsteroid);
    minusHealth
    socket.on('hit', minusHealth);
    // socket.on('bulletHits', BulletHit);
    // socket.on('Tankkilled', tankKilled);

    createCanvas(windowWidth, windowHeight);
    tank = new GeoTank();
    // angleMode(DEGREES);
    rectMode(CENTER);
    imageMode(CENTER);

    tireTracksPNG = loadImage("jpgs/TireTracks.png")

    // console.log(socket.id);
    socket.emit('inilizeGame');
    setInterval(scoreCounter, 1000);
}
/**
 * init all the varibles we need to init 
 */
function init(data) {
    console.log(data);
    for (var i = 0; i < data.drop.length; i++) {
        console.log("X");
        asteroids.push(new terrain(3, data.drop[i].x, data.drop[i].y, data.drop[i].hitbox));
    }
    socketID = data.socketID;
}

/** 
 * @fixed works perfectly with 2 tanks, but once u try to have 3
 * it does some wanky stuff.
 *
 * @params data holds the meta data of the other tanks. 
 */
function newDraw(data) {
    if (data.drop != -1) {
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
 * This keeps printing people, because the server is not sending us anyhting if they
 * are not moving, we have to save there position. 
 */
function updateCanvas() {
    for (var i = 0; i < player.length; i++) {
        if (player[i].TankStatus) {
            // console.log(player[i].bulletss.length);
            push();
            translate(player[i].x, player[i].y);
            rotate(player[i].rotate += .005);

            image(BodyOfTank, 0, 0, BodyOfTank.width / 5, BodyOfTank.height / 5);

            //image(playerPicList[player[i].playerNum], 0, 0, playerPicList[player[i].playerNum].width / 10, playerPicList[player[i].playerNum].height / 10);
            // rotate(player[i].ang - player[i].TankAng);
            // image(HeadOfTank, 0, 0, HeadOfTank.width / 10, HeadOfTank.height / 10);
            pop();
            // console.log(player[i].bulletss.length);
            for (var j = 0; j < player[i].bulletss.length; j++) {
                player[i].bulletss[j].nextPoint(i, player[i].bulletss, 1);
            }
            // console.log(player[i].bulletss.length);
        }
    }
}


function spawnAsteroid(data) {
    // let newDrop = new Drop(data.x, data.y);
    asteroids.push(new terrain(3, data.x, data.y, data.hitbox));
}

function destroyAsteroid(data) {
    asteroids.splice(data, 1);
}

function checkTerrainCollision() {
    //     camera.position.x = tank.x;
    // camera.position.y = tank.y;

    // tank.y - terrains[i].y
    for (var i = 0; i < terrains.length; i++) {
        var currDist = dist(terrains[i].x, terrains[i].y, tank.x, tank.y)
        if (currDist < terrains[i].hitbox) {
            xDir = abs(tank.x - terrains[i].x);
            yDir = abs(tank.y - terrains[i].y);
            tank.x -= tank.direction.x * xDir / (xDir + yDir) * (6 + (int(terrains[i].hitbox - currDist)));
            tank.y += tank.direction.y * yDir / (xDir + yDir) * (6 + (int(terrains[i].hitbox - currDist)));
        }
    }
    camera.position.x = tank.x;
    camera.position.y = tank.y;
}

function checkPlayerCollision() {
    for (var i = 0; i < player.length; i++) {

        var diffX = player[i].x - tank.x;
        var diffY = player[i].y - tank.y;

        var currDistX = Math.abs(diffX);
        var currDistY = Math.abs(diffY);

        if (currDistX < tank.tankLength && currDistY < tank.tankLength) {
            var relPosX = tank.direction.x * diffX;
            var relPosY = tank.direction.y * diffY;

            if (relPosX > 0) {
                tank.x -= tank.direction.x * (6 + (int(player[i].tankLength - currDistX)));
            }

            if (relPosY < 0) {
                tank.y += tank.direction.y * (6 + (int(player[i].tankLength - currDistY)));
            }
        }
    }
}

function checkBulletCollision() {
    var currDist = 0;
    for (var i = 0; i < player.length; i++) {
        if (player[i].TankStatus) {

            //If other players hit me or another player
            for (var j = 0; j < player[i].bulletss.length; j++) {

                //I get hit
                currDist = dist(player[i].bulletss[j].x, player[i].bulletss[j].y, tank.x, tank.y);
                if (currDist < player[i].bulletss[j].bulletHitBox) {
                    player[i].bulletss[j].dealDamage(i, j);
                    continue;
                }

                var hit_player = 0;

                //Other player gets hit
                for (var k = 0; k < player.length; k++) {
                    if (k != i) {
                        currDist = dist(player[i].bulletss[j].x, player[i].bulletss[j].y, player[k].x, player[k].y);
                        if (currDist < player[i].bulletss[j].bulletHitBox) {
                            player[i].bulletss.splice(j, 1);
                            hit_player = 1;
                            break;
                        }
                    }
                }

                if (hit_player == 1) {
                    break;
                }

                //Hit terrain
                for (var k = 0; k < terrains.length; k++) {
                    currDist = dist(player[i].bulletss[j].x, player[i].bulletss[j].y, terrains[k].x, terrains[k].y);
                    if (currDist < player[i].bulletss[j].bulletHitBox) {
                        player[i].bulletss.splice(j, 1);
                        break;
                    }
                }
            }

            //If I hit other players
            if (tank.TankStatus) {
                for (var k = 0; k < tank.bullets.length; k++) {
                    currDist = dist(tank.bullets[k].x, tank.bullets[k].y, player[i].x, player[i].y);
                    if (currDist < tank.bullets[k].bulletHitBox) {
                        tank.bullets.splice(k, 1);
                    }
                }
            }
        }
    }

    //If I hit other terrain
    if (tank.TankStatus) {
        for (var i = 0; i < tank.bullets.length; i++) {
            for (var j = 0; j < terrains.length; j++) {
                currDist = dist(tank.bullets[i].x, tank.bullets[i].y, terrains[j].x, terrains[j].y);
                if (currDist < tank.bullets[i].bulletHitBox) {
                    if (terrains[j].type == 3) {
                        let a = 0;
                        for (a = 0; a < asteroids.length; a++) {
                            if (JSON.stringify(terrains[j]) === JSON.stringify(asteroids[a])) {
                                break;
                            }
                        }
                        asteroids[a].takeDamage(3, tank.bullets[i].dmg, a);
                    }
                    tank.bullets.splice(i, 1);
                    break;
                }
            }
        }
    }
}

function checkCollisions() {
    checkTerrainCollision();
    checkPlayerCollision();
    checkBulletCollision();
}

function bulletShot(data) {

    // console.log(data);
    for (var i = 0; i < player.length; i++) {
        if (player[i].socketID == data.socketID) {
            player[i].bulletss.push(new bullet(data.type, data.x, data.y, data.intervalX, data.intervalY, data.angle));
            // console.log(player[i].bulletss)
        }
    }
}

/**
 * Adds a new drop to a random place in the canvas, this is coded in the server
 * since we want everyone to get the same one at the same time. 
 */
// function addNewDrop(data) {
//     drops.push(new Drop(data));
// }

function minusHealth(data) {
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
    // console.log(tank.score);
    camera.on();
    camera.zoom = tank.zoom;
    camera.position.x = tank.x;
    camera.position.y = tank.y;
    noStroke();

    background(0); //repaints the background to black
    map.renderMap();
    tank.update(); //calls update in GeoTank
    updateCanvas();
    checkCollisions();
    keyPressed();

    if (mouseIsPressed && (mouseDownID == -1) && guns[tank.wepinUse].auto) {
        mouseDownID = setInterval(AutoMaticShoot, guns[tank.wepinUse].cd);
    }
    if ((mouseDownID != -1) && !mouseIsPressed) {
        clearInterval(mouseDownID);
        mouseDownID = -1;
    }
}


/**
 * This is the tank object, keeps track of where it is and which way it 
 * moving.
 */
function GeoTank() {
    /* Position */
    this.x = windowWidth / 2;
    this.y = windowHeight / 2;

    this.tankLength = int(BodyOfTank.width / 10);

    this.angle = 0;
    /* this can hold the x,y pos, and the TYPE of projectile that is being shot */
    this.bullets = [];
    this.weps = [];
    this.weps.push(0);
    this.wepinUse = 0;
    this.utility = [];
    this.health = 100;
    this.armor = 50;
    this.TankAngle = 0;
    this.TankStatus = true;
    this.moX = mouseX;
    this.moY = mouseY;
    this.zoom = 1.7;
    this.direction = createVector(0, 0);
    this.rotate = 0;
    this.points = 10000;
    this.score = 0;
    this.ability = new ability(playerPreferences["classType"], playerPreferences["option"]);
    console.log(this.ability);
    console.log(playerPreferences['option']);

    this.update = function() {
        if (this.health <= 0) {
            this.TankStatus = false;
        }
        this.moX = mouseX;
        this.moY = mouseY;
        let ch = -1;
        if (this.TankStatus) {
            /* displays the current health and armor */
            this.overLay();
            /* displays all the drops on the map */
            for (var i = 0; i < drops.length; i++) {
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
            // if ((this.x > windowWidth - GoeTankWidth + 10)) {
            //     this.x = windowWidth - GoeTankWidth + 10;
            // }
            // if ((this.x < 0 + GoeTankWidth - 10)) {
            //     this.x = GoeTankWidth - 10;
            // }
            // if ((this.y > windowHeight - GeoTankLength + 25)) {
            //     this.y = windowHeight - GeoTankLength + 25;
            // }
            // if ((this.y < 0 + GoeTankWidth)) {
            //     this.y = 0 + GoeTankWidth - 5;
            // }
            /* translate the x y plane to be around the rect */
            translate(this.x, this.y);
            angleMode(RADIANS);
            /* finding the angle of a vector of the mouseX and mouse Y */
            this.angle = atan2(mouseY - windowHeight / 2, mouseX - windowWidth / 2);
            this.angle += PI / 2;

            /* setting up what we want to be shared to everything */

            fill(255, 20, 40, 255); //fills the rect with RGBA 255,20,40,255
            rotate(this.rotate);
            this.rotate += .005;
            image(BodyOfTank, 0, 0, BodyOfTank.width / 5, BodyOfTank.height / 5);
            /* to reset the translated screen to the old value that push() saved */
            pop();
            for (var i = 0; i < this.bullets.length; i++) {
                this.bullets[i].nextPoint(i, this.bullets, 0);
            }

        } else {
            this.zoom = 1;
            push();
            textSize(20);
            textFont('Helvetica');
            text("You are dead", this.x - 60, this.y - 70);
            pop();
        }
        let data = {
            x: this.x,
            y: this.y,
            angle: this.angle,
            TankAngle: this.TankAngle,
            TankStatus: this.TankStatus,
            socketID: socketID,
            score: this.score,
            name: playerPreferences['playerName'],

            drop: ch
        } // bullets: bulletData,
        socket.emit('update', data);
    }
    this.shoot = function() {
        // console.log("Sjhot");
        let H = sqrt(pow(mouseY - windowHeight / 2, 2) + pow(mouseX - windowWidth / 2, 2)); //PROBLEM HERE!!
        let intervalX = (mouseX - windowWidth / 2) / H; //PROBLERM HERE!!!!
        let intervalY = (mouseY - windowHeight / 2) / H; //PROBLEMM HERE!!!!
        /* maybe when we render the bullets we translate the whole screen to a x-y axis type thing */
        this.bullets.push(new bullet(this.wepinUse, this.x, this.y, intervalX, intervalY, this.angle));
        let dataBullet = {
            socketID: socketID,
            type: this.wepinUse,
            x: this.bullets[this.bullets.length - 1].x,
            y: this.bullets[this.bullets.length - 1].y,
            intervalX: this.bullets[this.bullets.length - 1].intervalX,
            intervalY: this.bullets[this.bullets.length - 1].intervalY,
            angle: this.angle
        }
        // console.log(dataBullet);
        socket.emit('bulletShot', dataBullet);
    }
    this.overLay = function() {
        // console.log(this.health);
        push();
        if (this.armor > 100) {
            this.armor = 100;
        }
        stroke(255, 20, 40);
        fill(255, 20, 40, 50);
        rect((this.x), this.y + 50, 105, 14);
        fill(255, 20, 40, 255);
        let Hbars = this.health / 5;
        let Abars = this.armor / 5;
        let placement = 15;
        // rect((this.x), this.y + 50, 120, 10);
        for (var i = 0; i < Hbars; i++) {
            rect((this.x), this.y + 50, this.health, 10);
            placement += 23;
        }
        stroke(0, 255, 255);
        fill(0, 255, 255, 50);
        rect((this.x), this.y + 67, 105, 14);
        fill(255, 20, 40, 255);
        fill(0, 255, 255, 255);
        stroke(0, 255, 255);
        placement = 15;
        for (var i = 0; i < Abars; i++) {
            rect((this.x), this.y + 67, this.armor, 10);
            placement += 23;
        }
        pop();
        textSize(25);
        let spaceing = 0;
        let textSpace = 0;
        push();
        textSize(9);
        rectMode(CORNER);
        fill(150, 211, 211, 60);
        rect(this.x - 300, this.y + (windowHeight / (2 * this.zoom)) - 40, 600, 70, 10)
        for (var i = 0; i < 5; i++) {
            if (this.wepinUse == i) {
                fill(211, 211, 211, 100);
                ellipse(this.x - 250 + spaceing, this.y + (windowHeight / (2 * this.zoom)) - 25, 25, 25);
            } else {
                fill(211, 211, 211, 50);
                ellipse(this.x - 250 + spaceing, this.y + (windowHeight / (2 * this.zoom)) - 25, 25, 25);
            }
            fill(211, 211, 211, 150);
            text(i + 1, this.x - 260 + spaceing, this.y + (windowHeight / (2 * this.zoom)) - 25);
            if (this.weps.indexOf(i) == -1) {
                text(guns[i].price, this.x - 253 + spaceing, this.y + (windowHeight / (2 * this.zoom)) - 4);
                image(coinPNG, this.x - 260 + spaceing, this.y + (windowHeight / (2 * this.zoom)) - 7, coinPNG.width / 50, coinPNG.height / 50);
            }
            spaceing += 90;
        }
        textSize(15);
        // text("Shop(i)", this.x + 120, this.y + (windowHeight / (2 * this.zoom)) - 45);
        text("Ability(e)", this.x + 240, this.y + (windowHeight / (2 * this.zoom)) - 25);
        // image(tireTracksPNG, 0, 0, tireTracksPNG.width / 5, tireTracksPNG.height / 5);

        text("SpeedUpgrade(g)", this.x + 180, this.y + (windowHeight / (2 * this.zoom)) - 10);

        fill("#FFD700");
        text("Cash: " + this.points, this.x - ((windowWidth) / (2 * this.zoom)) + 20, this.y - ((windowHeight) / (2 * this.zoom)) + 20);
        pop();
    }
}


/* mouse clicked */
function mouseClicked() {

    if (tank.TankStatus && mouseIsPressed && guns[tank.wepinUse].auto) {
        // bulletShotMP3.play();
        tank.shoot();
        return;
    }

    if (tank.TankStatus && !mouseIsPressed && (CoolDown == 0)) {
        CoolDown = setInterval(realeaseCD, guns[tank.wepinUse].cd);
        // bulletShotMP3.play();
        tank.shoot();
    }
}


function realeaseCD() {
    clearInterval(CoolDown);
    CoolDown = 0;
}


function AutoMaticShoot() {
    // 
    tank.shoot();
}

/**
 * I WANT THIS TO MAKE DUST, I HATE GRAPHICSFSAEF 
 * - Stevne Dellamroe
 */
function DisplayDust(x, y) {
    ellipse(x, y, 2, 2);
}


function DisplayTracks(x, y, rot) {
    // push();
    // translate(x, y);
    // angleMode(RADIANS)
    // rotate(rot);
    // tint(255, 180);
    // image(tireTracksPNG, 0, 0, tireTracksPNG.width / 5, tireTracksPNG.height / 5);
    // pop();
}
/**
 * Checks to see if a key is pressed. Function name is important in p5. 
 * If it a key is pressed it can change the direction of the rect moving
 */

function keyPressed() {
    // console.log(tank.direction.x + ":" + tank.direction.y);
    if (tank.TankStatus) {
        if (keyIsDown(68)) {
            tank.direction.x = 1;
            // checkTerrainCollision();
            tank.x += (baseSpeed + shopspeed);
            // checkTerrainCollision();
            tank.TankAngle = 80;
        } else if (keyIsDown(65)) {
            tank.direction.x = -1;
            tank.TankAngle = 80;
            tank.x -= (baseSpeed + shopspeed);
            // checkTerrainCollision();
        } else {
            tank.direction.x = 0;
        }
        if (keyIsDown(87)) {
            tank.direction.y = 1;
            DisplayTracks(tank.x + 28, tank.y + 40, 0);
            DisplayTracks(tank.x - 28, tank.y + 40, 0);
            tank.TankAngle = 0;
            tank.y -= (baseSpeed + shopspeed);
            // checkTerrainCollision();
        } else if (keyIsDown(83)) {
            tank.direction.y = -1;


            DisplayTracks(tank.x + 28, tank.y - 40, PI);
            DisplayTracks(tank.x - 28, tank.y - 40, PI)
            tank.TankAngle = 0;
            tank.y += (baseSpeed + shopspeed);
            // checkTerrainCollision();
        } else {
            tank.direction.y = 0;
        }
        //basic
        if (keyIsDown(49)) {
            if (tank.weps.indexOf(0) != -1) {
                tank.wepinUse = 0;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            }
        }
        //lazer
        if (keyIsDown(50)) {
            if (tank.weps.indexOf(1) != -1) {
                tank.wepinUse = 1;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            } else {
                if (tank.points >= 50) {
                    tank.weps.push(1);
                    tank.points -= 50;
                }
            }
        }

        if (keyIsDown(51)) {
            if (tank.weps.indexOf(2) != -1) {
                tank.wepinUse = 2;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            } else {
                if (tank.points >= 100) {
                    tank.weps.push(2);
                    tank.points -= 100;
                }
            }
        }
        if (keyIsDown(52)) {
            if (tank.weps.indexOf(3) != -1) {
                tank.wepinUse = 3;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            } else {
                if (tank.points >= 500) {
                    tank.weps.push(3);
                    tank.points -= 500;
                }
            }
        }
        if (keyIsDown(53)) {
            if (tank.weps.indexOf(4) != -1) {
                tank.wepinUse = 4;
                clearInterval(mouseDownID);
                mouseDownID = -1;
            } else {
                if (tank.points >= 1000) {
                    tank.weps.push(4);
                    tank.points -= 1000;
                }
            }
        }

        if (keyIsDown(71)) {
            if ((tank.points >= 30) && speedupgradeCD == 0) {
                shopspeed += .5;
                tank.points -= 30;
                speedupgradeCD = setInterval(speedCDClear, 1000);

            }
        }

        // if (keyIsDown(52)) {
        //     // console.log("PRESSED");
        //     if (tank.weps.indexOf(3) != -1) {
        //         tank.wepinUse = 3;
        //         clearInterval(mouseDownID);
        //         mouseDownID = -1;
        //     }
        // }
        // if (keyIsDown(53)) {
        //     if (tank.weps.indexOf(4) != -1) {
        //         tank.wepinUse = 4;
        //         clearInterval(mouseDownID);
        //         mouseDownID = -1;
        //     }
        // }
        // if (keyIsDown(54)) {
        //     if (tank.weps.indexOf(5) != -1) {
        //         tank.wepinUse = 5;
        //         clearInterval(mouseDownID);
        //         mouseDownID = -1;
        //     }
        // }
        /* FOR TESTING -- press 0 to get all guns */
        if (keyIsDown(48)) {
            // console.log(guns.length);
            for (var i = 0; i < Object.keys(guns).length; i++) {
                tank.weps.push(i);
            }
        }
        if (keyIsDown(189)) {
            tank.zoom -= .01;
        }
        if (keyIsDown(187)) {
            tank.zoom += .01;
        }
        if (keyIsDown(72)) {
            tank.health -= 10;
        } //http://keycode.info
        if (keyIsDown(73)) {
            // displayShop();
        }
        if (keyIsDown(69)) {
            if (abilityCoolDown == 0) {
                tank.ability.useActive();
                abilityCoolDown = setInterval(abilityCD, 5000);
            }
        }
        camera.position.x = tank.x;
        camera.position.y = tank.y;
    } else {
        if (keyIsDown(68)) {
            tank.x += 10;
            tank.TankAngle = 80;
        }
        if (keyIsDown(65)) {
            tank.x -= 10;
        }
        if (keyIsDown(87)) {
            tank.y -= 10;
        }
        if (keyIsDown(83)) {
            tank.y += 10;
        }
        camera.position.x = tank.x;
        camera.position.y = tank.y;
    }
}

function speedCDClear() {
    clearInterval(speedupgradeCD);
    speedupgradeCD = 0;
}

function scoreCounter() {
    if (tank.TankStatus) {
        tank.score += 8;
    }
}

function abilityCD() {
    clearInterval(abilityCoolDown);
    abilityCoolDown = 0;
}


/**
 * Rezises the window when they change the size. P5 shit.
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}