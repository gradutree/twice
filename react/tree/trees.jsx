import React, { Component } from 'react';
import { render } from 'react-dom';
import Cytoscape from './cytoscape.jsx'

var treeStore = require("./treeStore.jsx");
var actions = require("./treeActions.jsx");


class Trees extends Component {
  	

   constructor(){
	    super();
	    this.state = { user: null };
   }


  render() {
    return (
        <div>
          
          <div id="cy"></div>
          <div id="box">
            <label for="qty"><abbr title="Quantity">Credit</abbr></label>
            <input id="qty" value="0/20"></input>
          </div>
        </div>
    );
  }

  componentDidMount() {

  	//this.searchOnChange = this._onChange.bind(this);
    //TreeStore.addChangeListener(this.searchOnChange);
    actions.loadUserData(null);
    this.setState(getUser());
    
    var result = treeStore.getTreeResults('CSCA08H3');



  	var cy = this.refs.graph.getCy();
	var node = function (data){
		this.title = data.title;
	  	this.id = data.courseid;
		this.postreq = data.postreq;
		this.source = null;
		this.target = null;
		this.edgeNumbers = data.postreq.length;
	};
	var edge = function (sourceNode, targetNode){ 	
		this.id = sourceNode.id + targetNode.id;
		this.source = sourceNode.id;
		this.target = targetNode.id;
		this.visited = false;
	};
   	var nodes = [];
   	var edges = [];
	var startNode = new node(result);
    nodes.push(startNode);
    startNode.source= startNode;
    var findCourse = function(node){
   		for(var i=0; i<nodes.length; i++){
   			if(nodes[i].id==node.id) return true;
   		}
   		return false;
    }
    var courseAdder = function (data){
	       	var i;
	       	for(i=0; i<data.edgeNumbers; i++){
	       		if(findCourse(data.postreq[i])==true) return;
	       		else{
	       			var newNode = new node(data.postreq[i]);
	       			var newEdge = new edge(data, newNode);
	       			nodes.push(newNode);
	       			edges.push(newEdge);
	       			courseAdder(newNode);

	       		}
	       	}
    }
    courseAdder(startNode); // all the courses added

  }


}


export default Trees;
