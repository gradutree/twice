import React, { Component } from 'react';
import { render } from 'react-dom';
var DashStore = require("./dashStore.jsx");
var actions = require("./dashActions.jsx");

class Dashboard extends Component {

    constructor() {
        super();
        this.state = { user: null };
    }

	componentDidMount() {
		// load user info and keep it in the store
        this.dashOnChange = this._onChange.bind(this);
        DashStore.addChangeListener(this.dashOnChange);
        actions.loadUserData(null);
	}

	componentWillUnmount() {

        DashStore.removeChangeListener(this.dashOnChange);

    }

	render() {
        console.log("render");
		return <div>
					<Program />

                    <h3>{JSON.stringify(this.state)}</h3>
				</div>;
	}

	_onChange() {
        this.setState(getUser());
    }
	
}

function getUser() {
    return {
        user: DashStore.getUserData()
    }
}

function getUserProgram() {
    return {
        program: DashStore.getUserProgram()
    }
}

class Program extends Component {

    constructor() {
        super();
        this.state = { program: null };
    }

    componentDidMount() {

        this.progOnChange = this._onChange.bind(this);
        DashStore.addChangeListener(this.progOnChange);
    }

    componentWillUnmount() {
        DashStore.removeChangeListener(this.progOnChange);
    }

	render() {
        console.log("program");
        return <div>
            <h3>My program: {this.state.program}</h3>
        </div>
	}

	_onChange() {
        this.setState(getUserProgram());
    }
}


export default Dashboard;