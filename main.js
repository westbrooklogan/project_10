var fs = require('fs'),
    fabric = require('fabric').fabric,
    out = fs.createWriteStream(__dirname + '/helloworld.png');

var canvas = new fabric.StaticCanvas(null, {
  backgroundColor:'white', width: 550, height: 500 });

var text = new fabric.Text('Hello world', {
  left: 100,
  top: 100,
  fill: '#f55',
  angle: 15,
});

var coords = [210, 90, 350, 90];

var line = new fabric.Line(coords, {
    stroke: 'black',
    strokeWidth: 4
});

var rect1 = new fabric.Rect({
    width: 160,
    height: 80,
    fill: '#ff0004',
    stroke: 'black',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center'
});

var rect2 = new fabric.Rect({
    width: 160,
    height: 80,
    fill: '#ff0004',
    stroke: 'black',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center'
});

var text1 = new fabric.Text('sample text 1', {
  fontSize: 24,
  originX: 'center',
  originY: 'center'
});

var text2 = new fabric.Text('sample text 2', {
  fontSize: 24,
  originX: 'center',
  originY: 'center'
});

var group1 = new fabric.Group([rect1, text1], {
  left: 50,
  top: 50
});

var group2 = new fabric.Group([rect2, text2], {
  left: line.get('x2'),
  top: 50
});

canvas.add(line, group1, group2);
canvas.renderAll();

var stream = canvas.createPNGStream();
stream.on('data', function(chunk) {
  out.write(chunk);
});