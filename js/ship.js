// ship.js
//
// A Ship will have postion x,y and a velocity dx,dy.  It will also have
// orientation described by an angle theta measured from the horizontal
// in radians, e.g. Pi/2 points straight up. 

import { BURN_FORCE, ROTATION_DELTA } from './parm.js'
import { Shape, shape_translate, shape_rotate } from './shape.js'
import { Vector } from './mat2d.js'
import { Missile } from './missile.js'

export function explodeShips() {
	//shipArray = shipArray.filter(ship => (ship.explode == false));
	return shipArray.filter(ship => (ship.explode == false));
}


export function Ship(shape,flame,x,y,dx,dy,radius,theta) {
	return {
		x: x,
		y: y,
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
}

// retruns the shape of the ship rotated and translated into its current position
export function ship_shapeInPosition(ship) {
    	return shape_translate(shape_rotate(ship.shape,
    		                                ship.shape.theta),
    						   Vector(ship.x,ship.y))     
    }

// Rotate by adding some angle to theta.  Keeps theta normalized between
// -2*PI and +2*PI.

function ship_rotate(ship,delta,ticks) {  // returns a new ship rotated by delta * ticks
	assert ( 0 <= delta && delta < 2*Math.Pi);
	let deltat = delta*ticks;
	assert ( 0 < deltat && deltat < 2*Math.PI);
	let theta = (ship.theta + deltat > 2*Math.Pi ? ship.theta + deltat - 2*Math.Pi : ship.theta + deltat)
	return Object.assign( {}, ship, { theta: theta } )
}

// Burn applies a force in the direction theta which will modify the dx,dy
// components of the velocity.

function ship_burn(ship,force,ticks) {
	console.log("Burn");
	new_dx = ship.dx + force * ticks * Math.cos(ship.theta);
	new_dy = ship.dy + force * ticks * Math.sin(ship.theta);
	Object.assign({}, ship, { dx: new_dx, dy: new_dy });
}

function Control(burnOn,rotateRight,rotateLeft,fire) {
	assert( tyepof(burnOn)==="Boolean");
	return { burnOn: burnOn
		   , rotateRight: rotateRight
		   , rotateLeft: rotateLeft
		   , fire: fire
		   }
}

// returns a ship wtih controls set as given
function ship_set_controls(ship,control) {
	Object.assign( {}, ship, control )
}

// returns a ship updated the ship physics -- (need some time interval)
// returns { missiles, ship }

function ship_update(ship, ticks) {
	let ship_1 = (ship.burnOn ? ship_burn(ship,force,ticks) : ship);
	let ship_2 = (ship.rotateRight ? ship_rotate(ship_1, -rotationDelta) : ship_1);  
    let ship_3 = (ship.rotateLeft  ? ship_rotate(ship_2, rotationDelta) : ship_2);
    let ship_4 = Object.assign( {}, ship_3, { x: (ship.x + serverWidth) % serverWidth
                                            , y: (ship.y + serverHeight) % serverHeight 
                                            })
    return { missile: (ship_4.fire ? Missile(ship_4) : null)
           , ship: Object.assign( {}, ship_4, { fire: false })
           }
}

