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


class CourseView extends Component {

    constructor() {
        super();
        this.state = {
            code: null,
            title: null,
            description: null,
            prerequisites: null
        };
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

    _onChange() {
        this.setState(getCourse());
    }

    render() {
        var hidden = "box page"+(this.state.code ? "" : " hidden_fade");
        return <div className={hidden}>
            <h3>{this.state.code}</h3>

            {this.state.title}
            <div className="desc_box">
                {this.state.description}
            </div>
            <div id="preq_box">
                Prerequisites:
                {this.state.prerequisites}
            </div>

        </div>;
    }
}

function getCourse() {
    return Store.getCourseData();
}

module.exports = CourseView;