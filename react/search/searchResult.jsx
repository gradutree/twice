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
		window.location.href = "/course/"+this.props.course.code;
	}
	
	render() {
		this.state.currStyle = this.props.taken ? takenStyle : {backgroundColor: '#ffffff'};

		return <div style={this.state.currStyle} className="search_result_elem" onClick={this.clicked.bind(this)}>
					<h3 className="search_result_name">{this.props.course.title} ({this.props.course.code})</h3>
				</div>;
	}
}


export default SearchResult;