
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 4001;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

let numPlayers = 0;

// middlewares
app.use(express.static('public'));

// routes
app.get("/index.html", (req, res) => {
	console.log("WANT INDEX HTML");
	res.redirect("http://192.168.0.10:4001/index.html");
})

server.listen(port, () => console.log(`I'm listening ${port}`))

io.on('connect', (socket) => {
	console.log("I AM CONNECTED!!!!YAYAYAY! " + socket.id);

	/** updates each socket, 'socket' will be the user sending the update 
	 * @param 'data' will be the data being send
	 */

	socket.on('update', (data) => {
		// console.log(data);
		const newData = {
			x: data.x,
			y: data.y,
			ang: data.ang,
			socketID: socket.id
		}
		socket.broadcast.emit('data', newData); //sends to everyone not including self
		// console.log
		//io.sockets.emit('data', update); This sends to everyone include itsself
		// console.log('updating! ' + data.x);
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

	// socket.on('disconnect', () => {
	// 	console.log("User Disconnected");
	// })
})


