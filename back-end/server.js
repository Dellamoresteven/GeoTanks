const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 4001;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

let numPlayers = 0;


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
	};
	if (myDBO) {
		myDBO.collection("players").updateOne(socketIDObj, {$set: coordinates}, {upsert:true}).catch(() =>
		{
			// catch the error
			console.log(err);
		}).then(() => 
		{
			console.log(newData);
		});
	}
}

const closeDB = () => {
	myDBO.close();
}


// middlewares
app.use(express.static('public'));

server.listen(port, () => console.log(`I'm listening ${port}`))
setInterval(newDrop, 1 * 1000);
io.on('connect', (socket) => {
	
	console.log("Connectioned " + socket.id);

	/** updates each socket, 'socket' will be the user sending the update 
	 * @param 'data' will be the data being send
	 */

	socket.on('update', (data) => {
		// console.log(data.bullets);
		const newData = {
			socketID: socket.id,
			x: data.x,
			y: data.y,
			ang: data.ang,
			socketID: socket.id,
			bullet: data.bullets
		}

		// socketID is UNIQUE FOR EVERY PLAYER
		updatePlayerInfo(newData);

		socket.broadcast.emit('data', newData); //sends to everyone not including self
		// console.log
		//io.sockets.emit('data', update); This sends to everyone include itsself
		// console.log('updating! ' + data.x);
	})

	socket.on('newBullet', (data) => {
		const newData = {
			x: data.x,
			y: data.y,
			bulletType: data.bulletType,
			socketID: socket.id,
			mouseX: data.mouseX,
			mouseY: data.mouseY
		}
		socket.broadcast.emit('bulletUpdate', newData);
	})

	socket.on('joinGame', (data) => {
		// if the number of players is less than 4, allow to join
		numPlayers++;
		console.log("Num players is " + numPlayers)
		if (numPlayers <= 4) {
			// return url for game
			socket.emit('joinGameResponse', numPlayers);
		} else {
			// return same url for react page
			socket.emit('joinGameResponse', "same");
		}
	})

	socket.on('disconnect', () => {
		console.log("User Disconnected");
		closeDB();
	})
})
		console.log("DISCONNECTING");
		const newData = {
			socketID: socket.id
		}
		socket.broadcast.emit('disconnects', newData);
	})


})

function newDrop() {
	let type = ["Armor", "Attack", "Defence"];
	let rare = ["Common", "Rare", "Legendary"];
	const newData = {
		type: Math.floor(Math.random() * Math.floor(3)),
		rare: Math.floor(Math.random() * Math.floor(3)),
		locationX: Math.floor(Math.random() * Math.floor(1440)),
		locationY: Math.floor(Math.random() * Math.floor(520))
	}
	io.sockets.emit('Drop', newData);
}

