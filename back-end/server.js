const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var path = require('path');

const port = (process.env.PORT || 8080);
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

let numPlayers = 0;
let numSurvivors = 0;
let numPlayersJoinedGame = 0;
let allPlayerNames = "";
let allPlayerNamesArr = [];
let tempAllPlayerInfo = [];
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

const createNewPlayer = (playername, classtype, optionchosen) => {
    const playerObj = {
        playerName: playername,
    };

    allPlayerNames = allPlayerNames + ";" + playername;
    allPlayerNamesArr.push(playername);
    tempAllPlayerInfo.push({ "playerName": playername, "classType": classtype });

    const playerInfo = {
        classType: classtype,
        option: optionchosen,
    };

    if (myDBO) {
        myDBO.collection("players1").updateOne(playerObj, { $set: playerInfo }, { upsert: true }).catch(() => {
            // catch the error
            console.log(err);
        }).then(() => {
            // console.log(playerInfo);
        });
    }
}

const updateScores = (playername, playerScore) => {
    const playerObj = {
        playerName: playername,
    };

    const playerInfo = {
        score: playerScore === null ? 0 : playerScore,
    }

    console.log("SENDING TO MONGO" + playername + "  " + playerScore);
    for (let i = 0; i < tempAllPlayerInfo.length; i++) {
        if (tempAllPlayerInfo[i]['playerName'] == playername) {
            tempAllPlayerInfo[i]['score'] = playerInfo.score;
        }
    }

    if (myDBO) {
        myDBO.collection("players1").updateOne(playerObj, { "$set": playerInfo }, { upsert: true }).catch(() => {
            // catch the error
            console.log(err);
        }).then(() => {
            console.log(playerInfo);
        });
    }
}

const getPlayerResults = () => {
    console.log("IN GET RESULTS");
    tempAllPlayerInfo.sort((a,b) => b.score - a.score);
    console.log(tempAllPlayerInfo);
    return tempAllPlayerInfo;
}


const closeDB = () => {
    myDBO.close();
}


var staticPath = path.join(__dirname, '..', 'front-end', 'build');
app.use("/", express.static(staticPath));
app.use("/gamer*", express.static(__dirname + "/public/index.html"));
app.use("/p5.min.js", express.static(__dirname + "/public/p5.min.js"));
app.use("/addons/p5.dom.min.js", express.static(__dirname + "/public/addons/p5.dom.min.js"));
app.use("/addons/p5.sound.min.js", express.static(__dirname + "/public/addons/p5.sound.min.js"));
app.use("/addons/p5.play.js", express.static(__dirname + "/public/addons/p5.play.js"));
app.use("/sketch.js", express.static(__dirname + "/public/sketch.js"));
app.use("/players.js", express.static(__dirname + "/public/players.js"));
app.use("/terrains.js", express.static(__dirname + "/public/terrains.js"));
app.use("/bullets.js", express.static(__dirname + "/public/bullets.js"));
app.use("/map.js", express.static(__dirname + "/public/map.js"));
app.use("/shop.js", express.static(__dirname + "/public/shop.js"));
app.use("/abilities.js", express.static(__dirname + "/public/abilities.js"));
app.use("/randomNums.txt", express.static(__dirname + "/public/randomNums.txt"));
app.use("/guns.json", express.static(__dirname + "/public/guns.json"));
app.use("/jpgs/*", function(req, res) {
    res.sendFile(path.join(__dirname + '/public/jpgs/' + req.params[0]));
})
app.use("/mp3/*", function(req, res) {
    res.sendFile(path.join(__dirname + '/public/mp3/' + req.params[0]));
})
app.use("/results*", express.static(staticPath));

server.listen(port, () => console.log(`I'm listeni ${port}`))
io.on('connect', (socket) => {
    console.log(drop.length);
    socket.on('inilizeGame', () => {
        // numPlayers++;
        numPlayersJoinedGame++;
        const newData = {
            socketID: socket.id,
            drop: drop
        }
        socket.emit('init', newData);
    })

    console.log("Connectioned " + socket.id);
    console.log("Port" + socket);
    let x = 0;
    let scoreX = 0;
    let name = "";

    /** updates each socket, 'socket' will be the user sending the update 
     * @param 'data' will be the data being send
     */
    socket.on('getResults', (playerNames) => {
        // need to call database
        let stubResults = [{
                name: "bob",
                score: 20,
                classType: 5,
            },
            {
                name: "nick",
                score: 30,
                otherData: 3,
            },
            {
                name: "mary",
                score: 40,
                otherData: 4,
            }
        ];
        console.log("GETTING THE RESULTS");
        let results = getPlayerResults();
        let high;
        myDBO.collection("players1").find().sort({ score: -1 }).toArray(function(err, result) {
            if (err) throw err;
            console.log("in here");
            console.log(result);
            console.log(result[0]["score"]);
            let highestScore = result[0]["score"];
            let highestName = result[0]["playerName"];
            console.log(highestScore);
            // results has everything so need to only get the relevant results
            for (let i = 0; i < result.length; i++) {
                delete result[i]._id;
                delete result[i].option;
            }
            socket.emit('results', { "scores": results, "highest": highestScore, "highestName": highestName, "history": result });
        });
    });


    // CALL THIS TO SEND THE SCORES
    socket.on('sendScores', (data) => {
        console.log(data);
        updateScores(data['name'], data['score']);

    })

    socket.on('update', (data) => {
        // console.log(data.score);

        // let name = data.name;
        // let score = data.score;
        // updateScores(data.name, data.score);
        // console.log(data);
        // console.log(drop.length);
        if (data.drop != -1) {
            drop.splice(data.drop, 1);
        }
        if (!(data.TankStatus) && (x == 0)) {
            x++;
            console.log("THE NUMBER OF PLAYER IS " + numPlayersJoinedGame + " " + numSurvivors);
            // numSurvivors--;
            numSurvivors--;
            // if (((numPlayers - numSurvivors) == 1) && numPlayers >= 0) {
            if (numPlayersJoinedGame > 1 && numSurvivors == 1) {
                console.log("GAME ENDING");
                // take everyone to results page
                io.sockets.emit('gameDone', allPlayerNames);
                numPlayers = 0;
                numSurvivors = 0;
                numPlayersJoinedGame = 0;
                allPlayerNames = "";
            }
        }
        socket.broadcast.emit('data', data); //sends to everyone not including self        
    })

    socket.on('hitSomeone', (data) => {
        socket.broadcast.emit('hit', data); //sends to everyone not including self
    })

    socket.on('bulletShot', (data) => {
        socket.broadcast.emit('bulletShot', data); //sends to everyone not including self
    })

    socket.on('playerPreferences', (data) => {
        console.log("setting the player preferences")
        console.log(data)
        createNewPlayer(data['playerName'], data['classType'], data['option']);
    })


    socket.on('joinGame', (data) => {
        // if the number of players is less than 3, allow to join
        numPlayers++;
        numSurvivors++;
        tempAllPlayerInfo = [];
        allPlayerNamesArr = [];
        console.log("Num players is " + numPlayers)
        if (numPlayers <= 3) {
            // return the rul for the game
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
        socket.broadcast.emit('disconnects', newData);
    })

    socket.on('end', () => {
        closeDB();
    })

    socket.on('destroyAsteroid', (data) => {
        io.sockets.emit("destroyAsteroid", data);
    })

    socket.on("spawnBarrier", (data) => {
        io.sockets.emit("spawnAsteroid", data);
        drop.push(data);
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

setInterval(newAsteroid, 10000);

function newDrop() {
    // console.log(drop.length);
    let type = ["Armor", "Attack", "Defence"];
    let rare = ["Common", "Rare", "Legendary"];
    const newData = {
        type: Math.floor(Math.random() * Math.floor(8)),
        rare: Math.floor(Math.random() * Math.floor(3))
        // locationX: Math.floor(Math.random() * Math.floor(10000)),
        // locationY: Math.floor(Math.random() * Math.floor(10000))
    }
    // drop.push(newData);
    // io.sockets.emit('Drop', newData);
    return newData;
}

function newAsteroid() {
    // console.log(numPlayers);
    if (numPlayers > 0) {
        const newAst = {
            type: 3,
            hitbox: 50,
            x: Math.floor(Math.random() * Math.floor(1000)),
            y: Math.floor(Math.random() * Math.floor(1000))
        }
        drop.push(newAst);
        io.sockets.emit("spawnAsteroid", newAst);
    }
}