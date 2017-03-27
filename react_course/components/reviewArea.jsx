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
            user_state: "hidden",
            error: null
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
        if (!this.state.user_state) return <div style={{marginTop: "10px"}} className="review_toggle flex-row flex-bet" id="review_toggle">
            Sign in to leave a review.
        </div>;
        if (!this.state.hasReviewed)
            return (<form id="review_form" className="review_form" onSubmit={(e) => { e.preventDefault(); Actions.submitReview(this.props.code, document.getElementById("review_text").value) }}>

                <div className="review_toggle flex-row flex-bet" id="review_toggle" onClick={ () => {
                    var text = document.getElementById("review_area");
                    var footer = document.getElementById("review_footer");
                    var arrow = document.getElementById("popover-arrow");
                    text.classList.toggle("hidden");
                    footer.classList.toggle("hidden");
                    arrow.classList.toggle("hidden");
                }}>
                    Leave a review...
                    <div className="arrow"></div>
                </div>
                <div className="review_wrapper hidden" id="review_area">
                    <div className="flex-row flex-start">
                        <img className="profile_btn" src="/media/user.png" style={{width: "40px", height: "40px", marginTop: "12px", marginLeft: "15px"}}/>
                        <textarea id="review_text" className="review_input" placeholder="Write a review for this course" onInput={ ()=> {
                            var text = document.getElementById("review_text");
                            if (text.value == "") {
                            document.getElementById("review_area").removeAttribute("style");
                            text.removeAttribute("style");
                            return;
                        }
                            if (text.scrollHeight < 93) return;
                            document.getElementById("review_area").setAttribute('style','height:'+(text.scrollHeight+50)+'px');
                            text.setAttribute('style','height:'+text.scrollHeight+'px');
                        }}></textarea>
                    </div>

                </div>
                <div className="review_footer flex-row hidden" id="review_footer">
                    <div className="error">{this.state.error}</div>
                    <div style={{color: "#c0c0c0"}} id="cancel_review" onClick={ () => {
                        document.getElementById("review_area").classList.add("hidden");
                        document.getElementById("popover-arrow").classList.add("hidden");
                        document.getElementById("review_footer").classList.add("hidden");
                    }}>CANCEL</div>
                    <input value="POST" type="submit" style={{color: "#eb5e4b", border: "none", background: "none"}}/>
                </div>

                <div id="popover-arrow" className="popover-arrow_small hidden" style={{marginLeft: "28px", position: "absolute", top: "32px"}}></div>
            </form>);
        else return <div style={{marginTop: "10px"}} className="review_toggle flex-row flex-bet" id="review_toggle">
            You have already reviewed this course.
        </div>;
    }

    render() {
        var hidden = "box"+((this.state.more) ? "": " hidden");
        return <div>
            {this.renderTextArea()}
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

    static months(index) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index];
    }

    constructor() {
        super();
    }

    render() {
        var date = new Date(this.props.review.timestamp);
        var dateString = Review.months(date.getMonth())+" "+date.getDate();
        var delId = "delComment_"+this.props.review._id;
        var user_state = "helpful_btn"+((this.props.review.user_state == "1") ? " helpful_active" : "");
        var active = ((this.props.review.user_state == "1") ? "active1" : "");
        var active2 = ((this.props.review.user_state == "-1") ? "active2" : "");
        var user_state2 = "helpful_btn"+((this.props.review.user_state == "-1") ? " unhelpful_active" : "");
        return <div className="review">
            <div className="flex-row flex-start">
            <img src="/media/user.png" className="profile_btn" style={{width: "40px", height: "40px", marginLeft: "1px"}}/>
            <div className="flex-col detail_box">
            <div className="author">{this.props.review.author}</div>
            <div className="time">{dateString}</div>
        </div>
        </div>
        <div className="content">{this.props.review.content}</div>
        <div className="helpful flex-row flex-start">
            <div className={user_state} onClick={() => { if (!getCurrentUsername()) return; var dir = ((this.props.review.user_state == "1") ? "0" : "1"); Actions.voteReview(this.props.review._id, dir); this.setVote(dir); this.forceUpdate();}}>Helpful</div>
            <label className={active}>{this.props.review.up}</label>
            <div className={user_state2} onClick={() => { if (!getCurrentUsername()) return; var dir = ((this.props.review.user_state == "-1") ? "0" : "-1"); Actions.voteReview(this.props.review._id, dir); this.setVote(dir); this.forceUpdate();}}>Unhelpful</div>
            <label className={active2}>{this.props.review.down}</label>
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

var getCurrentUsername = function () {
    var keyValuePairs = document.cookie.split('; ');
    for(var i in keyValuePairs){
        var keyValue = keyValuePairs[i].split('=');
        if(keyValue[0]=== 'username') return keyValue[1];
    }
    return null;
};

module.exports = ReviewArea;