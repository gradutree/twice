import React, { Component } from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link,
    IndexRoute
} from 'react-router-dom';

class CoursePath extends Component {
    render() {
        return <div id="path">
            <h4>Path visualization:</h4>
        </div>;
    }

}

module.exports = CoursePath;