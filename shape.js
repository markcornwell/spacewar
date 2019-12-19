// shape.js
//
// A Shape is a sequence of points centered about the origin.  
// We can rotate the shape about its center and and translate
// to an arbitrary position on the canvas.
//

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