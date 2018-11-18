import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client'

class App extends Component {
  constructor() {
  	super();
  	this.state = {
  		// the endpoint want to connect to for the server
  		endpoint: "http://192.168.0.10:4001/",
  		data: "",
  	}
  }

  sendJoinGame = () => {
  	// set up socket to emit event
  	console.log("I WANT TO JOIN GAME!!");
  	const socket = socketIOClient(this.state.endpoint)
  	socket.emit('joinGame', this.state.session)
  	socket.on('joinGameRsponse', (data) => {
  		console.log("I GOT TO JOIN!" + data)
  		// need to trigger a rerender with new data
  		this.setState({data: data})
  	})
  }

  render() {
  	// socket to check for emmissions from other clients
  	const socket = socketIOClient(this.state.endpoint)

  	console.log("MUST RERENDER" + this.state.data);

    return (
      <div className="App">
      	  <h1 className = "title"> GeoTanks </h1>
      	  <button onClick = {() => this.sendJoinGame()} className = "Button"> Play Game! </button>
      </div>
    );
  }
}

export default App;
