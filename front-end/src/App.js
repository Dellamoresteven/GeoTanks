import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
import Preferences from './Preferences';

// display game beginning page
class App extends Component {
  constructor() {
  	super();
  	this.state = {
  		// the endpoint want to connect to for the server
  		endpoint: "http://localhost:5001/",
  		data: "",
      gotoGame: false,
  	}
  }

  sendJoinGame = () => {
  	// set up socket to emit event
  	console.log("I WANT TO JOIN GAME!!");
  	const socket = socketIOClient(this.state.endpoint)
  	socket.emit('joinGame', this.state.session)
  	socket.on('joinGameResponse', (data) => {
  		console.log("I GOT TO JOIN!" + data)
  		// need to trigger a rerender with new data
  		this.setState({data: data, gotoGame: true})
  	})
  }

  renderRedirect = () => {
    return (
      <div className="App">
        <Preferences className='Preferences' clicked={{'00':1}}/>
      </div>
    );
  }

  render() {
  	console.log("MUST RERENDER" + this.state.data);
    console.log("STATE");
    console.log(this.state);

    if (this.state.gotoGame === true) {
      return (
        <div> 
          {this.renderRedirect()}
        </div>);
    }

    return (
      <div className="App">
      	  <h1 className = "title"> GeoTanks </h1>
      	  <button onClick = {() => this.sendJoinGame()} className = "Button"> Play Game! </button>
      </div>
    );
  }
}

export default App;
