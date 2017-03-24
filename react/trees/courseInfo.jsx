import React, { Component } from 'react';
import { render } from 'react-dom';

import CourseStatus from "../components/courseStatus.jsx";

var TreeStore = require("./treeStore.jsx");
var actions = require("./treeActions.jsx");

class CourseInfo extends Component {
	constructor(){
		super();
		this.state = {
			course: null,
			userTook: false
		};
	}

	_onUpdateCourseInfo(){
		this.setState({course: TreeStore.getCourseInfo()});
	}

	setAllCourses() {
		if (this.props.user && this.state.course){
			actions.setAllCourses(this.props.user.username, this.state.course.code);
		}
	}

	setTaken(){
		if (this.props.user && this.state.course){
			actions.setTaken(this.props.user.username, this.state.course.code);
		}
	}

	componentWillUnmount() {
        TreeStore.removeUpdateCourseInfoListener(this.treeOnUpdateCourseInfo);
    }

	componentDidMount() {
		this.treeOnUpdateCourseInfo = this._onUpdateCourseInfo.bind(this);
	    TreeStore.addUpdateCourseInfoListener(this.treeOnUpdateCourseInfo);
	}
	
	render() {
		return 	<div className="course_info_popup">
					<CourseStatus className="popup_course_status" taken={this.state.course ? 1 : 0}
								  likes={this.state.course ? this.state.course.liked : 0}
								  dislikes={this.state.course ? this.state.course.disliked : 0} />
					<div className="popup_description">Description: {this.state.course ? this.state.course.description : ""}</div>
					<div className='popup_buttons'>
						<button type="button" className="btn btn-primary popup_will_take_course_btn"
							onClick={this.setAllCourses.bind(this)}>I Will Take This Course</button>
						<button type="button" className="btn btn-primary popup_took_course_btn" 
							onClick={this.setTaken.bind(this)}>I Took This Course</button>
					</div>
				</div>;
	}
}

export default CourseInfo;