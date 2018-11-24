import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import List from 'react-list-select';
import './Preferences.css';

class Preferences extends Component {
	constructor() {
		super();
		this.state = {
			powers: [
				'Attack',
				'Defense',
				'Utility',
			],
			clicked: new Set([]),
			tileChosen: [],
		}
	}

	getPowerList(tileIndex) {
		return (
			<List
				className='list'
				items={this.state.powers}
				multiple={false}
				onChange={(selected: number) => {
					console.log(selected);
					// this.setState({clicked: this.state.clicked.add()})
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
						</tr>
						<tr>
							<td> {this.getPowerList('10')} </td>
							<td> {this.getPowerList('11')} </td>
						</tr>
						<tr>
							<td> {this.getPowerList('20')} </td>
							<td> {this.getPowerList('21')} </td>
						</tr>
						<tr>
							<td> {this.getPowerList('30')} </td>
							<td> {this.getPowerList('31')} </td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	render() {
		return (
			<div> 
				<h1> Choose your tiles respective to positions on the car! </h1>
				<h4> The Attack tiles impact </h4>
				<h4> The Defense tiles help you defend yourself when getting hit by other GeoTanks </h4>
				<h4> The Utility tiles help you </h4>
				{this.getPowerTable()}
      			<a href = "http://localhost:4001" className = "Href" > START! </a>
			</div>
		);
	}
}

export default Preferences;