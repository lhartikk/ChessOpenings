 var bigCircleRadius = 15;
 var circleRadius = 4.5;
 var diameter = 2500;

 $(document).ready(function() {
     var tree = createTree();
     var svg = createSvg();

     d3.json("moves.json", function(error, root) {
         var nodes = tree.nodes(root),
             links = tree.links(nodes);

         createLinks(svg, links);
         var node = createNodes(svg, nodes);
         createCircles(node);
         var nodeText = createTexts(node);

         createPrefixMove(nodeText);
         createHrefs(nodeText);
         createPostfixMove(nodeText);
         scrollToCenter();
     });

     d3.select(self.frameElement).style("height", diameter - 150 + "px");

     $('#start').click(function(e) {
         scrollToCenter();
         e.preventDefault();
     });
 })

 function createTree() {
     return d3.layout.tree()
         .size([360, diameter / 2 - 120])
         .separation(function(a, b) {
             return (a.parent == b.parent ? 1 : 2) / a.depth;
         });
 }

 function createLinks(svg, links) {
     var diagonal = d3.svg.diagonal.radial()
         .projection(function(d) {
             return [d.y, d.x / 180 * Math.PI];
         });
     svg.selectAll(".link")
         .data(links)
         .enter().append("path")
         .attr("class", "link")
         .attr("d", diagonal);
 }

 function createTexts(nodes) {
     return nodes.append("text")
         .attr("dy", ".31em")
         .attr("text-anchor", function(d) {
             return d.x < 180 ? "start" : "end";
         })
         .attr("transform", function(d) {
             return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
         })
 }

 function createCircles(nodes) {
     nodes.append("circle")
         .attr("r", function(d, i) {
             if (i == 0) {
                 return bigCircleRadius;
             }
             return circleRadius;
         })
 }

 function createNodes(svg, nodes) {
     return svg.selectAll(".node")
         .data(nodes)
         .enter().append("g")
         .attr("class", "node")
         .attr("transform", function(d) {
             return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
         })
 }

 function createSvg() {
     return d3.select("body").append("svg")
         .attr("width", diameter)
         .attr("height", diameter - 150)
         .append("g")
         .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
 }

 function createHrefs(nodeTexts) {
     nodeTexts.append("tspan")
         .attr("font-weight", "200")
         .append("a")
         .attr("xlink:href", function(d) {
             return d.link;
         })
         .attr("target", "_blank")
         .text(function(d) {
             return (d.name != null ? d.name : "");
         });
 }

 function createPrefixMove(nodeTexts) {
     nodeTexts.append("tspan")
         .attr("font-weight", "bold")
         .text(function(d) {
             if (d.x < 180) {
                 return " " + d.move + " ";
             }
         });
 }

 function createPostfixMove(nodeTexts) {
     nodeTexts.append("tspan")
         .attr("font-weight", "bold")
         .text(function(d) {
             if (d.x >= 180) {
                 return " " + d.move + " ";
             }
         })
 }

 function scrollToCenter() {
     var position = $("circle[r='" + bigCircleRadius + "']").offset();
     $("html, body").animate({
         scrollTop: (position.top - window.innerHeight / 2) + "px",
         scrollLeft: (position.left - window.innerWidth / 2) + "px"
     });
     return false;
 }
