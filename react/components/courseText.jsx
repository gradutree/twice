import React, { Component } from 'react';
import { render } from 'react-dom';
import { Line } from 'rc-progress';

var textStyle = {
	color: "#000000"
}


class CourseText extends Component {
	constructor(){
		super();
		this.state = {
			courseText: ""
		};
	}

	componentDidMount() {
		// this.setState({percent: determinePercent(this.props.req.courses, this.props.taken)});
		// this.setState({reqCreditsStr: getReqCreditsStr(this.props.req, this.props.taken)});
		// this.setState({reqCoursesStr: getReqCoursesStr(this.props.req)});
	}
	
	render() {
		textStyle.color = this.props.userTook ?  "#54ff7e" : "#000000";
		return 	<div style={textStyle}>
					{this.props.courseText}
				</div>;
	}
}

export default CourseText;