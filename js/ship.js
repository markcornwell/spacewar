// ship.js
//
// A Ship will have postion x,y and a velocity dx,dy.  It will also have
// orientation described by an angle theta measured from the horizontal
// in radians, e.g. Pi/2 points straight up. 

import { Shape } from './shape.js'
import { Vector } from './mat2d.js'
import { rotationDelta, burnForce } from './parm.js'
import { Missile } from './missile.js'


//export var shipArray = [];

export function explodeShips() {
	//shipArray = shipArray.filter(ship => (ship.explode == false));
	return shipArray.filter(ship => (ship.explode == false));
}


export function Ship(shape,flame,x,y,dx,dy,radius,theta) {
	return {
		x: x,
		y: y;
		dx: dx,
		dy: dy,
		radius: radius,
		theta: theta,
		burnOn: false,
		rotateRight: false,
		rotateLeft: false,
		fire: false,
		shape: shape,
		flame: flame,
		explode: false,
	}

// retruns the shape of the ship rotated and translated into its current position
export function ship_shapeInPosition(ship) {
    	return shape_translate(shape_rotate(ship.shape,
    		                                ship.shape.theta),
    						   vector(ship.x,ship.y))     
    }

//------------ Drawing Functions use canvas

    this.draw = function(c) {
    	this.shape.rotate(this.theta).translate(new Vector(this.x,this.y)).draw(c);
    	if (this.burnOn) {
    		this.flame.rotate(this.theta).translate(new Vector(this.x,this.y)).draw(c);
    	}     
    }


	this.update = function(c) {

		// handle control actions
		if (this.burnOn) {
			this.burn(burnForce);
		}
		if (this.rotateRight) {
			this.rotate(-rotationDelta);
		}
		if (this.rotateLeft) {
			this.rotate(rotationDelta);
		}
		if (this.fire) {
			new Missile(this);
			this.fire = false;
		}

		this.x += this.dx + window.innerWidth;   // stay in positive coordinates
		this.y += this.dy + window.innerHeight;
		this.x %= window.innerWidth;             // mod to wrap around screen
		this.y %= window.innerHeight;

		this.draw(c);                            // core redraw

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
