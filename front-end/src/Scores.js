import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
// import './App.css';	

// display game over page
class Scores extends Component {
	constructor() {
		super();
		this.state = {
  		// the endpoint want to connect to for the server
  			endpoint: "http://localhost:4001/",
  		}
	}

	render() {
		console.log("reached scores");
		return (
			<div>
				I WORKED!!!
			</div>
		);	
	}
}

export default Scores;