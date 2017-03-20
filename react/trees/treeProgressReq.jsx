import React, { Component } from 'react';
import { render } from 'react-dom';
import { Line } from 'rc-progress';


class TreeProgressReq extends Component {
	// constructor(){
	// 	super();
	// 	this.state = {
	// 		preq: "N/A", 
	// 		currStyle: null
	// 	};
	// }

	clicked(e){
		console.log("treeProgressReq clicked");
		// console.log(this.props.programReq);
	}
	
	render() {
		return 	<div onClick={this.clicked.bind(this)}>
					<h3 className="search_result_name">"PROGRESS BAR"</h3>
					<Line percent="10" strokeWidth="4" strokeColor="#D3D3D3" />
				</div>;
	}
}


export default TreeProgressReq;