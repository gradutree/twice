import React, { Component } from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link,
    IndexRoute
} from 'react-router-dom';

var Store = require('./store.jsx');
var Actions = require('./actions.jsx');



class CourseView extends Component {

    constructor() {
        super();
        this.state = null;
    }

    componentDidMount() {
        // load user info and keep it in the store
        this.OnChange = this._onChange.bind(this);
        Store.addChangeListener(this.OnChange);
        Actions.loadCourseInfo(this.props.code);
    }

    componentWillUnmount() {

        Store.removeChangeListener(this.OnChange);

    }

    render() {
        var hidden = "box page"+this.state ? " hidden" : "";
        return <div className={hidden}>
            <h3>{this.state.code}</h3>

            {this.state.title}
            <div className="desc_box">
                Programming in an object-oriented language such as Python. Program structure: elementary data types, statements, control flow, functions, classes, objects, methods. Lists; searching, sorting and complexity.  This course is intended for students having a serious interest in higher level computer science courses, or planning to complete a computer science program.
            </div>
            <div id="preq_box">
                Prerequisite: NONE
            </div>

        </div>;
    }
}

module.exports = CourseView;