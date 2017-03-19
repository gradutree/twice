import React, {Component} from 'react';
import cytoscape from 'cytoscape';


class Cytoscape extends Component{
  //cy = null;

  componentDidMount(){
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
              console.log("tap");
              newCredit+=0.5;
              edgeMarker(tapid);
              findconnected(tapid);
            }
            document.getElementById('qty').value = newCredit + "/20";

        });


       var nodeAdder = function (nodes){
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
             cy.add([{group: "nodes", data: {id: id, title: title}, position:{x:x , y:y}}])
              //cy.$('#'+id).lock();
              console.log(levelCount);
            }
         }



          var edgeAdder = function (edges){
              for(var i =0; i<edges.length; i++){ 
                  var id = edges[i].id;
                  var source = edges[i].source;
                  var target = edges[i].target;
                  cy.add([{ group: "edges", data: { id: id, source: source, target: target, marked : 0}}])
              }
           }



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

  shouldComponentUpdate(){
    return false;
  }

  componentWillReceiveProps(nextProps){
    this.cy.json(nextProps);
  }

  componentWillUnmount(){
    this.cy.destroy();
  }

  getCy(){
    return this.cy;
  }

  render(){
    return <div style={cyStyle} ref="cyelement" />
  }




}






export default Cytoscape;