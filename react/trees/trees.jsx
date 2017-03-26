import React, { Component } from 'react'; import { render } from 'react-dom';

import SkyLight from 'react-skylight';
import TreeProgress from "./treeProgress.jsx";
import CourseInfo from "./courseInfo.jsx";


var AppDispatcher = require('../dispatcher.jsx');
var TreeStore = require("./treeStore.jsx");
var actions = require("./treeActions.jsx");
var compSciCore = ['CSCD43H3', 'CSCD27H3', 'CSCD58H3','CSCD01H3','CSCD27H3', 'CSCD84H3'];
var counter = 0;
var nodes = [];
var edges = [];

class Node {
  constructor(data) {
    this.id = data.courseid;
    this.preq=data.preq;
    if (data.preq) {
      this.edgeNumbers = data.preq.length;
    } else  {
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
			nodeClickedIsAllCourses: false
		};
	}

	checkIsTaken(){
		if(this.state.user && this.state.nodeClicked != ""){
			return this.setState({nodeClickedIsTaken: this.state.user.taken.indexOf(this.state.nodeClicked) >= 0});
		}
		return this.setState({nodeClickedIsTaken: false});
	}

	checkIsAllCourses(){
		if(this.state.user && this.state.nodeClicked != ""){
			return this.setState({nodeClickedIsAllCourses: this.state.user.allCourses.indexOf(this.state.nodeClicked) >= 0});
		}
		return this.setState({nodeClickedIsAllCourses: false});
	}


  	render() {
	    return (
	        <div>
	        	<div className="tree_graph">
	          		<div id="cy"></div>
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
        
        actions.getUserProgram(this.state.user);
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
        TreeStore.removeSetTakenListener(this.treeOnSetTaken);
        TreeStore.removeSetAllCoursesListener(this.treeOnSetAllCourses);
        TreeStore.removeDeleteTakenListener(this.treeOnDeleteTaken);
        TreeStore.removeDeleteAllCoursesListener(this.treeOnDeleteAllCourses);
    }

  	componentDidMount() {
	  	this.treeOnChange = this._onChange.bind(this);
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
	    TreeStore.addSetTakenListener(this.treeOnSetTaken);
	    TreeStore.addSetAllCoursesListener(this.treeOnSetAllCourses);
	    TreeStore.addDeleteTakenListener(this.treeOnDeleteTaken);
	    TreeStore.addDeleteAllCoursesListener(this.treeOnDeleteAllCourses);

	  	actions.loadUserData(null);
	  	actions.getUserProgram(this.state.user);

	  	this.setState({user: getUser()});
	  	var thisComp = this;

	 $(function(){ // on dom ready

     var ajaxCalls = compSciCore.map(actions.loadTreeInfo);
     $.when.apply($, ajaxCalls).then(function(){
       
       var findCourse = function(data){
       		for(var i=0; i<nodes.length; i++) {
       			if(nodes[i].id==data.courseid) {
              return true;
            }
       		}
       		return false;
       }


    	var edgeFinder = function (node){

       		for(var i=0; i<edges.length; i++) {
       			if(edges[i].source==data.courseid) {
              return true;
            }
       		}
       		return false;

    	}


       var courseAdder = function (node){

	       	for(var i=0; i<node.edgeNumbers; i++) {
	       		if (node.preq[i]==null ||
                node.preq[i].courseid == null) {
            	return;
            	}

/*            	else if (findCourse(node.preq[i])==true && edgeFinder(node.preq[i]) == true){
            		var newEdge = new Edge(node.preq[i], node);
            		edge.push(newEdge);
            		return;
            	}
*/

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
	    cy.maxZoom(5);

	    cy.on('tap', function(evt){
	    	if(evt.cyTarget===cy || evt.cyTarget.isEdge()) return;

            thisComp.refs.courseInfo.show()
            actions.nodeClicked(evt.cyTarget.id());
       //  if(evt.cyTarget===cy || evt.cyTarget.isEdge()) return;
	      // var tapid= cy.$('#'+evt.cyTarget.id());
	      // var creditCounter=document.getElementById('qty').value;
	      // creditCounter = creditCounter.split("/")[0];
	      // var newCredit = parseFloat(creditCounter);

	      // if(tapid.hasClass('highlighted')){
       //    edgeUnmarker(tapid);
	      //   newCredit-=0.5;
	      // }
	          // else {
	          // 	// console.log("tap");
	          //   newCredit+=0.5;
	          //   edgeMarker(tapid);
	          //   findconnected(tapid);
	          // }
	          // document.getElementById('qty').value = newCredit + "/20";

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


		});

	});

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

