import React, { Component } from 'react';
import App from './App';
import Results from './Results';
import Game from './Game';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// routing for all the paths
class Routing extends Component {
	constructor(){
		super();
	}

	render() {
		console.log("CALLING THE ROUTING");
		return (
			<Router>
				<div>
					<Route exact path = '/' component={App} />
					<Route path = '/results*' component={Results} />
				</div>
			</Router>
		);
	}
}

export default Routing;