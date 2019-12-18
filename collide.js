// collide.js
//
// Collision Detection
// http://www.jeffreythompson.org/collision-detection/line-line.php


export function lineLine(x1,y1,x2,y2,x3,y3,x4,y4) {

  // calculate the distance to intersection point
  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}

export function polyLine(pointList, x1, y1, x2, y2) {

  // go through each of the vertices, plus the next
  // vertex in the list
  var next;
  for (var current=0; current < pointList.length; current++) {

    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current+1;
    if (next == pointList.length) {
    	next = 0;
    }

    // get the PVectors at our current position
    // extract X/Y coordinates from each
    var x3 = pointList[current].x;
    var y3 = pointList[current].y;
    var x4 = pointList[next].x;
    var y4 = pointList[next].y;

    // do a Line/Line comparison
    // if true, return 'true' immediately and
    // stop testing (faster)
    var hit =lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
    	console.log("polyLine hit!")
      	return true;
    } 
  }
  return false;
}

