import React, { Component } from 'react';
import { render } from 'react-dom';
import { Line } from 'rc-progress';

import CourseText from "../components/courseText.jsx";

class TreeProgressReqCourses extends Component {

	constructor(){
		super();
		this.state = {
			courseDisplay: []
		};
	}

	componentDidMount() {
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
			if(courseSet.length > 1){
				var wasTaken = thisComp.tookCourse(courseSet, thisComp.props.taken);
				console.log(wasTaken);
				displayElems.push(<CourseText className="course_req_name_elem" 
					courseText={"[" + courseSet.join(", ")+"] / "} userTook={wasTaken} />);

			}
			else {
				var wasTaken = thisComp.tookCourse(courseSet, thisComp.props.taken);
				console.log(wasTaken);
				displayElems.push(<CourseText className="course_req_name_elem" 
					courseText={courseSet[0] + " / "} userTook={wasTaken} />);
			}
		});

		this.state.courseDisplay = displayElems;
	}

	// clicko(){
	// 	this.getCourseDisplay();
	// }
	
	render() {
		return 	<div className="list_course_req">
					<div className="course_req_name_elem">Courses: </div>
					<div className="list_course_req">{this.state.courseDisplay}</div>
				</div>;
	}
}

export default TreeProgressReqCourses;