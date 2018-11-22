import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client'
import { Redirect, Router, Route, Switch } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom';

class App extends Component {
  constructor() {
  	super();
  	this.state = {
  		// the endpoint want to connect to for the server
  		endpoint: "localhost:4001/",
  		data: "",
      gotoGame: false,
      endGame: false,
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
      <h1> You have joined! </h1>
      <a href = "http://localhost:4001" className = "Href" > START! </a>
      </div>
    );
  }

  render() {
  	console.log("MUST RERENDER" + this.state.data);
    if (this.state.endGame === true) {
      return (
          <div className = "App">
            SCORES - need to put in scores here
            Make db call
            Highest score:
            <table>

            </table>
          </div>
      );
    }
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
