import React, { Component } from 'react';
import { render } from 'react-dom';


class Trees extends Component {
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
    $.ajax({
      url: "/api/path/CSCA08H3/post",
      dataType: 'json',
      success: function (result) {
      var data = result;
	  
	  var node = function (data){
   		this.title = data.title;
   		this.id = data.courseid;
   		this.postreq = data.postreq;
   		this.source = null;
   		this.target = null;
   		this.edgeNumbers = data.postreq.length;
   		this.visited = false;
   	  };

   	  var edge = function (sourceNode, targetNode){ 	
   		this.id = sourceNode.id + targetNode.id;
   		this.source = sourceNode.id;
   		this.target = targetNode.id;
   		this.visited = false;
   	  };


      

   	   var nodes = [];
   	   var edges = [];
   	   var stacks = [];
       var startNode = new node(data);
       nodes.push(startNode);
       stacks.push(startNode);
       startNode.source= startNode;
       startNode.visited = true;


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
/*
	          elements: {
	              nodes: [
	                { data: { id: 'a' ,degree: 1} },
	                { data: { id: 'b' ,degree: 1} },
	                { data: { id: 'c' ,degree: 1} },
	                { data: { id: 'd' ,degree: 1} },
	                { data: { id: 'e' ,degree: 1} },
	                { data: { id: 'f' ,degree: 2} },
	                { data: { id: 'g' ,degree: 2} },
	                { data: { id: 'h' ,degree: 2} },
	                { data: { id: 'i' ,degree: 3} }
	              ],

	              edges: [
	                { data: { id: 'af', weight: 1, source: 'a', target: 'f' } },
	                { data: { id: 'bf', weight: 1, source: 'b', target: 'f' } },
	                { data: { id: 'bg', weight: 1, source: 'b', target: 'g' } },
	                { data: { id: 'cg', weight: 1, source: 'c', target: 'g' } },
	                { data: { id: 'ch', weight: 1, source: 'c', target: 'h' } },
	                { data: { id: 'dh', weight: 1, source: 'd', target: 'h' } },
	                { data: { id: 'eh', weight: 1, source: 'e', target: 'h' } },
	                { data: { id: 'fi', weight: 1, source: 'f', target: 'i' } },
	                { data: { id: 'gi', weight: 1, source: 'g', target: 'i' } },
	                { data: { id: 'hi', weight: 1, source: 'h', target: 'i' } }
	              ]
	            },*/



	          layout: {
	            name: 'breadthfirst',
	            directed: true,
	            roots: '#CSCA08H3',
	            padding: 10
	          }
	        });

	        //highlight the node
	        for(var i =0; i<nodes.length; i++){ 
     	   		var id = nodes[i].id;
     	   		var title = nodes[i].id;
    	   		var x = 450 + (i*30) - nodes[i].edgeNumbers*50;
     	   		var y = 50 + (i*50);


					cy.add([
					        {group: "nodes", data: {id: id, title: title}, position:{x:x , y:y}}
					    ])
					cy.$('#'+id).lock();


	    	}

	    	for(var i =0; i<edges.length; i++){ 
     	   		var id = edges[i].id;
     	   		var source = edges[i].source;
     	   		var target = edges[i].target;
					cy.add([
					        { group: "edges", data: { id: id, source: source, target: target}}
					    ])
	    	}

	    	cy.minZoom(8);
	    	cy.maxZoom(5);


	        cy.on('tap', function(evt){
	          if(evt.cyTarget===cy || evt.cyTarget.isEdge()) return;
	          var tapid= cy.$('#'+evt.cyTarget.id());
	          var creditCounter=document.getElementById('qty').value;
	          creditCounter = creditCounter.split("/")[0];
	          var newCredit = parseFloat(creditCounter);

	          if(tapid.hasClass('highlighted')){
	            unhighLighter(tapid);
	            newCredit-=0.5;
	          }
	          else {
	            newCredit+=0.5;
	            findconnected(tapid);
	          }
	          document.getElementById('qty').value = newCredit + "/20";

	        });

	        var findconnected = function(node){
	            var i = 1;
	            var connectedEdges = node.connectedEdges();
	            var roots = cy.nodes().roots();

	            roots.forEach(function(e) {
	              if(e.id()==node.id()) node.addClass('highlighted');
	            })

	            connectedEdges.forEach(function(ele){
	                var target = ele.target();
	                var source = ele.source();
	                if(source.hasClass('highlighted') && target.id()==node.id()) i++;
	                if(i==connectedEdges.size()) highLighter(node);
	            });
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
	            if(ele.target().id()==node.id()) {
	              ele.target().removeClass('highlighted');
	              ele.removeClass('highlighted');
	              }
	          });
	        }

	    }); // on dom ready


      }
    });
  }

}


export default Trees;
