import React, { Component } from 'react';
import { render } from 'read-dom';
import {Router, Route, browserHistory} from 'react-router';

class Dashboard extends Component {
	render() {
		return (<H3>Dashboard</h3>);
	}
}


render(
	<Router>
		<Route path="/dashboard" component={Dashboard} history={browserHistory}/>
	</Router>,
	document.getElementById("content_container")
);