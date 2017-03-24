import React, { Component } from 'react';
import { render } from 'react-dom';
import { Line } from 'rc-progress';

import CourseText from "../components/courseText.jsx";

var TreeStore = require("./treeStore.jsx");


class TreeProgressReqCourses extends Component {

	constructor(){
		super();
		this.state = {
			courseDisplay: []
		};
	}

	updateProgressReqCourses() {
		this.getCourseDisplay();
	}

	componentWillUnmount() {
        TreeStore.removeProgramChangeListener(this.treeOnProgramChange);
    }

	componentDidMount() {
		this.treeOnProgramChange = this.updateProgressReqCourses.bind(this);
    	TreeStore.addProgramChangeListener(this.treeOnProgramChange);

		this.getCourseDisplay();
	}

	tookCourse(reqs, taken){
		var took = false;
		reqs.forEach(function(elem){
			if(taken.indexOf(elem) >= 0){
				took= true;
			}
		});
		return took;
	}

	getCourseDisplay(){
		var thisComp = this;
		var displayElems = [];
		this.props.req.courses.forEach(function(courseSet){
			var wasTaken = thisComp.tookCourse(courseSet, thisComp.props.taken);
			if(courseSet.length > 1){
				displayElems.push(<CourseText className="course_req_name_elem" key={courseSet}
					courseText={"[" + courseSet.join(", ")+"]"} userTook={wasTaken} />);
				displayElems.push(<div className="course_req_name_elem" key={courseSet+"div"}>/</div>);
			}
			else {
				displayElems.push(<CourseText className="course_req_name_elem" key={courseSet}
					courseText={courseSet[0]} userTook={wasTaken} />);
				displayElems.push(<div className="course_req_name_elem" key={courseSet+"div"}>/</div>);
			}
		});

		this.state.courseDisplay = displayElems;
	}
	
	render() {
		return 	<div className="list_course_req">
					<div className="course_req_name_elem">Courses: </div>
					<div className="list_course_req">{this.state.courseDisplay}</div>
				</div>;
	}
}

export default TreeProgressReqCourses;