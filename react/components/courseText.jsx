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
	
	render() {
		textStyle.color = this.props.userTook ?  "#32cd32" : "#000000";
		return 	<div style={textStyle}>
					{this.props.courseText}
				</div>;
	}
}

export default CourseText;