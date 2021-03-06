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
      endpoint: window.location.href, 
      data: "",
      gotoGame: false,
      value: "",
      badName: false,
    }
  }

  sendJoinGame = () => {
    // set up socket to emit event
    let tempStr = this.state.value;
    if (this.state.value == '' || tempStr.includes('=') || tempStr.includes('/') || tempStr.includes('?') || tempStr.includes(';') || tempStr.includes(' ')) {
      console.log("Bad name given")
      this.setState({
        badName: true,
      });
      return;
    }

    if (this.state.value != '' && !tempStr.includes('=') && !tempStr.includes('/') && !tempStr.includes('?') && !tempStr.includes(';') && !tempStr.includes(' ')) {
    	const socket = socketIOClient(this.state.endpoint);
    	socket.emit('joinGame', this.state.value);
    	socket.on('joinGameResponse', (data) => {
        // allowed to save the data
        if (data != "same") {
          // need to trigger a rerender with new data
          this.setState({data: data, gotoGame: true, badName: false})
        }
    	})
    }
  }

  renderRedirect = () => {
    return (
      <div className="App">
        <Preferences
          className='Preferences'
          playerName={this.state.value}
          />
      </div>
    );
  }

  // clicked={{'00':1, '01':1, '02':1,'10':1, '11':1, '12':1, '20':1, '21':1, '22':1}}
  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  render() {
  	console.log("MUST RERENDER" + this.state.data);
    console.log("STATE");
    console.log(this.state);

    if (this.state.badName === true) {
      return (
        <div className="App">
          <h1 className = "title"> AstroLite </h1>
          <div>
                <h2 className = 'h2Mod'> Please enter valid name (only alphanumeric characters) </h2>
            <label>
                <h3 className = 'nameStyle'> Name: </h3>
                <input className='playerName' type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
          </div>
          <button onClick = {() => this.sendJoinGame()} className = "StartButton"> Play Game! </button>
      </div>);
    }

    if (this.state.gotoGame === true) {
      return (
        <div> 
          {this.renderRedirect()}
        </div>);
    }

    return (
      <div className="App">
      	  <h1 className = "title"> AstroLite </h1>
          <div>
            <label>
                <h3 className = 'nameStyle'> Name: </h3>
                <input className='playerName' type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
          </div>
      	  <button onClick = {() => this.sendJoinGame()} className = "StartButton"> Play Game! </button>
      </div>
    );
  }
}

export default App;
