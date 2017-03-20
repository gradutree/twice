import React, { Component } from 'react';
import { render } from 'react-dom';
import { Line } from 'rc-progress';


class TreeProgressReq extends Component {
	constructor(){
		super();
		this.state = {
			percent: 0,
			reqCreditsStr: "",
			reqCoursesStr: "",
		};
	}

	clicked(e){
		console.log("treeProgressReq clicked");
		// console.log(this.props.programReq);
	}

	componentDidMount() {
		// console.log("TAKEN = ");
		// console.log(this.props.taken);
		// console.log(this.props.req);
		// console.log(determinePercent(this.props.req.courses, this.props.taken));
		this.setState({percent: determinePercent(this.props.req.courses, this.props.taken)});
		this.setState({reqCreditsStr: getReqCreditsStr(this.props.req, this.props.taken)});
		this.setState({reqCoursesStr: getReqCoursesStr(this.props.req)});
	}
	
	render() {
		return 	<div className="program_req_div" onClick={this.clicked.bind(this)}>
					<div className="program_req_visual">
						<h3 className="program_req_name">Requirement {this.props.reqNum}</h3>
						<div className="program_req_bar">
							<Line percent={this.state.percent} strokeWidth="1" strokeColor="#cee1ff" />
						</div>
					</div>
					<div className="program_reqs_courses">
						<div>{this.state.reqCreditsStr}</div>
						<div>{this.state.reqCoursesStr}</div>
					</div>
					<hr />
				</div>;
	}
}

function coursesTaken(reqs, taken){
	var counter = 0;

	reqs.forEach(function(elem){
		var i = 0;
		for(i = 0; i <elem.length; i++){
			// console.log(elem[i]);
			if(taken.indexOf(elem[i]) >= 0){
				counter++;
				break;
			}
		}
	});

	return counter;
}

function determinePercent(reqs, taken){
	return coursesTaken(reqs, taken) / reqs.length * 100;
}

function getReqCreditsStr(req, taken){
	var reqCreditStr = "Credits needed: " + req.credits + "\tCredits completed: ";
	var creditsTaken = coursesTaken(req.courses, taken) * 0.5;
	reqCreditStr += creditsTaken + "\tCredits left: " + (req.credits - creditsTaken);

	return reqCreditStr;
}

function getReqCoursesStr(req){
	var reqCourseStr = "Courses: ";

	req.courses.forEach(function(courseSet){
		if(courseSet.length > 1){
			reqCourseStr += "[" + courseSet.join(",")+"] / ";
		}
		else {
			reqCourseStr += courseSet[0] + " / ";
		}
	})

	return reqCourseStr;
}

export default TreeProgressReq;