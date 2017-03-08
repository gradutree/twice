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
        },


      
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#a, #b, #c, #d, #e', 
        padding: 10
      }
    });




    //highlight the node
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