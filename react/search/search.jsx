import React, { Component } from 'react';
import { render } from 'react-dom';

import SearchResult from "./searchResult.jsx";
// import model from "../../frontend/static/js/app/model.js"

var AppDispatcher = require('../dispatcher.jsx');
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
		var thisComp = this;

		var callback = function (result) {
            AppDispatcher.handleAction({
                actionType: 'SEARCH_RESULTS',
                data: result
            });

            var searchResult = SearchStore.getSearchResults();
			var resultCourses = [];

			Promise.all(searchResult.map(function (course) {
                resultCourses.push(<SearchResult key={course.code} course={course} />);
            })).then(function(){
                thisComp.setState({results: resultCourses});
            });
        }

		actions.getSearchResults(e.target.value, callback);
	}

	render() {
		var resultCourses = [];
		var msg = "Search for " + this.state.school + " courses";
		return (<div>
					<div className="search_banner"> 
						<h3 className="search_header"> {msg} </h3>

					</div>
					<div className="search_result_div">
						<h3 id="search_result_header">Search Results</h3>
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