import React, { Component } from 'react';
import { render } from 'react-dom';

// var TreeStore = require("./treeStore.jsx");
// var actions = require("./treeActions.jsx");


class CourseStatus extends Component {
	// constructor(){
	// 	super();
	// 	this.state = {
	// 		course: null
	// 	};
	// }

	// _onUpdateCourseInfo(){
	// 	this.setState({course: TreeStore.getCourseInfo()});
	// }

	// componentWillUnmount() {
 //        TreeStore.removeUpdateCourseInfoListener(this.treeOnUpdateCourseInfo);
 //    }

	// componentDidMount() {
	// 	this.treeOnUpdateCourseInfo = this._onUpdateCourseInfo.bind(this);
	//     TreeStore.addUpdateCourseInfoListener(this.treeOnUpdateCourseInfo);
	// }
	
	render() {
		return 	<div className="widget flex-row">
					<div className="taken">{this.props.taken}</div>
					<div className="like">{this.props.likes}</div>
					<div className="dislike">{this.props.dislikes}</div>
				</div>;
	}
}

export default CourseStatus;