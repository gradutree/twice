import React, { Component } from 'react';
import { render } from 'react-dom';

import SearchResult from "./components/searchResult.jsx";
import model from "../frontend/static/js/app/model.js"

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
	marginTop: '5px',
	flexGrow: 1,
};

const resultStyle = {
	marginTop: '50px',
};

class Search extends Component {
	constructor(){
		super();
		this.state = {
			school: 'UTSC', 
			results: []
		};
		// model.test("HI");
	}

	changeSchool(e){
		this.setState({school: e.target.value});
	}

	changeResults(e){
		var resultCourses = [];
        var thisComp = this;

		const callback = function(err, courses){
			Promise.all(courses.map(function (course) {
                resultCourses.push(<SearchResult key={course.code} course={course} />);
            })).then(function(){
                thisComp.setState({results: resultCourses});
            });
		};
		
		model.test(e.target.value, callback);
	}

	render() {

		var msg = "Selected " + this.state.school;
		return (<div>
					<div style={tabStyle}> 
						<h3 style={headerStyle}> {msg} </h3>
						<div style={searchDivStyle}>
							<input style={inputStyle} onChange={this.changeResults.bind(this)} placeholder="Search for course" />
							<select style={dropdownStyle} value={this.state.school} onChange={this.changeSchool.bind(this)} >
								<option value="UTSC">UTSC</option>
							  	<option value="UTSG">UTSG</option>
							  	<option value="UTM">UTSC</option>
							</select>
						</div>
					</div>
					<div style={resultStyle}>
						<h3>Search Results</h3>
						{this.state.results}
					</div>
				</div>)
	}
	
}


export default Search;