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
			user: null,
			showTaken: true
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

	// Updates the results when typing in the search bar
	changeResults(e){
		this.updateResults(e.target.value);
	}

	// Updates the results to show/hide taken courses when filter clicked
	takenFilter(e){
		this.state.showTaken = !this.state.showTaken;
		this.updateResults(this.refs.searchInput.value);
	}

	updateResults(searchStr){
		var thisComp = this;

		var callback = function (result) {
            AppDispatcher.handleAction({
                actionType: 'SEARCH_RESULTS',
                data: result
            });

            var searchResult = SearchStore.getSearchResults();
			var resultCourses = [];

			Promise.all(searchResult.map(function (course) {
				var userTook = thisComp.state.user.taken.indexOf(course.code) > -1;
                resultCourses.push(<SearchResult key={course.code} course={course} taken={userTook} />);
            })).then(function(){
            	// Sort results alphabetically
            	resultCourses.sort(function(a, b) {
				    var codeA = a.key.toUpperCase();
				    var codeB = b.key.toUpperCase();
				    return (codeA < codeB) ? -1 : (codeA > codeB) ? 1 : 0;
				});

            	// Remove the taken courses if the filter was selected
				if(!thisComp.state.showTaken){
					console.log("trying to remove courses");
					resultCourses = resultCourses.filter(function(course){
						return !course.props.taken;
					});
				}

                thisComp.setState({results: resultCourses});
            });
        }

		actions.getSearchResults(searchStr, callback);
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
						<div className="search_div_container">
							<div className="search_filter" onClick={this.takenFilter.bind(this)}>Show Taken Courses</div>
							<div className="search_div">
								<input className="search_input" onChange={this.changeResults.bind(this)} ref="searchInput" placeholder="Search for course" />
								<select className="search_dropdown" value={this.state.school} onChange={this.changeSchool.bind(this)} >
									<option value="UTSC">UTSC</option>
									<option value="UTSG">UTSG</option>
									<option value="UTM">UTM</option>
								</select>
							</div>
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

export default Search;