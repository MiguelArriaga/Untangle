var zoom = 1.00;
var zMin = 0.05;
var zMax = 9.00;
var wheelSensitivity = 0.0007;
var touchSensitivity = 0.005;
var xCenter = 0;
var yCenter = 0;
var xOffset = 0;
var yOffset = 0;
var xOffsetStartPan = 0;
var yOffsetStartPan = 0;
var mouseXStartPan;
var mouseYStartPan;
var panning = false;

function zoomPan() {
  if (panning) {
    xOffset = xOffsetStartPan - (mouseX - mouseXStartPan)/zoom;
    yOffset = yOffsetStartPan - (mouseY - mouseYStartPan)/zoom;
  }
  // console.log(xOffset)
  xCenter = width / 2 + xOffset;
  yCenter = height / 2 + yOffset;
  
  translate(width / 2,height / 2); // Centers the scale point
  scale(zoom);
  translate(-xCenter,-yCenter); // Brings center back + Offset

}

function zoomRelEvent(delta) {
  // zoom += sensitivity * delta;
  zoom *= (1+wheelSensitivity*delta);
  zoom = constrain(zoom, zMin, zMax);
}


function zoomAbsEvent(delta) {
  // zoom += sensitivity * delta;
  zoom = zoom0*(1-touchSensitivity*delta);
  zoom = constrain(zoom, zMin, zMax);
}

function centerScreen() {
    xOffset = 0;
    yOffset = 0;
}

function startPan() {
    mouseXStartPan = mouseX;
    mouseYStartPan = mouseY;
    xOffsetStartPan = xOffset;
    yOffsetStartPan = yOffset;
    panning = true;
}

function endPan() {
    panning = false;
}



// Get World coordinates
function wx(x) {
  let mx = x - width/2;
  mx *= 1/zoom;
  mx += xCenter;
  return mx;
}

function wy(y) {
  let my = y - height/2;
  my *= 1 / zoom;
  my += yCenter;
  return my;
}


function wmouseX() {
  return wx(mouseX);
}

function wmouseY() {
  return wy(mouseY);
}