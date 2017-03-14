import React, { Component } from 'react';
import { render } from 'react-dom';


class SearchResult extends Component {
	constructor(){
		super();
		this.state = {
			preq: "N/A"
		};
	}

	clicked(e){
		console.log(this.props.course);
		// console.log("/course/"+this.props.course.code);
		$.ajax({
            url: "/course/"+this.props.course.code,
            success: function(result){
            	// console.log(result)
            }, 
            error: function (err) {
                console.log(err);
            }
        });
	}
	
	render() {
		this.state.preq = this.props.course.preq.length > 0 ? this.props.course.preq.join(" / ") : "N/A";
		return <div className="search_result_elem" onClick={this.clicked.bind(this)}>
					<h3 className="search_result_name">{this.props.course.title} ({this.props.course.code})</h3>
				</div>;
	}
}


export default SearchResult;