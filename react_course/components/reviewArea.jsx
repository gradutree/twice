import React, { Component } from 'react';
import { render } from 'react-dom';

var Store = require('../flux/store.jsx');
var Actions = require('../flux/actions.jsx');

class ReviewArea extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            page: 0,
            hasReviewed: false,
            user_state: "hidden"
        };
    }

    componentDidMount() {
        // load user info and keep it in the store
        this.OnChange = this._onChange.bind(this);
        Store.addChangeListener(this.OnChange);
        Actions.loadReviews(this.props.code, this.state.page);
    }

    componentWillUnmount() {

        Store.removeChangeListener(this.OnChange);

    }

    _onChange() {

        this.setState(Store.getReviews());
    }

    renderTextArea() {
        if (this.state.user_state == "hidden") return;
        if (!this.state.user_state) return <h4 className="box">Sign in to review this course.</h4>;
        if (!this.state.hasReviewed)
            return (<div className="box review_area"> <label>Write a review</label>
                        <textarea id="content_input" className="comment_area"></textarea>
                <div className="submit_area">
                    <input type="submit" className="btn" />
                </div>
            </div>);
        else return <h4 className="box">You have already reviewed this course.</h4>;
    }

    render() {
        var hidden = "box"+((this.state.more) ? "": " hidden");
        return <div>
            <form id="review_form" onSubmit={(e) => { e.preventDefault(); Actions.submitReview(this.props.code, document.getElementById("content_input").value) }}>
                    {this.renderTextArea()}
            </form>
            <div id="review_container">
                {this.state.data.map(function (item) { return <Review key={item._id} review={item} />; })}
            </div>
            <div className={hidden} onClick={(e) => { Actions.loadReviews(this.props.code, this.state.page+1) }}>
                Show more reviews
            </div>
        </div>;
    }
}

class Review extends Component {

    constructor() {
        super();
    }

    render() {
        var delId = "delComment_"+this.props.review._id;
        var user_state = "box"+((this.props.review.user_state == "1") ? " vote_active" : "")+((this.props.review.user_state) ? "" : " hidden");
        var user_state2 = "box"+((this.props.review.user_state == "-1") ? " vote_active" : "")+((this.props.review.user_state) ? "" : " hidden");
        return <div className="comment flex_col">
            <div className="flex-row flex_spaceb">
                <div className="comment_author flex-row flex_start">
                    <img src="/media/user.png"/>
                        <div className="author_name">{this.props.review.author} says:</div>
                        <div id="comment_time">{new Date(this.props.review.timestamp).toLocaleString()}</div>
                </div>
                <div id={delId} className="del_btn">Delete</div>
            </div>
            <div className="comment_message">{this.props.review.content}</div>
            <div className="flex-row">
                <div className={user_state} onClick={() => { var dir = ((this.props.review.user_state == "1") ? "0" : "1"); Actions.voteReview(this.props.review._id, dir); this.setVote(dir); this.forceUpdate();}}>Helpful</div>
                <h4>{this.props.review.up}</h4>
                <div className={user_state2} onClick={() => { var dir = ((this.props.review.user_state == "-1") ? "0" : "-1"); Actions.voteReview(this.props.review._id, dir); this.setVote(dir); this.forceUpdate();}}>Not helpful</div>
                <h4>{this.props.review.down}</h4>
            </div>
        </div>;
    }

    setVote(dir) {
        if (dir == "1") {
            if (this.props.review.user_state == "0") this.props.review.up++;
            else if (this.props.review.user_state == "-1") {
                this.props.review.up++;
                this.props.review.down--;
            }
        } else if (dir == "0") {
            if (this.props.review.user_state == "1") this.props.review.up--;
            else if (this.props.review.user_state == "-1") this.props.review.down--;
        } else {
            if (this.props.review.user_state == "0") this.props.review.down++;
            else if (this.props.review.user_state == "1") {
                this.props.review.up--;
                this.props.review.down++;
            }
        }
        this.props.review.user_state = dir;
    }

}

module.exports = ReviewArea;