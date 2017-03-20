import React, { Component } from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link,
    IndexRoute
} from 'react-router-dom';

var Store = require('../flux/store.jsx');
var Actions = require('../flux/actions.jsx');

class StatusBox extends Component {

    constructor() {
        super();
        this.state = {
            liked: 0,
            disliked: 0,
            user_state: "0"
        };
    }

    componentDidMount() {
        // load user info and keep it in the store
        this.OnChange = this._onChange.bind(this);
        Store.addChangeListener(this.OnChange);

    }

    componentWillUnmount() {

        Store.removeChangeListener(this.OnChange);

    }

    _onChange() {
        this.setState(Store.getCourseData());
    }

    render() {
        var user_state = "box"+((this.state.user_state == "1") ? " vote_active" : "");
        var user_state2 = "box"+((this.state.user_state == "-1") ? " vote_active" : "");
        return <div className="status_box">
            <div className="flex-row">
                <div className={user_state} onClick={() => { var dir = this.state.user_state == "1" ? "0" : "1"; Actions.vote(this.props.code, dir); }}>Like</div>
                <div className={user_state2} onClick={() => { var dir = this.state.user_state == "-1" ? "0" : "-1"; Actions.vote(this.props.code, dir); }}>Dislike</div>
            </div>
            <h4>{this.state.liked} people liked this course</h4>
            <h4>{this.state.disliked} people disliked this course</h4>
            <h4>You're taking this course</h4>
            <h4>X ppl taking this course</h4>
            <h4>Current Prof:...etc</h4>
        </div>;
    }
}

module.exports = StatusBox;