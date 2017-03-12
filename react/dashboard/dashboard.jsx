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

		return <div>
                    <div className="dash_banner">
                        Your GraduTree Dashboard
                    </div>
					<Program />

                    <Spec />
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

function getUserSpec() {
    return {
        spec: DashStore.getUserSpec()
    }
}

class Program extends Component {

    constructor() {
        super();
        this.state = { program: null };
    }

    componentDidMount() {

        this.bindOnChange = this._onChange.bind(this);
        DashStore.addChangeListener(this.bindOnChange);
    }

    componentWillUnmount() {
        DashStore.removeChangeListener(this.bindOnChange);
    }

    render() {

        return <div>
            <div>
                <h4>My program</h4>
            </div>
            <div id="program_box" className="box">
                <h4>{this.state.program ? this.state.program : "-----"}</h4>
            </div>
        </div>
    }

    _onChange() {
        this.setState(getUserProgram());
    }
}

class Spec extends Component {

    constructor() {
        super();
        this.state = { spec: null };
    }

    componentDidMount() {

        this.bindOnChange = this._onChange.bind(this);
        DashStore.addChangeListener(this.bindOnChange);
    }

    componentWillUnmount() {
        DashStore.removeChangeListener(this.bindOnChange);
    }

    render() {

        return <div>
            <div>
                <h4>Specialization</h4>
            </div>
            <div id="program_box" className="box">
                <h4>{this.state.spec ? this.state.spec : "-----"}</h4>
            </div>
        </div>
    }

    _onChange() {
        this.setState(getUserSpec());
    }
}


export default Dashboard;