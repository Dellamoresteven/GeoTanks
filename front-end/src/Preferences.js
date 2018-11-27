import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import List from 'react-list-select';
import './Preferences.css';

var port = window.location.href;
class Preferences extends Component {
	constructor(props) {
		
		super(props);
		this.state = {
			endpoint: port + "gamer",
			powers: [
				'Attack',
				'Defense',
				'Utility',
			],
			// readyToJoin: false,
		}
	}

	handleChange = (selected, tileIndex) => {
		this.props.clicked[tileIndex] = selected;
		console.log(this.props.clicked);
		// number of things that are clicked
		if (Object.keys(this.props.clicked).length == 9) {
			const socket = socketIOClient(port);
			socket.emit('putPreferences', {clicked: this.props.clicked, playerName: this.props.playerName});
			// this.setState({readyToJoin: 'true'});
		}
		// const socket = socketIOClient(port);
		// socket.emit('putPreferences', {clicked: this.props.clicked, playerName: this.props.playerName});
	}

	getPowerList(tileIndex) {
		return (
			<List
				className='list'
				items={this.state.powers}
				multiple={false}
				onChange={(selected: number) => {
					this.handleChange(selected, tileIndex)
				}}
			/>
		);
	}

	getPowerTable() {
		return (
			<div>
				<table>
					<tbody>
						<tr>
							<td> {this.getPowerList('00')} </td>
							<td> {this.getPowerList('01')} </td>
							<td> {this.getPowerList('02')} </td>
						</tr>
						<tr>
							<td> {this.getPowerList('10')} </td>
							<td> {this.getPowerList('11')} </td>
							<td> {this.getPowerList('12')} </td>
						</tr>
						<tr>
							<td> {this.getPowerList('20')} </td>
							<td> {this.getPowerList('21')} </td>
							<td> {this.getPowerList('22')} </td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	render() {
		console.log("READY TO JOIN IS " + this.state.readyToJoin)
		return (
		<div> 
			<h1> Hey {this.props.playerName} </h1>
			<h1> Choose your tiles respective to positions on the car! </h1>
			<h4> Choosing Attack tiles will allow you to hold more weapons </h4>
			<h4> The Defense tiles help you defend yourself when getting hit by other GeoTanks </h4>
			<h4> The Utility tiles give your tank bonus effects </h4>
			<h4> NOTE: If you do not choose a tile, it will default to an utility tile </h4>
			{this.getPowerTable()}
			<a href = {this.state.endpoint} className = "Href" > START! </a>
		</div>
		);
	}
}

export default Preferences;