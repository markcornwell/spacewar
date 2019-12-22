// missile.js
//

// Missiles come into being when they are launched from ship.  The shipe's
// speed and heading determine the speed and heading of the missile.

import { scale, missileSpeed, missileLife } from './parm.js';
import { polyLine } from './collide.js';

export var missileArray = [];

export function Missile(ship) {
	this.x = ship.x + scale * 1.5 * Math.cos(ship.theta);
	this.y = ship.y + scale * 1.5 * Math.sin(ship.theta);
	this.dx = ship.dx + missileSpeed * Math.cos(ship.theta);
	this.dy = ship.dy + missileSpeed * Math.sin(ship.theta);
	this.life = missileLife;
	missileArray.push(this);
	console.log("new missile");

	this.draw = function(c) {
		c.beginPath();
		c.arc(this.x,this.y,2,0,2*Math.PI,false);
        c.stroke();
	}

	this.update = function(c,shipArray) {

		this.life -= 1;

		// look for any ships missile might have hit
		//
		for (var i  = 0; i < shipArray.length; i++) {
			var pointList = shipArray[i].shapeInPosition().pointList;
			if (polyLine(pointList, this.x, this.y, this.x + 10*this.dx, this.y + 10*this.dy)) {
				console.log("missile hit!");
				shipArray[i].explode = true;
				this.life = 0;
			}
		}

	    // upate the missile position
	    //
		this.x += this.dx + window.innerWidth;   // stay in positive coordinates
		this.y += this.dy + window.innerHeight;
		this.x %= window.innerWidth;             // mod to wrap around screen
		this.y %= window.innerHeight;

		this.draw(c);
	}
}


