const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var path = require('path');

const port = (process.env.PORT || 8080);
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

// var path = require('path');
// var express = require('express'),
//     app = express(),
//     server = require('http').createServer(app),
//     io = require('socket.io').listen(server);
//     const port = (process.env.PORT || 4001);
//     server.listen(port);

let numPlayers = 0;
let numSurvivors = 0;
let drop = [];

// setup for database
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://myGamePlayer:need2play@geo-r2rxk.mongodb.net/test?retryWrites=true";
var myDBO;

// connect to database
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    console.log("Database opened!");
    myDBO = db.db("Geo");
    console.log("Database obj is " + myDBO);
});

const updatePlayerInfo = (newData, socketId) => {
    const socketIDObj = {
        socketID: socketId,
    };
    console.log("UPDATING DATA TO " + socketId);
    console.log(newData);
    const preferences = {
        00: newData['00'],
        01: newData['01'],
        02: newData['02'],
        10: newData['00'],
        11: newData['01'],
        12: newData['02'],
        20: newData['00'],
        21: newData['01'],
        22: newData['02'],
    };
    if (myDBO) {
        myDBO.collection("players").updateOne(socketIDObj, { $set: preferences }, { upsert: true }).catch(() => {
            // catch the error
            console.log(err);
        }).then(() => {
            // console.log(newData);
        });
    }
}

const createNewPlayer = (socketID, playerName) => {
    const socketIDObj = {
        socketID: socketID,
    };

    const playerInfo = {
        name: playerName,
    };

    if (myDBO) {
        myDBO.collection("players").updateOne(socketIDObj, { $set: playerInfo }, { upsert: true }).catch(() => {
            // catch the error
            console.log(err);
        }).then(() => {
            // console.log(playerInfo);
        });
    }
}

const closeDB = () => {
    myDBO.close();
}


// app.use(express.static('public/')); 
// app.use(express.static('front-end/public'));
var staticPath = path.join(__dirname, '..', 'front-end', 'build');
app.use("/", express.static(staticPath));
app.use("/gamer*", express.static(__dirname + "/public/index.html"));
app.use("/p5.min.js", express.static(__dirname + "/public/p5.min.js"));
app.use("/addons/p5.dom.min.js", express.static(__dirname + "/public/addons/p5.dom.min.js"));
app.use("/addons/p5.sound.min.js", express.static(__dirname + "/public/addons/p5.sound.min.js"));
app.use("/addons/p5.play.js", express.static(__dirname + "/public/addons/p5.play.js"));
app.use("/sketch.js", express.static(__dirname + "/public/sketch.js"));
app.use("/players.js", express.static(__dirname + "/public/players.js"));
app.use("/Drop.js", express.static(__dirname + "/public/Drop.js"));
app.use("/terrains.js", express.static(__dirname + "/public/terrains.js"));
app.use("/bullets.js", express.static(__dirname + "/public/bullets.js"));
app.use("/map.js", express.static(__dirname + "/public/map.js"));
app.use("/randomNums.txt", express.static(__dirname + "/public/randomNums.txt"));
app.use("/guns.json", express.static(__dirname + "/public/guns.json"));
app.use("/jpgs/*", function(req, res) {
    res.sendFile(path.join(__dirname + '/public/jpgs/' + req.params[0]));
})
app.use("/mp3/*", function(req, res) {
    res.sendFile(path.join(__dirname + '/public/mp3/' + req.params[0]));
})

server.listen(port, () => console.log(`I'm listeni ${port}`))
// server.listen(port, () => console.log(`I'm listening ${port}`))
io.on('connect', (socket) => {

    /* PUT STUFF IN HERE IDNDODODO */
    socket.on('inilizeGame', () => {
        // console.log(socket.id);
        // console.log(data.i);
        // console.log(drop);
        const newData = {
            socketID: socket.id,
            drop: drop
        }
        // console.log(newData);
        socket.emit('init', newData);
    })

    console.log("Connectioned " + socket.id);
    console.log("Port" + socket);

    /** updates each socket, 'socket' will be the user sending the update 
     * @param 'data' will be the data being send
     */
    socket.on('getResults', () => {
        // need to call database
        let stubResults = [{
                Bob: {
                    score: 20,
                    otherData: 5,
                }
            },
            {
                Nick: {
                    score: 30,
                    otherData: 3,
                }
            },
            {
                Mary: {
                    score: 40,
                    otherData: 4,
                }
            }
        ];
        io.emit('results', stubResults);
    });

    socket.on('update', (data) => {
        // console.log(data);
        // console.log(drop.length);
        if (data.drop != -1) {
            drop.splice(data.drop, 1);
        }
        // console.log(data);

        // const newData = {
        //     x: data.tank.x,
        //     y: data.tank.y,
        //     angle: data.tank.angle,
        //     TankAngle: data.tank.TankAngle,
        //     TankStatus: data.tank.TankStatus,
        //     socketID: data.socketID,
        //     bullets: data.tank.bullets,
        //     drop: data.drop
        // }
        if (!(data.TankStatus)) {
            numSurvivors--;
            if ((numPlayers - numSurvivors) == 1) {
                console.log("GAME ENDING");
            }
        }
        // console.log(newData);
        socket.broadcast.emit('data', data); //sends to everyone not including self
    })

    socket.on('hitSomeone', (data) => {
        // console.log("GOT HERE: " + data);
        // socket.broadcast.to(data.socketID).emit('hit', data);
        socket.broadcast.emit('hit', data); //sends to everyone not including self
    })

    socket.on('bulletShot', (data) => {
        socket.broadcast.emit('bulletShot', data); //sends to everyone not including self
    })


    socket.on('putPreferences', (data) => {
        // if (data != NULL) {
        //     console.log("Everything" + data);
        // } 
        console.log("data from preferences");
        console.log(data);
        updatePlayerInfo(data, socket.id);
    })

    socket.on('joinGame', (data) => {
        // if the number of players is less than 3, allow to join
        console.log("JOINING GAME WITH NAME" + data);
        numPlayers++;
        console.log("Num players is " + numPlayers)
        if (numPlayers <= 3) {
            // return url for game
            // data contains the name of the player
            createNewPlayer(socket.id, data);
            socket.emit('joinGameResponse', numPlayers);
        } else {
            // return same url for react page and say to render the same page again
            socket.emit('joinGameResponse', "same");
        }
    })

    socket.on('disconnect', () => {
        console.log("DISCONNECTING");
        const newData = {
            socketID: socket.id
        }
        numPlayers--;
        socket.broadcast.emit('disconnects', newData);
    })

    socket.on('end', () => {
        closeDB();
    })
})

// app.get('/gamer', function(req, res) {
//     // res.sendFile(path.join(__dirname + '/html/accountRecover.html'));
//     // path.join(__dirname + '/html/accountRecover.html')
//     console.log(path.join(__dirname +  '/public/index.html'));
//     res.sendFile(path.join(__dirname +  '/public/index.html'));
//     // res.sendFile('index', { title: 'Hey', message: 'Hello there!' })
//     console.log("/game route called");
//     // res.sendFile(path.join(__dirname + '/public/index.html'));
//     // res.render(path.join(__dirname + '/public/index.html'));
//     // console.log(res.body);
// });

function newDrop() {
    // console.log(drop.length);
    if (drop.length <= 10) {
        let type = ["Armor", "Attack", "Defence"];
        let rare = ["Common", "Rare", "Legendary"];
        const newData = {
            type: Math.floor(Math.random() * Math.floor(8)),
            rare: Math.floor(Math.random() * Math.floor(3)),
            locationX: Math.floor(Math.random() * Math.floor(10000)),
            locationY: Math.floor(Math.random() * Math.floor(10000))
        }
        drop.push(newData);
        io.sockets.emit('Drop', newData);
    }
}