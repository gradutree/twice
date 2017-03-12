import React, { Component } from 'react';
import { render } from 'react-dom';

import SearchResult from "./components/searchResult.jsx";

const tabStyle = {
	display: 'flex',
	flexDirection: 'row',
};

const headerStyle = {
	flexGrow: 10,
};

const searchDivStyle = {
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
};

const inputStyle = {
	flexGrow: 1,
};

const dropdownStyle = {
	flexGrow: 1,
};

const resultStyle = {
	marginTop: '60px',
};

class Search extends Component {
	constructor(){
		super();
		this.state = {
			school: 'UTSC'
		};
	}

	changeSchool(e){
		this.setState({school: e.target.value});
	}

	render() {
		var msg = "Selected " + this.state.school;
		return (<div>
					<div style={tabStyle}> 
						<h3 style={headerStyle}> {msg} </h3>
						<div>
							<input style={inputStyle} placeholder="Search for course" />
							<select value={this.state.school} onChange={this.changeSchool.bind(this)} >
								<option value="UTSC">UTSC</option>
							  	<option value="UTSG">UTSG</option>
							  	<option value="UTM">UTSC</option>
							</select>
						</div>
					</div>
					<div style={resultStyle}>
						<SearchResult />
					</div>
				</div>)
	}
	
}


export default Search;