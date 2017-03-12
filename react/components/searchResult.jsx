import React, { Component } from 'react';
import { render } from 'react-dom';

const containerStyle = {
	border: '1px solid black',
	maringTop: '1px',
};

class SearchResult extends Component {
	clicked(e){
		console.log(this.props.course);
	}
	
	render() {
		return <div style={containerStyle} onClick={this.clicked.bind(this)}>
					<h3>{this.props.course.code}</h3>
				</div>;
	}
	
}


export default SearchResult;