import React, { Component } from 'react';
import { render } from 'react-dom';
// import { Line } from 'rc-progress';

import TreeProgressReq from "./treeProgressReq.jsx";

var TreeStore = require("./treeStore.jsx");


class TreeProgress extends Component {
	constructor(){
		super();
		this.state = {
			reqs: []
		};
	}

	updateProgramReq(){
		var thisComp = this;
		var programReqs = [];


		if(TreeStore.getUserProgramReq().length > 0){
			Promise.all(TreeStore.getUserProgramReq().map(function (req, index) {
				programReqs.push(<TreeProgressReq key={index} reqNum={index+1} req={req} taken={thisComp.props.taken} allCourses={thisComp.props.allCourses} />);
	        })).then(function(){
	        	programReqs.sort(function(a,b){
	        		return a - b;
	        	});
				thisComp.setState({reqs: programReqs});
	        });
		}
	}

	componentWillUnmount() {
        TreeStore.removeProgramChangeListener(this.treeOnProgramChange);
    }

	componentDidMount() {
		this.treeOnProgramChange = this.updateProgramReq.bind(this);
    	TreeStore.addProgramChangeListener(this.treeOnProgramChange);
	}
	
	render() {
		return 	<div className="program_req_container">
					<div className="program_progress">
						<h3 className="search_result_name">Your Progress</h3>
						<div className="program_progress_set">{this.state.reqs}</div>
					</div>
				</div>;
				
	}
}


export default TreeProgress;