import React, { Component } from 'react';
import { render } from 'react-dom';

import SearchResult from "./searchResult.jsx";
import model from "../../frontend/static/js/app/model.js"

var SearchStore = require("./searchStore.jsx");
var actions = require("./searchActions.jsx");

class Search extends Component {
	constructor(){
		super();
		this.state = {
			school: 'UTSC', 
			results: [],
			selected: [],
			user: null
		};
	}

	componentDidMount() {
		// load user info and keep it in the store
        this.searchOnChange = this._onChange.bind(this);
        SearchStore.addChangeListener(this.searchOnChange);
        actions.loadUserData(null);
        this.setState(getUser());
	}

	componentWillUnmount() {
        SearchStore.removeChangeListener(this.searchOnChange);
    }

	changeSchool(e){
		this.setState({school: e.target.value});
	}

	changeResults(e){
		// var resultCourses = [];
  //       var thisComp = this;

		// const callback = function(err, courses){
		// 	Promise.all(courses.map(function (course) {
  //               resultCourses.push(<SearchResult key={course.code} course={course} />);
  //           })).then(function(){
  //               thisComp.setState({results: resultCourses});
  //           });
		// };

		actions.getSearchResults(e.target.value);

		// console.log("this.state.result");
		// console.log(this.state.result);
		console.log(SearchStore.getSearchResults());
		// var r = SearchStore.getSearchResults()
		// this.setState({results: SearchStore.getSearchResults()});

		
		// model.searchCourses(e.target.value, callback);
		// console.log("this.state.user")
		// console.log(this.state.user);
	}

	render() {
		var resultCourses = [];
		var msg = "Search for " + this.state.school + " courses";
		return (<div>
					<div className="search_banner"> 
						<h3 className="search_header"> {msg} </h3>

					</div>
					<div className="search_div">
						<input className="search_input" onChange={this.changeResults.bind(this)} placeholder="Search for course" />
						<select className="search_dropdown" value={this.state.school} onChange={this.changeSchool.bind(this)} >
							<option value="UTSC">UTSC</option>
							<option value="UTSG">UTSG</option>
							<option value="UTM">UTM</option>
						</select>
					</div>
					<div className="search_result">
						<h3 id="search_result_header">Search Results</h3>
						{this.state.results}
					</div>
				</div>)
	}

	_onChange() {
        this.setState(getUser());
    }
	
}

function getUser() {
    return {
        user: SearchStore.getUserData()
    }
}

// function getUserProgram() {
//     return {
//         program: SearchStore.getUserProgram()
//     }
// }

// function getUserSpec() {
//     return {
//         spec: SearchStore.getUserSpec()
//     }
// }

// function getUserTaken() {
//     return {
//         taken: SearchStore.getUserTaken()
//     }
// }


export default Search;