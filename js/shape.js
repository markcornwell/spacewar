// shape.js
//
// A Shape is a sequence of points in cartesian coodinates
// with respect to an orthogonal x,y coodinates. 
// We can rotate the shape about the origin and and translate
// that shape to an arbitrary position on the canvas.
//
// For any given rotation and translation, a shape will have
// a bounding box.

import { Vector, R } from './mat2d.js'

export function Shape(pointList) {

	this.pointList = pointList;

	this.rotate = function(theta){
		return new Shape(this.pointList.map(p => R(theta).multv(p)));
	}

	this.translate = function(v) {
		return new Shape(this.pointList.map(p => p.translate(v)));
	}

	this.draw = function(c) {
		if (pointList.length == 0) {
			console.log("Warning: Shape draw has empty pointList");
			return this;
		}
    	c.beginPath();
		c.strokeStyle = 'white';
		c.moveTo(pointList[0].x,pointList[0].y)

		for (var i = 1; i<pointList.length; i++) {
			c.lineTo(pointList[i].x,pointList[i].y);
		}
        
        c.lineTo(pointList[0].x,pointList[0].y);
		c.strokeStyle = 'white';
		c.stroke();
	}
}


// A box is defined by its top left (x0,y0) and bottom right(x1,y1)

export function Box(x0,y0,x1,y1) {
	this.x0 = x0;  // left
	this.y0 = y0;  // top
	this.x1 = x1;  // rigth
	this.x2 = x2;  // bottom
}