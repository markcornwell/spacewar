// ship.js

// A Ship will have postion x,y and a velocity dx,dy.  It will also have
// orientation described by an angle theta measured from the horizontal
// in radians, e.g. Pi/2 points straight up. 

import { Shape } from './shape.js';
import { Vector } from './mat2d.js';


export function Ship(shape,flame,x,y,dx,dy,radius,theta) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.theta = theta;
	this.burnOn = false;
	this.shape = shape;
	this.flame = flame;
	this.explode = false;

    this.draw = function(c) {
    	this.shape.rotate(this.theta).translate(new Vector(this.x,this.y)).draw(c);
    	if (this.burnOn) {
    		this.flame.rotate(this.theta).translate(new Vector(this.x,this.y)).draw(c);
    	}     
    }

    this.shapeInPosition = function () {
    	return this.shape.rotate(this.theta).translate(new Vector(this.x,this.y))
    }

	// Update ecapsulates the game physics of the object.  Right now ships bounce off
	// the edges of the canvas.  This will change.  We want the ships that go
	// off the top to come back on the bottoms, and simmilarly wrap around on
	// all found sides of the drawing a

	this.update = function(c) {
		if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
			this.dx = -this.dx;
		}
		if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
			this.dy = -this.dy;
		}
	
		this.x += this.dx;
		this.y += this.dy;

		this.draw(c);
	}

	// Rotate by adding some angle to theta.  Keeps theta normalized between
	// -2*PI and +2*PI.

	this.rotate = function(delta) {
		//console.log("rotate");
		this.theta = this.theta + delta;
		if (this.theta > (2*Math.PI))  {
			this.theta = this.theta - (2*Math.PI);
		} else if (this.theta < -2*Math.PI) {
			this.theta = this.theta + (2*Math.PI);
		}
	}

	// Burn applies a force in the direction theta which will modify the dx,dy
	// components of the velocity.

	this.burn = function(force) {
		console.log("Burn");
	    this.dx = this.dx + force * Math.cos(this.theta);
	    this.dy = this.dy + force * Math.sin(this.theta);
	}

}
