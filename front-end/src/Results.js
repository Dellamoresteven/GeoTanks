import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
import './Results.css'

// display game over page
class Results extends Component {
	constructor() {
		super();
		let endpoint = window.location.href;
		let endpointParts = endpoint.split(';');
		console.log("the parts of the endpoint " + endpointParts);
		let playerNames = endpointParts.shift();
		let lastPlayer = endpointParts[endpointParts.length - 1];
		if (lastPlayer[lastPlayer.length - 1] == '/') {
			endpointParts[endpointParts.length - 1] = endpointParts[endpointParts.length - 1].slice(0, -1);
		}
		console.log("the player names recieved is " + endpointParts);
		this.state = {
  		// the endpoint want to connect to for the server
  			endpoint: window.location.origin, 
  			hasTable: false,
  			table: undefined,
  			names: endpointParts,
  			highestScore: 0,
  			highestName: "me",
  			history: 0,
  		}
	}

	createTable = (results) => {
		let table = [];

		table.push(<tr className = 'resultsRow'>
			<th className = 'resultsHeader'> Rank </th>
			<th className = 'resultsHeader'> Name </th>
			<th className = 'resultsHeader'> Class Type </th>
			<th className = 'resultsHeader'> Score </th>
			<th className = 'resultsHeader'> Time Survived (seconds)</th>
		</tr>
		);
		// creating parent
		for (let i = 0; i < results.length; i++) {
			let children = [];
			children.push(<td> {i + 1} </td>);

			// let playerName;
			// let it;
			// for (it in results[i]) {
				// playerName = it;
			// }

			// inner loop for children
			// let playerInfo = results[i][Object.keys(results[i])[0]];
			// children.push(<td> {playerName} </td>);
			let playerProp;
			let playerInfo = Object.assign({},results[i]);

			let currPlayerName = playerInfo.playerName;
			console.log("the current player looking at is" + currPlayerName);
			let inList = false;
			if (this.state.names.includes(currPlayerName)) {
				// create new style if that person was in curr game
				inList = true;
			}

			for (playerProp in playerInfo) {
				children.push(<td> {playerInfo[playerProp]} </td>);
			}

			children.push(<td> {parseInt(parseInt(playerInfo[playerProp] / 8))} </td>); 

			if (inList == true) {
				table.push(<tr className = 'specialRow'> {children} </tr>);
			} else {
				table.push(<tr className = 'resultsRow'> {children} </tr>);
			}
		}
		return table;
	}


	getResults = () => {
		const socket = socketIOClient(this.state.endpoint);
		socket.emit('getResults', this.state.names);
		console.log("emitting get results");
		let recievedResults;
		let table;
		let history;
		let historyTable;
		socket.on('results', data => {
			recievedResults = data["scores"];
			history = data["history"];
			table = this.createTable(recievedResults);
			historyTable = this.createTable(history);
			console.log("recieving these results")
			console.log(data);
			this.setState({table, hasTable: true, highestScore: data["highest"], highestName: data["highestName"], history: historyTable})
		});
	}

	render() {
		console.log("rendering results");
		console.log("the player names are " + this.state.names);
		if (this.state.hasTable === true) {
			return (
				<div>
					<h1> SCORES </h1>
					<table className="resultsTable">
						<tbody>
							{this.state.table}
						</tbody>
					</table>
					<h2> All time highest score is : {this.state.highestScore} by {this.state.highestName}</h2> 
					<h2> See how you place with everyone else </h2>
					<table className="resultsTable">
						<tbody>
							{this.state.history}
						</tbody>
					</table>
				</div>
			);	
		} else {
			this.getResults();
			return (
				<div> 
				</div>
			);
		}

	}
}

export default Results;