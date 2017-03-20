import React, { Component } from 'react';
import { render } from 'react-dom';
import { Line } from 'rc-progress';


class TreeProgressReq extends Component {
	constructor(){
		super();
		this.state = {
			percent: 10
		};
	}

	clicked(e){
		console.log("treeProgressReq clicked");
		// console.log(this.props.programReq);
	}

	componentDidMount() {
		console.log("TAKEN = ");
		console.log(this.props.taken);
		console.log(this.props.req);
		// console.log(determinePercent(this.props.req.courses, this.props.taken));
		this.setState({percent: determinePercent(this.props.req.courses, this.props.taken)});
	}
	
	render() {
		return 	<div className="program_req_div" onClick={this.clicked.bind(this)}>
					<div className="program_req_visual">
						<h3 className="program_req_name">Requirement {this.props.reqNum}</h3>
						<div className="program_req_bar">
							<Line percent={this.state.percent} strokeWidth="1" strokeColor="#cee1ff" />
						</div>
					</div>
					<div className="program_reqs_courses">

					</div>
				</div>;
	}
}

function determinePercent(reqs, taken){
	var counter = 0;

	reqs.forEach(function(elem){
		// console.log(elem);
		// setTimeout(function(){
	        
	 //    }, 500);
		var i = 0;
		for(i = 0; i <elem.length; i++){
			console.log(elem[i]);
			if(taken.indexOf(elem[i]) >= 0){
				counter++;
				break;
			}
		}
	});

	// console.log("END % " + counter);
	// console.log(reqs.length / counter);
	return counter/ reqs.length * 100;
}

export default TreeProgressReq;