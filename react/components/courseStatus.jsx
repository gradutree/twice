import React, { Component } from 'react';
import { render } from 'react-dom';


class CourseStatus extends Component {
	
	render() {
		return 	<div className="widget flex-row">
					<div className="taken">{this.props.taken}</div>
					<div className="like">{this.props.likes}</div>
					<div className="dislike">{this.props.dislikes}</div>
				</div>;
	}
}

export default CourseStatus;