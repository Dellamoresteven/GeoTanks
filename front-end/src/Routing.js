import React, { Component } from 'react';
import App from './App';
import Results from './Results';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// routing for all the paths
class Routing extends Component {
	constructor(){
		super();
	}

	render() {
		return (
			<Router>
				<div>
					<Route exact path = '/' component={App} />
					<Route path = '/results' component={Results} />
				</div>
			</Router>
		);
	}
}

export default Routing;