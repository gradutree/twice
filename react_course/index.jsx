import React, { Component } from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import CourseView from "./components/courseView.jsx";
import StatusBox from "./components/statusBox.jsx";
import CoursePath from "./components/coursePath.jsx";
import ReviewArea from "./components/reviewArea.jsx";


const App = React.createClass({
    render() {
        return <div>
            <div className="flex-row center_container flex_cent">
                <CourseView code={this.props.match.params.code}/>
                <StatusBox code={this.props.match.params.code}/>
            </div>
            <CoursePath code={this.props.match.params.code}/>
            <ReviewArea code={this.props.match.params.code}/>
        </div>;
    }
});

render(
    <Router>
        <Route path="/course/:code" component={App}/>
    </Router>,
    document.getElementById("content_container")
);