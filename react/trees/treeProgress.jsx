import React, { Component } from 'react';
import { render } from 'react-dom';


class TreeProgress extends Component {
	// constructor(){
	// 	super();
	// 	this.state = {
	// 		preq: "N/A", 
	// 		currStyle: null
	// 	};
	// }

	clicked(e){
		console.log("treeProgress");
	}
	
	render() {
		return 	<div onClick={this.clicked.bind(this)}>
					<h3 className="search_result_name">"PROGRESS BAR"</h3>
				</div>;
	}
}


export default TreeProgress;