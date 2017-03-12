import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  IndexRoute
} from 'react-router-dom';

import DashboardContent from "./dashboard.jsx";
import TreesContent from "./trees.jsx";
import SearchContent from "./search.jsx";



class Dashboard extends Component {
	render() {
		//resetTabs();
		//document.getElementById("dash_pill").classList.add("active");
		render(
			<DashboardContent />,
			document.getElementById("content_container")
		);
		return (renderTabs(0));
	}
}

class Trees extends Component {
	render() {
		//resetTabs();
		//document.getElementById("tree_pill").classList.add("active");
		render(
			<TreesContent />,
			document.getElementById("content_container")
		);
		return (renderTabs(1));
	}
}

class Search extends Component {
	render() {
		//resetTabs();
		//document.getElementById("srch_pill").classList.add("active");
		render(
			<SearchContent />,
			document.getElementById("content_container")
		);
		return (renderTabs(2));
	}
}

var resetTabs = function() {
	document.getElementById("dash_pill").classList.remove("active");
	document.getElementById("srch_pill").classList.remove("active");
	document.getElementById("tree_pill").classList.remove("active");
};

class NavTabs extends Component {
	render() {
		return (<div className="opt_tab"><ul className="nav nav-pills">
		  <li role="nav" id="dash_pill" className={this.props.value == 0 ? "active" : ""}><Link to="/dashboard">Dashboard</Link></li>
		  <li role="nav" id="tree_pill" className={this.props.value == 1 ? "active" : ""}><Link to="/trees">Your Trees</Link></li>
		  <li role="nav" id="srch_pill" className={this.props.value == 2 ? "active" : ""}><Link to="/search">Search courses</Link></li>
		</ul></div>);
	}
}

var renderTabs = function(i) {
	return <NavTabs value={i}/>;
}

const Nav = () => (
	<Router>
		<div>
			<Route path="/dashboard" component={Dashboard}/>
			<Route path="/trees" component={Trees}/>
			<Route path="/search" component={Search}/>
			
			
		</div>	
	</Router>

)

export default Nav;