import React, { Component } from 'react';
import { render } from 'react-dom';

var Store = require('../flux/store.jsx');
var Actions = require('../flux/actions.jsx');

class StatusBox extends Component {

    constructor() {
        super();
        this.state = {
            liked: 0,
            disliked: 0,
            user_state: null,
            hasTaken: false,
            takenCount: 0
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
        var user_state = "like"+((this.state.user_state == "1") ? " like_active" : "");
        var user_state2 = "dislike"+((this.state.user_state == "-1") ? " dislike_active" : "");
        var user_state3 = "taken"+((this.state.hasTaken) ? " taken_active" : "");
        return <div className="widget flex-row">
                <div className={user_state3}>{this.state.takenCount}</div>
                <div className={user_state} onClick={() => { if (!getCurrentUsername()) return; var dir = this.state.user_state == "1" ? "0" : "1"; Actions.vote(this.props.code, dir); }}>{this.state.liked}</div>
                <div className={user_state2} onClick={() => { if (!getCurrentUsername()) return; var dir = this.state.user_state == "-1" ? "0" : "-1"; Actions.vote(this.props.code, dir); }}>{this.state.disliked}</div>
            </div>;
    }
}

var getCurrentUsername = function () {
    var keyValuePairs = document.cookie.split('; ');
    for(var i in keyValuePairs){
        var keyValue = keyValuePairs[i].split('=');
        if(keyValue[0]=== 'username') return keyValue[1];
    }
    return null;
};

module.exports = StatusBox;