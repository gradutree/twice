import React, { Component } from 'react';
import { render } from 'react-dom';
import { Line } from 'rc-progress';


class TreeProgressReq extends Component {
	constructor(){
		super();
		this.state = {
			num: 2
		};
	}

	clicked(e){
		console.log("treeProgressReq clicked");
		// console.log(this.props.programReq);
	}
	
	render() {
		return 	<div className="program_req_div" onClick={this.clicked.bind(this)}>
					<div className="program_req_visual">
						<h3 className="program_req_name">Requirement {this.props.reqNum}</h3>
						<div className="program_req_bar">
							<Line percent="10" strokeWidth={this.state.num} strokeColor="#cee1ff" />
						</div>
					</div>
					<div className="program_reqs_courses">

					</div>
				</div>;
	}
}


export default TreeProgressReq;