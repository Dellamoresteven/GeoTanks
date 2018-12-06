import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
import './Results.css'

// display game over page
class Results extends Component {
	constructor() {
		super();
		let endpoint = window.location.href;
		let endpointParts = endpoint.split(';');
		let playerNames = endpointParts.slice(0);
		this.state = {
  		// the endpoint want to connect to for the server
  			endpoint: window.location.origin, 
  			hasTable: false,
  			table: undefined,
  			names: playerNames,
  		}
	}

	createTable = (results) => {
		let table = [];

		table.push(<tr className = 'resultsRow'>
			<th className = 'resultsHeader'> Name </th>
			<th className = 'resultsHeader'> Score </th>
			<th className = 'resultsHeader'> Class </th>
		</tr>
		);
		// creating parent
		for (let i = 0; i < results.length; i++) {
			let children = [];

			let playerName;
			let it;
			for (it in results[i]) {
				playerName = it;
			}

			// inner loop for children
			let playerInfo = results[i][Object.keys(results[i])[0]];
			children.push(<td> {playerName} </td>);
			let playerProp;

			for (playerProp in playerInfo) {
				children.push(<td> {playerInfo[playerProp]} </td>);
			}

			table.push(<tr className = 'resultsRow'>{children}</tr>);

		}
		return table;
	}

	getResults = () => {
		const socket = socketIOClient(this.state.endpoint);
		socket.emit('getResults', this.state.names);
		console.log("emitting get results");
		let recievedResults;
		let table;
		socket.on('results', results => {
			recievedResults = results;
			table = this.createTable(recievedResults);
			this.setState({table, hasTable: true})
		});
	}

	render() {
		console.log("rendering results");
		if (this.state.hasTable === true) {
			return (
				<div>
					<table className="resultsTable">
						<tbody>
							{this.state.table}
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