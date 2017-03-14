import React, { Component } from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link,
    IndexRoute
} from 'react-router-dom';

class StatusBox extends Component {
    render() {
        return <div className="status_box">
            <h4>Likes</h4>
            <h4>Dislikes</h4>
            <h4>You're taking this course</h4>
            <h4>X ppl taking this course</h4>
            <h4>Current Prof:...etc</h4>
        </div>;
    }
}

module.exports = StatusBox;