
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 4001;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

server.listen(port, () => console.log(`I'm listening ${port}`))

io.on('connection', socket => {
	console.log("I AM CONNECTED!!!!YAYAYAY! " + socket.id);
	/** updates each socket, 'socket' will be the user sending the update 
	 * @param 'data' will be the data being send
	 */
	socket.on('update', (data) => {
		// console.log(data);
		socket.broadcast.emit('data', data); //sends to everyone not including self
		// console.log
		//io.sockets.emit('data', update); This sends to everyone include itsself
		// console.log('updating! ' + data.x);
	})
	// socket.on('disconnect', () => {
	// 	console.log("User Disconnected");
	// })
})




app.use(express.static('public'));