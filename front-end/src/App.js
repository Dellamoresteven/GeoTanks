import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client'

class App extends Component {
  constructor() {
  	super();
  	this.state = {
  		// the endpoint I want to connect to
  		endpoint: "http://192.168.0.10:4001/"
  	}
  }

  send = () => {
  	// function to send emit event to socket
  	const socket = socketIOClient(this.state.endpoint)

  	// send information to join the game
  	socket.emit('join game')
  }

  render() {
  	// check for any sockets

    return (
      <div className="App">
      	  <h1 className = "title"> GeoTanks </h1>
      	  <button className = "Button"> Play Game! </button>
      </div>
    );
  }
}

export default App;
