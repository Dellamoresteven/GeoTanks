import React, { Component } from 'react';
import App from './App';
import Scores from './Scores';
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
					<Route path = '/scores' component={Scores} />
				</div>
			</Router>
		);
	}
}

export default Routing;