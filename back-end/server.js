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

const updatePlayerInfo = (newData) => {
    const socketIDObj = {
        socketID: newData.socketID,
    };
    const coordinates = {
        x: newData.x,
        y: newData.y,
        ang: newData.ang,
        bullet: newData.bullet,
    };
    if (myDBO) {
        myDBO.collection("players").updateOne(socketIDObj, { $set: coordinates }, { upsert: true }).catch(() => {
            // catch the error
            console.log(err);
        }).then(() => {
            // console.log(newData);
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
app.use("/gamer", express.static(__dirname + "/public/index.html"));
app.use("/p5.min.js", express.static(__dirname + "/public/p5.min.js"));
app.use("/addons/p5.dom.min.js", express.static(__dirname + "/public/addons/p5.dom.min.js"));
app.use("/addons/p5.sound.min.js", express.static(__dirname + "/public/addons/p5.sound.min.js"));
app.use("/sketch.js", express.static(__dirname + "/public/sketch.js"));
app.use("/players.js", express.static(__dirname + "/public/players.js"));
app.use("/Drop.js", express.static(__dirname + "/public/Drop.js"));
app.use("/bullets.js", express.static(__dirname + "/public/bullets.js"));
app.use("/jpgs/*", function(req, res) {
    // console.log("HERE: ")
    // console.log(req.params[0]);
    // console.log(__dirname + '/jpgs/' + req.params[0]);
    res.sendFile(path.join(__dirname + '/public/jpgs/' + req.params[0]));
})

server.listen(port, () => console.log(`I'm listeni ${port}`))
// server.listen(port, () => console.log(`I'm listening ${port}`))
setInterval(newDrop, 5 * 10);
io.on('connect', (socket) => {

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
        const newData = {
            x: data.tank.x,
            y: data.tank.y,
            angle: data.tank.angle,
            TankAngle: data.tank.TankAngle,
            TankStatus: data.tank.TankStatus,
            socketID: data.socketID,
            bullets: data.tank.bullets
        }
        // console.log(newData);
        socket.broadcast.emit('data', newData); //sends to everyone not including self
    })

    socket.on('hitSomeone', (data) => {
        // console.log("GOT HERE: " + data);
        // socket.broadcast.to(data.socketID).emit('hit', data);
        socket.broadcast.emit('hit', data); //sends to everyone not including self
    })


    /* PUT STUFF IN HERE IDNDODODO */
    socket.on('inilizeGame', () => {
        // console.log(socket.id);
        // console.log(data.i);
        const newData = {
            socketID: socket.id
        }
        socket.emit('init', newData);
    })

    socket.on('joinGame', (data) => {
        // if the number of players is less than 4, allow to join
        numPlayers++;
        console.log("Num players is " + numPlayers)
        if (numPlayers <= 3) {
            if (numPlayers > 1) {
                numSurvivors = numPlayers;
            }
            // return url for game
            socket.emit('joinGameResponse', numPlayers);
        } else {
            // return same url for react page
            socket.emit('joinGameResponse', "same");
        }
    })

    socket.on('disconnect', () => {
        console.log("DISCONNECTING");
        const newData = {
            socketID: socket.id
        }
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
    let type = ["Armor", "Attack", "Defence"];
    let rare = ["Common", "Rare", "Legendary"];
    const newData = {
        type: Math.floor(Math.random() * Math.floor(7)),
        rare: Math.floor(Math.random() * Math.floor(3)),
        locationX: Math.floor(Math.random() * Math.floor(1440)),
        locationY: Math.floor(Math.random() * Math.floor(800))
    }
    io.sockets.emit('Drop', newData);
}