import React, { Component } from 'react';
import { render } from 'react-dom';

import SearchResult from "./components/searchResult.jsx";
import model from "../frontend/static/js/app/model.js"

class Search extends Component {
	constructor(){
		super();
		this.state = {
			school: 'UTSC', 
			results: []
		};
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
		
		model.searchCourses(e.target.value, callback);
	}

	render() {

		var msg = "Search for " + this.state.school + " courses";
		return (<div>
					<div className="search_banner"> 
						<h3 className="search_header"> {msg} </h3>
						<div className="search_div">
							<input className="search_input" onChange={this.changeResults.bind(this)} placeholder="Search for course" />
							<select className="search_dropdown" value={this.state.school} onChange={this.changeSchool.bind(this)} >
								<option value="UTSC">UTSC</option>
							  	<option value="UTSG">UTSG</option>
							  	<option value="UTM">UTM</option>
							</select>
						</div>
					</div>
					<div className="search_result">
						<h3 id="search_result_header">Search Results</h3>
						{this.state.results}
					</div>
				</div>)
	}
	
}


export default Search;