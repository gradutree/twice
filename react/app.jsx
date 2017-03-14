import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  IndexRoute
} from 'react-router-dom';

import DashboardContent from "./dashboard/dashboard.jsx";
import TreesContent from "./trees.jsx";
import SearchContent from "./search/search.jsx";

class Dashboard extends Component {
	componentDidMount() {
        render(
			<DashboardContent />,
            document.getElementById("content_container")
        );
	}

	render() {
		return (renderTabs(0));
	}
}

class Trees extends Component {
    componentDidMount() {
        render(
			<TreesContent />,
            document.getElementById("content_container")
        );
    }

	render() {
		return (renderTabs(1));
	}
}

class Search extends Component {
    componentDidMount() {
        render(
			<SearchContent />,
            document.getElementById("content_container")
        );
    }

	render() {
		return (renderTabs(2));
	}
}

class NavTabs extends Component {
	render() {
		return (<div className="opt_tab">
                    <ul className="nav nav-pills">
		                <li role="nav" id="dash_pill" className={this.props.value == 0 ? "active" : ""}><Link to="/dashboard">Dashboard</Link></li>
		                <li role="nav" id="tree_pill" className={this.props.value == 1 ? "active" : ""}><Link to="/trees">Your Trees</Link></li>
		                <li role="nav" id="srch_pill" className={this.props.value == 2 ? "active" : ""}><Link to="/search">Search courses</Link></li>
		            </ul>
                </div>);
	}
}

var renderTabs = function(i) {
	return <NavTabs value={i}/>;
};

const Nav = () => (
	<Router>
		<div>
			<Route path="/dashboard" component={Dashboard}/>
			<Route path="/trees" component={Trees}/>
			<Route path="/search" component={Search}/>


		</div>
	</Router>

);

export default Nav;