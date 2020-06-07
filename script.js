const X_MUL = 1000;
const Y_MUL = 700;

d3.json("moves.json")
  .then(function (data) {

    const tree = d3.tree();

    const myTree = tree(d3.hierarchy(data));
    window.myTree = myTree;


    myTree.each((node) => {
      createCircle(node);
      if(node.children) {
        for(let childNode of node.children ) {
          createLine(node.x * X_MUL, node.y * Y_MUL, childNode.x *X_MUL, childNode.y * Y_MUL);
        }
      }
    })

  });

function getNodeIndex(node) {
  return `h${node.height}d${node.depth}`;
}

function createCircle(node) {
  var x = node.x * X_MUL;
  var y= node.y * Y_MUL;
  var svg = document.getElementById('svg');
  var xmlns = "http://www.w3.org/2000/svg";
  var circle = document.createElementNS(xmlns, 'circle');

  setAttributes(circle, {
      'cx': x, 'cy':y, 'r' : 2,
      'stroke' :  'black',
      'stroke-width' : '4',
      'id' : getNodeIndex(node)
  });



  var animate = document.createElementNS(xmlns, 'animate');
  setAttributes(animate, {
    'xlink:href' : `#${getNodeIndex(node)}`,
    attributeName: 'cx',
    attributeType: 'xml',
    from : 200,
    to : 1000,
    dur: '3s',
    begin: '0s',
    repeatCount: 1,
    fill: 'freeze'
  });


  // circle.appendChild(animate);
  svg.appendChild(circle);
  animate.beginElement()

}

function createLine(x1, y1, x2, y2) {
  var svg = document.getElementById('svg');
  var xmlns = "http://www.w3.org/2000/svg";
  var line = document.createElementNS(xmlns, 'line');
  setAttributes(line, {
    x1, y1, x2,y2,
    style: 'stroke:black;stroke-width:1'
  });
  svg.appendChild(line);
}

function setAttributes(node, attributes) {
  for([val, key] of Object.entries(attributes)) {
    node.setAttribute(val, key);
  }
}
