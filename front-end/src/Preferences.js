import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import List from 'react-list-select';
import './Preferences.css';

var port = window.location.href;
class Preferences extends Component {
	constructor(props) {
		
		super(props);
		this.state = {
			endpoint: port + "gamer" + "?name=" + this.props.playerName,
			allTiles: {},
			readyToJoin: false,
			readyToChooseOptions: false,
			optionType: undefined,
			classType: undefined,
			newEndpoint: undefined,
		}
	}

	getNewEndpoint(optionNumber) {
		let newEndpoint = this.state.endpoint;
		newEndpoint = newEndpoint + '?' + this.state.classType + '=' + optionNumber;
		console.log("THE NEW ENDPOINT IS " + newEndpoint);
		return newEndpoint;
	}

	setOptions(optionNumber) {
		let endpoint = this.getNewEndpoint(optionNumber);
		this.setState({
			readyToJoin: true,
			optionType: optionNumber,
			newEndpoint: endpoint,
		});
	}

	getOptionNames() {
		switch(this.state.classType) {
			case 'Bruiser': return ['Shoot like fireworks', 'Place a shield in front of you']; 
			case 'JankTank': return ['Random teleport and takes the damage at that location', 'Place down a turret to fight with you'];
			case 'Scout': return ['300% speed boost', 'Stun gernade'];
			case 'Sniper': return ['Railgun', 'Camo UP! (if touching tree turn invis)'];
			default: return ['','']
		}
	}

	getOptions() {
		let optionNames = this.getOptionNames();
		return (
			<table>
					<tbody>
						<tr>
							<td className = 'options'> <div className = 'card' onClick={()=>this.setOptions('0')}>
									<h3> {optionNames[0]} </h3>
								</div> 
							</td>
							<td className = 'options'> <div className = 'card' onClick={()=>this.setOptions('1')}>
									<h3> {optionNames[1]} </h3>
							</div> 
						</td>
						</tr>
					</tbody>
			</table>
		);
	}

	setClassInfo(typeName) {
		this.setState({
			readyToChooseOptions: true, 
			classType: typeName,
		});
	}

	getClassInfo(typeName) {
		if (typeName == 'Bruiser') {
			return (
				<div className='card' onClick={() => this.setClassInfo('Bruiser')}>
					<h1 className = 'h1Mod'> Bruiser </h1>
					<h3> Secondary shield bar that regens overtime but has a low shield cap </h3>
					<h3> Options: </h3>
					<ul> 
						<li> Shoot like fireworks </li>
						<li> Place a shield in front of you </li>
					</ul>
				</div>
			);
		} else if (typeName == 'Scout') {
			return (
				<div className='card' onClick={() => this.setClassInfo('Scout')}>
					<h1 className = 'h1Mod'> Scout </h1>
					<h3> 50% movment speed </h3>
					<h3> Options: </h3>
					<ul>
						<li> 300% speed boost </li>
						<li> Stun gernade </li>
					</ul>
				</div>
			);
		} 
	}

	getClassTable() {
		return (
			<div>
				<table>
					<tbody>
						<tr>
							<td> {this.getClassInfo('Bruiser')} </td>
							<td> {this.getClassInfo('Scout')} </td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	render() {
		console.log(this.state.allTiles)
		console.log("READY TO JOIN IS " + this.state.readyToJoin)
		if (this.state.readyToJoin == true) {
			return (
			<div> 
				<h1> Hey {this.props.playerName} </h1>
				<a href = {this.state.newEndpoint} className = "Href" > START! </a>
			</div>
			);
		}
		if (this.state.readyToChooseOptions == true){
			return (
				<div>
					<h1> Hey {this.props.playerName} </h1>
					<h2> Choose your ability </h2>
					{this.getOptions()}
				</div>
			);
		}
		return (
			<div> 
				<h1> Hey {this.props.playerName} </h1>
				<h2> Choose a tank type </h2>
				{this.getClassTable()}
			</div>
		);
	}
}

export default Preferences;