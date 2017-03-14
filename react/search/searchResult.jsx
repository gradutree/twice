import React, { Component } from 'react';
import { render } from 'react-dom';

const takenStyle = {
	backgroundColor: '#e4ffe0'
};

class SearchResult extends Component {
	constructor(){
		super();
		this.state = {
			preq: "N/A", 
			currStyle: null
		};
	}

	clicked(e){
		console.log(this.props.course);
		window.location.href = "/course/"+this.props.course.code;
	}
	
	render() {
		this.state.preq = this.props.course.preq.length > 0 ? this.props.course.preq.join(" / ") : "N/A";
		this.state.currStyle = this.props.taken ? takenStyle : {backgroundColor: '#ffffff'};

		return <div style={this.state.currStyle} className="search_result_elem" onClick={this.clicked.bind(this)}>
					<h3 className="search_result_name">{this.props.course.title} ({this.props.course.code})</h3>
				</div>;
	}
}


export default SearchResult;