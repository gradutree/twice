import React, { Component } from 'react';
import { render } from 'react-dom';

import TreeProgress from "./treeProgress.jsx";

var AppDispatcher = require('../dispatcher.jsx');
var TreeStore = require("./treeStore.jsx");
var actions = require("./treeActions.jsx");

class Trees extends Component {
	constructor(){
		super();
		this.state = {
			user: null,
			program: null,
		};
	}

  	render() {
	    return (

	        <div>
	          <div id="cy"></div>
	          <TreeProgress programReq={this.state.program}/>
	        </div>
	    );
  	}

  	_onChange() {
  		console.log("TREE _onChange");
        this.setState(getUser());
        console.log(this.state.user);
        actions.getUserProgram(this.state.user);
    }

    _onProgramChange() {
    	console.log("TREE _onProgramChange");
    	this.setState({program: TreeStore.getUserProgramReq()});
    	console.log(TreeStore.getUserProgramReq());
    }

    componentWillUnmount() {
        TreeStore.removeChangeListener(this.treeOnChange);
        TreeStore.removeProgramChangeListener(this.treeOnProgramChange);
    }

  componentDidMount() {
  	this.treeOnChange = this._onChange.bind(this);
  	this.treeOnProgramChange = this._onProgramChange.bind(this);

    TreeStore.addChangeListener(this.treeOnChange);
    TreeStore.addProgramChangeListener(this.treeOnProgramChange);

  	actions.loadUserData(null);
  	// actions.getUserProgram();

  	this.setState({user: getUser()});
    $.ajax({
      url: "/api/path/CSCA08H3/post",
      dataType: 'json',
      success: function (result) {
      var data = result;
      var rank = 0;
	  
	  var node = function (data){
   		this.title = data.title;
   		this.id = data.courseid;
   		this.postreq = data.postreq;
   		this.source = null;
   		this.target = null;
   		this.edgeNumbers = data.postreq.length;
   		this.rank = rank++;
   	  };

   	  var edge = function (sourceNode, targetNode){ 	
   		this.id = sourceNode.id + targetNode.id;
   		this.source = sourceNode.id;
   		this.target = targetNode.id;
   		this.visited = false;
   	  };

   	   var nodes = [];
   	   var edges = [];
       var startNode = new node(data);
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

		  $(function(){ // on dom ready
	        var cy = cytoscape({
	          container: document.getElementById('cy'),

	          boxSelectionEnabled: false,
	          autounselectify: true,
	          pan: { x: 0, y: 0 },
	          style: cytoscape.stylesheet()
	            .selector('node')
	              .css({
	                'content': 'data(id)'
	              })
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
	                'background-color': '#61bffc',
	                'line-color': '#61bffc',
	                'target-arrow-color': '#61bffc',
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
     	   		var rank = nodes[i].rank;
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
					    ])
				//cy.$('#'+id).lock();
				// console.log(levelCount);
	    	}

	    	

	    	for(var i =0; i<edges.length; i++){ 
     	   		var id = edges[i].id;
     	   		var source = edges[i].source;
     	   		var target = edges[i].target;
					cy.add([
					        { group: "edges", data: { id: id, source: source, target: target, marked : 0}}
					    ])
					
	    	}

	    	cy.minZoom(1);
	    	cy.maxZoom(5);


	        cy.on('tap', function(evt){
	          if(evt.cyTarget===cy || evt.cyTarget.isEdge()) return;
	          var tapid= cy.$('#'+evt.cyTarget.id());
	          var creditCounter=document.getElementById('qty').value;
	          creditCounter = creditCounter.split("/")[0];
	          var newCredit = parseFloat(creditCounter);

	          if(tapid.hasClass('highlighted')){
	          	edgeUnmarker(tapid);
	            newCredit-=0.5;
	          }
	          else {
	          	// console.log("tap");
	            newCredit+=0.5;
	            edgeMarker(tapid);
	            findconnected(tapid);
	          }
	          document.getElementById('qty').value = newCredit + "/20";

	        });

	        var findconnected = function(node){
	            //var i = 0;
	            var connectedEdges = node.incomers();
	            var length = connectedEdges.length;
	            var roots = cy.nodes().roots();
	          

	            roots.forEach(function(e) {
	              	if(e.id()==node.id()){ 
	              		node.addClass('highlighted');
	              		edgeMarker(node);
	              		return;
	            	}
	            })

	            connectedEdges.forEach(function(ele){
	                var target = ele.target();
	                var source = ele.source();
	                if(source.hasClass('highlighted') && markChecker(node)==true) {
	                	highLighter(node);
	                	return;
	                }
	            });
	        }


	        var edgeMarker = function(node){
	          node.data('marked',1);
	          node.outgoers().forEach(function(ele){
	          		//console.log(ele);
	          		ele.data('marked',1);
	          });
	        }



	        var edgeUnmarker = function(node){
	          node.data('marked',0);
	          unhighLighter(node);
	          node.outgoers().forEach(function(ele){
	          		ele.data('marked',0);
	          });
	        }


	        var markChecker = function(node){
	        	var result = true;
	         	node.incomers().forEach(function(ele){
	          		var value = ele.data('marked');
	          		if(value==0) result=false;
	          });
	          		//console.log("Ddd");
	          		return result;
	        }




	        var highLighter = function(node){
	          node.connectedEdges().forEach(function(ele){
	            if(ele.target().id()==node.id()) {
	              ele.target().addClass('highlighted');
	              ele.addClass('highlighted');
	              }
	          });
	        }

	        var unhighLighter = function(node){
	          node.removeClass('highlighted');
	          node.connectedEdges().forEach(function(ele){
	            //if(ele.target().id()==node.id()) {
	              //ele.target().removeClass('highlighted');
	              ele.removeClass('highlighted');
	              //}
	          });
	        }

	    }); // on dom ready


      }
    });
  }

}

function getUser() {
    return {
        user: TreeStore.getUserData()
    }
}

export default Trees;
