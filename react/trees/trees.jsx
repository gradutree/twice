import React, { Component } from 'react'; import { render } from 'react-dom';

import SkyLight from 'react-skylight';
import TreeProgress from "./treeProgress.jsx";
import CourseInfo from "./courseInfo.jsx";


var AppDispatcher = require('../dispatcher.jsx');
var TreeStore = require("./treeStore.jsx");
var actions = require("./treeActions.jsx");
var compSciCore = ['CSCD43H3', 'CSCD27H3', 'CSCD58H3','CSCD01H3','CSCD27H3'];

class Node {
  	constructor(data) {
    	this.id = data.courseid;
    	this.preq = data.preq;
    	if (data.preq) {
      		this.edgeNumbers = data.preq.length;
    	} 
    	else  {
      		this.edgeNumbers = 0;
    	}
  	}
}

class Edge {
  	constructor(sourceNode, targetNode){
		this.id = sourceNode.id + ":" + targetNode.id;
		this.source = sourceNode.id;
		this.target = targetNode.id;
  	}
};

class Trees extends Component {
	constructor(){
		super();
		this.state = {
			user: null,
			preq: null,
			program: null,
			taken: null,
			allCourses: null,
			nodeClicked: "",
			nodeClickedIsTaken: false,
			nodeClickedIsAllCourses: false,
			cy: null
		};
	}

	checkIsTaken(){
		if(this.state.user && this.state.nodeClicked != ""){
			return this.setState({nodeClickedIsTaken: 
				this.state.user.taken.indexOf(this.state.nodeClicked) >= 0});
		}
		return this.setState({nodeClickedIsTaken: false});
	}

	checkIsAllCourses(){
		if(this.state.user && this.state.nodeClicked != ""){
			return this.setState({nodeClickedIsAllCourses: 
				this.state.user.allCourses.indexOf(this.state.nodeClicked) >= 0});
		}
		return this.setState({nodeClickedIsAllCourses: false});
	}

	highlightUserCourses(){
		var thisComp = this;
		if(this.state.user && this.state.cy){
			// Highlight nodes
			thisComp.state.cy.nodes().forEach(function(node){
				var i = 0;
				var allCourses = thisComp.state.user.allCourses;
				for (i = 0; i < allCourses.length; i++){
					if(node.id() == allCourses[i]){
			      		if(thisComp.state.user.taken.indexOf(allCourses[i]) >= 0){
				      		node.addClass('highlighted');
				      		node.data('marked',1);
				      		break;
			      		}
			      		else {
			      			node.addClass('highlightedAllCourses');
			      			node.data('marked',1);
			      			break;
			      		}
			    	}
			    	else {
			    		node.removeClass('highlighted');
			    		node.removeClass('highlightedAllCourses');
			    		node.data('marked',0);
			    	}
				}
			});

			// Highlight edges
			thisComp.state.cy.edges().forEach(function(edge){
				if(thisComp.state.user.allCourses.indexOf(edge.source().id()) >= 0 && 
					thisComp.state.user.allCourses.indexOf(edge.target().id()) >= 0){
					// Taken is a subsset of allCourses
					if(thisComp.state.user.taken.indexOf(edge.target().id()) >= 0){
						edge.addClass('highlighted');
		      			edge.data('marked',1);
		      			return;
					}
					else {
						edge.addClass('highlightedAllCourses');
		      			edge.data('marked',1);
		      			return;
					}
				}
				else {
					edge.removeClass('highlighted');
			    	edge.removeClass('highlightedAllCourses');
		    		edge.data('marked',0);
		    		return;
		    	}
			});
		}
	}


	createTree(){
		var thisComp = this;
     	var ajaxCalls = compSciCore.map(actions.loadTreeInfo);

     	var nodes = [];
		var edges = [];

     	$.when.apply($, ajaxCalls).then(function(){

	       	var findCourse = function(data){
	       		for(var i=0; i<nodes.length; i++) {
	       			if(nodes[i].id==data.courseid) {
		              return true;
		            }
	       		}
	       		return false;
	       	}

	       	var getNode = function(data){
	       		for(var i=0; i<nodes.length; i++) {
	       			if(nodes[i].id==data.courseid) {
		              return nodes[i];
		            }
	       		}
	       		return null;
	       	}

	       	var courseAdder = function (node){
		       	for(var i=0; i<node.edgeNumbers; i++) {
		       		// Course node already exists so just add an edge to the graph
		       		if(findCourse(node.preq[i])){
		       			var newEdge = new Edge(getNode(node.preq[i]), node);
		       			edges.push(newEdge);
		       		}
		       		else if (node.preq[i]==null ||
		                node.preq[i].courseid == null) {
	              		break;
	            	}
	            	// Add new course and edge to the graph
		       		else {
		       			var newNode = new Node(node.preq[i]);
		       			var newEdge = new Edge(newNode, node);
		       			nodes.push(newNode);
		       			edges.push(newEdge);
		       			courseAdder(newNode);
		       		}
		       	}
	       	}

	        var roots = TreeStore.getTreeData();
	        for(var j=0; j< roots.length; j++){
	  			var startNode = new Node(roots[j]);
		        nodes.push(startNode);
		      	courseAdder(startNode);
	   	    }

		    var cy = cytoscape({
		    	container: document.getElementById('cy'),
		      	boxSelectionEnabled: false,
		      	autounselectify: true,
		      	pan: { x: 0, y: 0 },
		      	style: cytoscape.stylesheet()
						.selector('node')
		        .css({'content': 'data(id)'})
						.selector('edge')
		        .css({
							'target-arrow-shape': 'triangle',
		          'width': 4,
		          'line-color': '#ddd',
		          'target-arrow-color': '#ddd',
		          'curve-style': 'bezier'
		        })
		        .selector('.highlighted')
		        .css({
							'background-color': '#70db70',
		          'line-color': '#70db70',
		          'target-arrow-color': '#70db70',
		          'transition-property': 'background-color, line-color, target-arrow-color',
		          'transition-duration': '0.5s'
		        })
		        .selector('.highlightedAllCourses')
		        .css({
							'background-color': '#FFA500',
		          'line-color': '#FFA500',
		          'target-arrow-color': '#FFA500',
		          'transition-property': 'background-color, line-color, target-arrow-color',
		          'transition-duration': '0.5s'
		        }),
				layout: {
					name: 'breadthfirst',
			        directed: true,
			        roots: '#CSCA08H3',
			        padding: 10
			    }
			});

		    var levelCount = {A:0, B:0, C:0, D:0};
		    for(var i =0; i<nodes.length; i++){
	        	var id = nodes[i].id;
	     	  	var title = nodes[i].title;
	     	  	var levels  = [10, 110, 210, 310];

	    	  	var x = 50 + (levelCount[id.charAt(3)]*130);
	    	  	var y = 50 + (i*50);
	    	  	switch(id.charAt(3)) {
	          	case ("A"):
	            	x = 400 + (levelCount[id.charAt(3)]*120);
	            	y = 50 + levels[0];
	            	levelCount["A"] +=1;
	            	break;
	          	case("B"):
	            	y = 50 + levels[1];
	            	levelCount["B"] += 1;
	            	break;
	          	case("C"):
	            	y = 50 + levels[2];
	            	levelCount["C"] += 1;
	            	break;
	          	case("D"):
	            	y = 50 + levels[3];
	            	levelCount["D"] += 1;
	            	break;
	        	}
	        	cy.add([
	          		{group: "nodes", data: {id: id, title: title}, position:{x:x , y:y}}
	        	]);
	      	}

	      	for(var i =0; i<edges.length; i++){
	          	var id = edges[i].id;
	          	var source = edges[i].source;
	          	var target = edges[i].target;
	          	cy.add([
	            	{ group: "edges", data: { id: id, source: source, target: target, marked : 0}}
	          	]);
	      	}

	      	cy.minZoom(1);
		    cy.maxZoom(1);

		    // When a node is selected
		    cy.on('tap', function(evt){
		    	if(evt.cyTarget===cy || evt.cyTarget.isEdge()) return;
	            thisComp.refs.courseInfo.show();
	            actions.nodeClicked(evt.cyTarget.id());
		    });

		    thisComp.setState({cy: cy});
		    actions.graphCreated();

		});
	}


  	render() {
	    return (
	        <div>
	        	<div className="tree_graph">
	          		<div className="tree_graph_display" id="cy"></div>
	          	</div>
	          	<TreeProgress programReq={this.state.program} taken={this.state.taken} allCourses={this.state.allCourses} />
	          	<SkyLight hideOnOverlayClicked beforeOpen={this._beforePopupOpen.bind(this)} ref="courseInfo" 
	          		title={this.state.nodeClicked} >
		        	<CourseInfo user={this.state.user} code={this.state.nodeClicked} 
		        		isTaken={this.state.nodeClickedIsTaken} isAllCourses={this.state.nodeClickedIsAllCourses} />
		        </SkyLight>
	        </div>
	    );
  	}

  	_beforePopupOpen(){
  		// console.log(this.state.nodeClicked);
  	}

  	_onChange() {
        this.setState(getUser());
        this.setState(getTree());
        this.setState({taken: TreeStore.getUserTaken()});
        this.setState({allCourses: TreeStore.getUserAllCourses()});
        this.checkIsTaken();
        this.checkIsAllCourses();
        this.highlightUserCourses();
        
        actions.getUserProgram(this.state.user);
    }

    _onGraphCreated(){
    	this.highlightUserCourses();
    }

    _onProgramChange() {
    	this.setState({program: TreeStore.getUserProgramReq()});
    }

    _onNodeClicked() {
    	this.setState({nodeClicked: TreeStore.getNodeClicked()})
    	actions.getCourseInfo(this.state.nodeClicked);
    	this.checkIsTaken();
        this.checkIsAllCourses();
    }

    _onSetTaken() {
    	actions.loadUserData(null);
    }

    _onSetAllCourses() {
    	actions.loadUserData(null);
    }

    _onDeleteTaken(){
    	actions.loadUserData(null);
    }

    _onDeleteAllCourses(){
    	actions.loadUserData(null);
    }

    componentWillUnmount() {
        TreeStore.removeChangeListener(this.treeOnChange);
        TreeStore.removeProgramChangeListener(this.treeOnProgramChange);
        TreeStore.removeNodeClickedListener(this.treeOnNodeClicked);
        TreeStore.removeTreeChangeListner(this.treeOnChange);
        TreeStore.removeGraphCreatedListner(this.treeOnGraphCreated);
        TreeStore.removeSetTakenListener(this.treeOnSetTaken);
        TreeStore.removeSetAllCoursesListener(this.treeOnSetAllCourses);
        TreeStore.removeDeleteTakenListener(this.treeOnDeleteTaken);
        TreeStore.removeDeleteAllCoursesListener(this.treeOnDeleteAllCourses);
    }

  	componentDidMount() {
	  	this.treeOnChange = this._onChange.bind(this);
	  	this.treeOnGraphCreated = this._onGraphCreated.bind(this);
	  	this.treeOnProgramChange = this._onProgramChange.bind(this);
	  	this.treeOnNodeClicked = this._onNodeClicked.bind(this);
	  	this.treeOnSetTaken = this._onSetTaken.bind(this);
	  	this.treeOnSetAllCourses = this._onSetAllCourses.bind(this);
	  	this.treeOnDeleteTaken = this._onDeleteTaken.bind(this);
	  	this.treeOnDeleteAllCourses = this._onDeleteAllCourses.bind(this);

	    TreeStore.addChangeListener(this.treeOnChange);
	    TreeStore.addProgramChangeListener(this.treeOnProgramChange);
	    TreeStore.addNodeClickedListener(this.treeOnNodeClicked);
	    TreeStore.addTreeChangeListner(this.treeOnChange);
	    TreeStore.addGraphCreatedListner(this.treeOnGraphCreated);
	    TreeStore.addSetTakenListener(this.treeOnSetTaken);
	    TreeStore.addSetAllCoursesListener(this.treeOnSetAllCourses);
	    TreeStore.addDeleteTakenListener(this.treeOnDeleteTaken);
	    TreeStore.addDeleteAllCoursesListener(this.treeOnDeleteAllCourses);

	  	actions.loadUserData(null);
	  	actions.getUserProgram(this.state.user);

	  	this.setState({user: getUser()});
	  	this.createTree();
	 }
}

function getTree(){
	 return {
	 	preq: TreeStore.getTreeData()
	 }
}

function getUser() {
    return {
        user: TreeStore.getUserData()
    }
}

export default Trees;
