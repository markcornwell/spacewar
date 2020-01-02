// ship.js
//
// A Ship will have postion x,y and a velocity dx,dy.  It will also have
// orientation described by an angle theta measured from the horizontal
// in radians, e.g. Pi/2 points straight up. 

import { BURN_FORCE, ROTATION_DELTA } from './parm.js'
import { Shape, shape_translate, shape_rotate } from './shape.js'
import { Missile } from './missile.js'


export function explodeShips() {
	//shipArray = shipArray.filter(ship => (ship.explode == false));
	return shipArray.filter(ship => (ship.explode == false));
}

// Refactoring - Ship object is trying to do too many things.
// Don't need so many ship specific functions.
// Changes:
//  1) let generic operators on body take care of updates
//     to position x,y  and  velocity dx,dy.
//  2) Can keep theta and burnOn properties, they can be
//      used by drawing and velocity update.
//  3) Eliminate ship_shapeInPostion, it is just a callthrough,
//     use generics ot position the body shape instead.
//  4) Eliminate rotateRight and rotateLeft.  Let toplevel
//     control application pass manipulate theta directly.
//  5) Eliminate fire, ship will not need to create missiles.
//  6) Keep flame, since we can use it to draw the tail is
//     needed.
//  7) Keep shape, will access that for collision detection
//     and for drawing.  BUt ship funcitons don't care.    
//  8) Keep explode for now.  Looks useful to let separate
//     pass take care of explosions and deleting ships from
//     and externally maintained list.

export function Ship(shape,flame,x,y,dx,dy,radius,theta) {
	return {
		tag: "ship",
		x: x,
		y: y,
		dx: dx,
		dy: dy,
		radius: radius,
		theta: theta,
		burnOn: false,
		//rotateRight: false,
		//rotateLeft: false,
		fire: false,
		shape: shape,
		flame: flame,
		explode: false,
	}
}

// retruns the shape of the ship rotated and translated into its current position
//export function ship_shapeInPosition(ship) {
//    	return shape_translate(shape_rotate(ship.shape,
//    		                                ship.shape.theta),
//    						   Vector(ship.x,ship.y))     
//    }

// Rotate by adding some angle to theta.  Keeps theta normalized between
// -2*PI and +2*PI.

// make this generic to rotate any body with an orientation theta.  Put in body.js

// replace all calls to object specific ship rotate with the generic body_rotate
function ship_rotate(ship,delta,dt) {  // returns a new ship rotated by delta * ticks
	let new_theta = normalize(ship.theta + delta*dt);
	return Object.assign( {}, ship, { theta: new_theta } );
}

function normalize_angle(delta) {
	if (delta < 0) return normalize(delta + 2*Math.Pi);
	if (delta > 2*Math.PI) return normalize(delta - 2*Math.Pi);
	return delta;
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

