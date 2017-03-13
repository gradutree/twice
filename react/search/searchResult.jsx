import React, { Component } from 'react';
import { render } from 'react-dom';


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
		return <div className="search_result_elem" onClick={this.clicked.bind(this)}>
					<h3 className="search_result_name">{this.props.course.title} ({this.props.course.code})</h3>
					<div className="search_result_desc">{this.props.course.description}</div>
					<div className="search_result_preq">
						<div className="search_result_preq_title">Prerequisites: </div>
						<div className="search_result_preq_course">{this.state.preq}</div>
					</div>
				</div>;
	}
}


export default SearchResult;