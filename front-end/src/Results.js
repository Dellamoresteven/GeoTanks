import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
// import './App.css';	

// display game over page
class Results extends Component {
	constructor() {
		super();
		this.state = {
  		// the endpoint want to connect to for the server
  			endpoint: "http://localhost:4001/",
  		}
	}

	createTable = (results) => {
		console.log("I WAS CALLED!");
		let table = [];

		// creating parent
		for (let i = 0; i < results.length; i++) {
			let children = [];

			// inner loop for children
			for (let j = 0; j < Object.keys(results).length; j++) {
				children.push(<td>{results[i].score}</td>);	
			}

			table.push(<tr>{children}</tr>);

		}
		console.log(table);
		console.log("HERE");
		return <div> <h1> AHH </h1> </div>
	}

	getResults = () => {
		const socket = socketIOClient(this.state.endpoint);
		socket.emit('getResults');
		let recievedResults;
		let table;
		socket.on('results', results => {
			recievedResults = results;
			this.createTable(recievedResults);
		});
	}

	render() {
		console.log("reached results");
		return (
			<div>
				{this.getResults()}
			</div>
		);	
	}
}

export default Results;