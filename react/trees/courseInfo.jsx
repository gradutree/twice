import React, { Component } from 'react';
import { render } from 'react-dom';

var TreeStore = require("./treeStore.jsx");
var actions = require("./treeActions.jsx");

class CourseInfo extends Component {
	constructor(){
		super();
		this.state = {
			course: null
		};
	}

	_onUpdateCourseInfo(){
		this.setState({course: TreeStore.getCourseInfo()});
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
					<div>Description: {this.state.course ? this.state.course.description : ""}</div>
					<div>Liked: {this.state.course ? this.state.course.liked : ""}</div>
					<div>Disliked: {this.state.course ? this.state.course.disliked : ""}</div>
					<div className="widget flex-row">
						<div className="taken">10k</div>
						<div className="like">10k</div>
						<div className="dislike">10k</div>
					</div>
				</div>;
	}
}

export default CourseInfo;