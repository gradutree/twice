import React, { Component } from 'react';
import { render } from 'react-dom';

var Store = require('../flux/store.jsx');
var Actions = require('../flux/actions.jsx');

class SearchArea extends Component {
    constructor() {
        super();
        this.state = {
            results: []
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
        this.setState(Store.getResults());
    }

    render() {
        return <div className="search_container">
                <input id="main_input" className="main_input srch_icon" type="text" placeholder="Course code" onInput={() => {Actions.searchCourses(document.getElementById("main_input").value); }}/>
                <div className={"search_results"+((this.state.results.length == 0) ? " hidden" : "")}>
                    <div className="result_label">Results</div>
                    {this.state.results.map(function (item) {
                        return <Result key={item._id} course={item}/>
                    })}
                    </div>
            </div>;
    }
}

class Result extends Component {

    render() {
        return <div className="card" style={{cursor: "pointer"}} onClick={() => { window.location.href = "/course/"+this.props.course.code;}}>
            <div className="card_container">
                <div className="flex-row flex-bet" style={{height: "30px"}}>
                    <label className="name">{this.props.course.code}</label>
                    <div>
                        <label className="tag">{this.props.course.code.substring(0,2)}</label>
                    </div>
                </div>

                <div className="desc">{this.props.course.name}</div>
            </div>

            <div className="footer flex-row flex-bet">
                <div className="flex-row flex-start">
                    <div className="like_small"></div> {this.props.course.liked}
                </div>
                <div className="flex-row flex-start">
                    <div className="comment"></div> {this.props.course.commentCount}
                </div>
            </div>

        </div>;
    }
}

module.exports = SearchArea;