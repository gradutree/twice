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
		// Make sure that user and the course info has been loaded first
		if (this.props.user && this.state.course){
			actions.setAllCourses(this.props.user.username, this.state.course.code);
		}
	}

	setTaken(){
		// Make sure that user and the course info has been loaded first
		if (this.props.user && this.state.course){
			actions.setTaken(this.props.user.username, this.state.course.code);
		}
	}

	deleteAllCourses(){
		// Make sure that user and the course info has been loaded first
		if (this.props.user && this.state.course){
			actions.deleteAllCourses(this.props.user.username, this.state.course.code);
			console.log(this.state.course.preq);
		}
	}

	deleteTaken(){
		// Make sure that user and the course info has been loaded first
		if (this.props.user && this.state.course){
			actions.deleteTaken(this.props.user.username, this.state.course.code);
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
					{(this.props.isTaken) ? 
						(<div className='popup_buttons'>
							<button type="button" className="btn btn-danger popup_remove_btn" 
								onClick={this.deleteTaken.bind(this)}>
								Remove Course From Taken Courses
							</button>
						</div>)
						:
						((this.props.isAllCourses) ? 
							(<div className='popup_buttons'>
								<button type="button" className="btn btn-danger popup_remove_btn"
									onClick={this.deleteAllCourses.bind(this)}>
									Remove Course From Plan
								</button>
							</div>)
							: (<div className='popup_buttons'>
									<button type="button" className="btn btn-warning popup_will_take_course_btn"
										onClick={this.setAllCourses.bind(this)}>I Will Take This Course</button>
									<button type="button" className="btn btn-success popup_took_course_btn" 
										onClick={this.setTaken.bind(this)}>I Took This Course</button>
								</div>)
						) 
					}
				</div>;
	}
}

export default CourseInfo;