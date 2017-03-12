import React, { Component } from 'react';
import { render } from 'react-dom';

const containerStyle = {
	border: '1px solid #8e8e8e',
	padding: '5px',
};

const nameStyle = {
	maringTop: '1px',
};

const descriptionStyle = {
	marginTop: '5px',
};

const preqStyle = {
	display: 'flex',
	flexDirection: 'row',
};

const preqTitleStyle = {
	textAlign: 'center',
	height: '30px',
  	lineHeight: '30px',
  	fontSize: '16px',
};

const preqCourseStyle = {
	textAlign: 'center',
	marginLeft: '10px',
	height: '30px',
  	lineHeight: '30px',
};

class SearchResult extends Component {
	constructor(){
		super();
		this.state = {
			preq: "N/A"
		};
	}

	clicked(e){
		console.log(this.props.course);
	}
	
	render() {
		this.state.preq = this.props.course.preq.length > 0 ? this.props.course.preq.join(" / ") : "N/A";
		return <div style={containerStyle} onClick={this.clicked.bind(this)}>
					<h3 style={nameStyle}>{this.props.course.title} ({this.props.course.code})</h3>
					<div style={descriptionStyle}>{this.props.course.description}</div>
					<div style={preqStyle}>
						<div style={preqTitleStyle}>Prerequisites: </div>
						<div style={preqCourseStyle}>{this.state.preq}</div>
					</div>
				</div>;
	}
}


export default SearchResult;