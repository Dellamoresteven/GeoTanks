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
			allTiles: {},
			readyToJoin: false,
			readyToChooseOptions: false,
			optionType: undefined,
			classType: undefined,
			newEndpoint: undefined,
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
			case 'Bruser': return ['Shoot like fireworks', 'Place a shield in front of you']; 
			case 'JankTank': return ['Random teleport and takes the damage at that location', 'Place down a turret to fight with you'];
			case 'Scout': return ['300% speed boost', 'Stun gernade'];
			case 'Sniper': return ['Railgun', 'Camo UP! (if touching tree turn invis)'];
			default: return ['','']
		}
	}

	getOptions() {
		let optionNames = this.getOptionNames();
		return (
			<div>
				<ul>
					<li> <button onClick={()=>this.setOptions('0')}> {optionNames[0]} </button> </li>
					<li> <button onClick={()=>this.setOptions('1')}> {optionNames[1]} </button> </li>
				</ul>
			</div>
		);
	}

	setClassInfo(typeName) {
		this.setState({
			readyToChooseOptions: true, 
			classType: typeName,
		});
	}

	getClassInfo(typeName) {
		if (typeName == 'Bruser') {
			return (
				<div onClick={() => this.setClassInfo('Bruser')}>
					<h1> Bruzer </h1>
					<h3> Secondary shield bar that regens overtime but has a low shield cap </h3>
					<h3> Options: Shoot like fireworks, Place a shield in front of you </h3>
				</div>
			);
		} else if (typeName == 'JankTank') {
			return (
				<div onClick={() => this.setClassInfo('JankTank')}>
					<h1> JankTank </h1>
					<h3> Take dmg, and do more dmg based on missing health </h3>
					<h3> Options: Random teleport and takes the damage at that location, Place down a turret to fight with you </h3>
				</div>
			);
		} else if (typeName == 'Scout') {
			return (
				<div onClick={() => this.setClassInfo('Scout')}>
					<h1> Scout </h1>
					<h3> 50% movment speed </h3>
					<h3> Options: 300% speed boost, Stun gernade </h3>
				</div>
			);
		} else if (typeName == 'Sniper') {
			return (
				<div onClick={() => this.setClassInfo('Sniper')}>
					<h1> Sniper </h1>
					<h3> Larger zoom </h3>
					<h3> Options: Railgun, Camo UP! (if touching tree turn invis) </h3>
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
							<td> {this.getClassInfo('Bruser')} </td>
							<td> {this.getClassInfo('JankTank')} </td>
							<td> {this.getClassInfo('Scout')} </td>
							<td> {this.getClassInfo('Sniper')} </td>
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
				<h4> Choose a tank type </h4>
				{this.getOptions()}
				<a href = {this.state.newEndpoint} className = "Href" > START! </a>
			</div>
			);
		}
		if (this.state.readyToChooseOptions == true){
			return (
				<div>
					<h1> Hey {this.props.playerName} </h1>
					{this.getOptions()}
				</div>
			);
		}
		return (
			<div> 
				<h1> Hey {this.props.playerName} </h1>
				<h4> Choose a tank type </h4>
				{this.getClassTable()}
			</div>
		);
	}
}

export default Preferences;