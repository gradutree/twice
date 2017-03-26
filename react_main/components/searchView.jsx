import React, { Component } from 'react';
import { render } from 'react-dom';
import Masonry from 'react-masonry-component';

var Store = require('../flux/store.jsx');
var Actions = require('../flux/actions.jsx');

var masonryOptions = {
    columnWidth: 4
};

class SearchView extends Component {

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
        return <div>
            <input id="main_input" className="main_input srch_icon" type="text" placeholder="Course name or code" onInput={() => {Actions.searchCourses(document.getElementById("main_input").value); }}/>

                <Masonry
                    className="result_container"
                    elementType="div"
                    options={masonryOptions}
                >
                {this.state.results.map(function (item) {
                    return <Result course={item} key={item._id} />
                })}
                </Masonry>

        </div>;
    }
}

class Result extends Component {

    render() {
        return <div className="card" style={{margin: "5px", cursor: "pointer"}} onClick={() => { window.location.href = "/course/"+this.props.course.code;}}>
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


module.exports = SearchView;