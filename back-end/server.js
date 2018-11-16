const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 4001;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', socket => {
	console.log("I AM CONNECTED!!!!YAYAYAY!");

	socket.on('disconnect', () => {
		console.log("User Disconnected");
	})
})

server.listen(port, () => console.log(`I'm listening ${port}`))