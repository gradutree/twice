import React, { Component } from 'react';
import { render } from 'react-dom';

var Store = require('../flux/store.jsx');
var Actions = require('../flux/actions.jsx');

class RecommendView extends Component {

    constructor() {
        super();
        this.state = {
            courses: {}
        };
    }

    componentDidMount() {
        // load user info and keep it in the store
        this.OnChange = this._onChange.bind(this);
        Store.addChangeListener(this.OnChange);
        Actions.loadRec(this.props.code);
    }

    componentWillUnmount() {

        Store.removeChangeListener(this.OnChange);

    }

    _onChange() {
        this.setState(Store.getRec());
    }

    render() {
        return <div className="rec_container">
            People also took:
            {Object.keys(this.state.courses).map(function (item) {
                return <div key={item}><a href={"/course/"+item}>{item}</a>{" - "+Math.round(this.state.courses[item])+"%"}</div>
            }.bind(this))}
        </div>;
    }
}

module.exports = RecommendView;