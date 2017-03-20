import React, { Component } from 'react';
import { render } from 'react-dom';

var node = function (data){
    this.title = data.name;
    this.id = data.courseid;
    this.preq = data.preq;
    this.postreq = data.postreq;
    this.source = null;
    this.target = null;
    this.edgeNumbers = data.preq ? data.preq.length : data.postreq.length;
    // this.rank = rank++;
};

var edge = function (sourceNode, targetNode){
    this.id = sourceNode.id + targetNode.id;
    this.target = sourceNode.id;
    this.source = targetNode.id;
    this.visited = false;
};

var edgePost = function (sourceNode, targetNode) {
    this.id = sourceNode.id + targetNode.id;
    this.source = sourceNode.id;
    this.target = targetNode.id;
    this.visited = false;
};

class CourseTree extends Component {
    render() {
        return (
            <div>
                <div className="box path_vis" id="cy"></div>

            </div>
        );
    }

    componentDidMount() {

        var code = this.props.code;
        var nodes = [];
        var edges = [];
        var levelCount = {A:0, B:0, C:0, D:0};

        var cy = cytoscape({
            container: document.getElementById('cy'),
            boxSelectionEnabled: false,
            autounselectify: true,
            pan: { x: 50, y: 50 },
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
                roots: '#'+this.props.code,
                padding: 10,
            }
        });

        cy.minZoom(1);
        cy.maxZoom(5);


        cy.on('tap', function(evt){
            if(evt.cyTarget===cy || evt.cyTarget.isEdge()) return;
            var tapid= cy.$('#'+evt.cyTarget.id());


            if(tapid.hasClass('highlighted')){
                edgeUnmarker(tapid);
            }
            else {
                console.log("tap");
                edgeMarker(tapid);
                findconnected(tapid);
            }

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
            });

            connectedEdges.forEach(function(ele){
                var target = ele.target();
                var source = ele.source();
                if(source.hasClass('highlighted') && markChecker(node)==true) {
                    highLighter(node);
                    return;
                }
            });
        };


        var edgeMarker = function(node){
            node.data('marked',1);
            node.outgoers().forEach(function(ele){
                //console.log(ele);
                ele.data('marked',1);
            });
        };



        var edgeUnmarker = function(node){
            node.data('marked',0);
            unhighLighter(node);
            node.outgoers().forEach(function(ele){
                ele.data('marked',0);
            });
        };


        var markChecker = function(node){
            var result = true;
            node.incomers().forEach(function(ele){
                var value = ele.data('marked');
                if(value==0) result=false;
            });
            //console.log("Ddd");
            return result;
        };




        var highLighter = function(node){
            node.connectedEdges().forEach(function(ele){
                if(ele.target().id()==node.id()) {
                    ele.target().addClass('highlighted');
                    ele.addClass('highlighted');
                }
            });
        };

        var unhighLighter = function(node){
            node.removeClass('highlighted');
            node.connectedEdges().forEach(function(ele){
                //if(ele.target().id()==node.id()) {
                //ele.target().removeClass('highlighted');
                ele.removeClass('highlighted');
                //}
            });
        };

        var findCourse = function(node){
            for(var i=0; i<nodes.length; i++){
                if(nodes[i].id==node.id) return true;
            }
            return false;
        };

        $.ajax({
            url: "/api/path/"+code+"/post",
            dataType: 'json',
            success: function (result) {

                var data = result;
                // var rank = 0;

                var postNode = new node(data);
                nodes.push(postNode);
                postNode.source= postNode;

                var courseAdderPost = function (data){
                    var i;
                    for(i=0; i<data.edgeNumbers; i++){
                        console.log(data);
                        if(findCourse(data.postreq[i])==true) return;
                        else{
                            var newNode = new node(data.postreq[i]);
                            var newEdge = new edgePost(data, newNode);
                            nodes.push(newNode);
                            edges.push(newEdge);
                            courseAdderPost(newNode);
                        }
                    }
                };

                courseAdderPost(postNode); // all the courses added

                $.ajax({
                    url: "/api/path/" + code + "/pre",
                    dataType: 'json',
                    success: function (result) {
                        var data = result;
                        // var rank = 0;


                        var startNode = new node(data);
                        nodes.push(startNode);
                        startNode.source = startNode;

                        var courseAdder = function (data) {
                            var i;
                            for (i = 0; i < data.edgeNumbers; i++) {
                                if (findCourse(data.preq[i]) == true) return;
                                else {
                                    var newNode = new node(data.preq[i]);
                                    var newEdge = new edge(data, newNode);
                                    nodes.push(newNode);
                                    edges.push(newEdge);
                                    courseAdder(newNode);
                                }
                            }
                        };


                        courseAdder(startNode); // all the courses added


                        for(var i =0; i<nodes.length; i++){
                            var id = nodes[i].id;
                            var title = nodes[i].title;
                            // var rank = nodes[i].rank;
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
                            if (i == nodes.length-1) {
                                cy.pan({ x:x/2, y:y });
                            }
                            //cy.$('#'+id).lock();
                            console.log(levelCount);
                        }



                        for(var i =0; i<edges.length; i++){
                            var id = edges[i].id;
                            var source = edges[i].source;
                            var target = edges[i].target;
                            cy.add([
                                { group: "edges", data: { id: id, source: source, target: target, marked : 0}}
                            ])

                        }
                    }
                });






            }
        });








    }

}




class CoursePath extends Component {
    render() {
        return <div id="path">
            <h4>Path visualization:</h4>
            <CourseTree code={this.props.code.toUpperCase()}/>
        </div>;
    }

}

module.exports = CoursePath;