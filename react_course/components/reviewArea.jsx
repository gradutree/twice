import React, { Component } from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link,
    IndexRoute
} from 'react-router-dom';

class ReviewArea extends Component {
    render() {
        return <div className="box review_area">
            <label>Write a review</label>

            <textarea className="comment_area"></textarea>

            <div className="submit_area">
                <input type="submit" className="btn"/>
            </div>
        </div>;
    }
}

module.exports = ReviewArea;