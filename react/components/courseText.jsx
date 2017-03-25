import React, { Component } from 'react';
import { render } from 'react-dom';
import { Line } from 'rc-progress';

var notTakenTextStyle = {
	color: "#000000"
}

var takenTextStyle = {
	color: "#32CD32"
}

var toTakeTextStyle = {
	color: "#FFA500"
}

class CourseText extends Component {
	constructor(){
		super();
		this.state = {
			courseText: ""
		};
	}
	
	render() {
		return 	<div style={this.props.userTook ? takenTextStyle : (this.props.takeLater ? toTakeTextStyle : notTakenTextStyle)}>
					{this.props.courseText}
				</div>;
	}
}

export default CourseText;