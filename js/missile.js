// missile.js
//
// Missiles come into being when they are launched from ship.  The shipe's
// speed and heading determine the speed and heading of the missile.

import { SHIP_SCALE, MISSILE_SPEED, MISSILE_LIFE } from './parm.js';
import { polyLine } from './collide.js';

//export var missileArray = [];

// constructs a new Missile fired from the front of the given ship
export function Missile(ship) {
	return {
		x: ship.x + SHIP_SCALE * 1.5 * Math.cos(ship.theta),
		y: ship.y + SHIP_SCALE * 1.5 * Math.sin(ship.theta),
		dx: ship.dx + MISSILE_SPEED * Math.cos(ship.theta),
		dy: ship.dy + MISSILE_SPEED * Math.sin(ship.theta),
		life: MISSILE_LIFE
	}}


// Updates the missile and reports any ships destroyed in return value.
// Returns a map { missile: <missile>, hit: <ship> }
// Idea is to percolate information out via the return value for
// the caller to pick up and process.

export function missile_update(missile,dt,shipArray) {  // => { missile: <missile>, hit: <ship> }

	// look for any ships missile might have hit
	//
	for (var i  = 0; i < shipArray.length; i++) {
		let victim = missile_hit(missile, shipArray[i], dr)
		if (victim != null) break;
	}

	// wraps around
	let new_x = (missile.x + missile.dx + SERVER_WIDTH)  % SERVER_WIDTH;
	let new_y = (missile.y + missile.dy + SERVER_HEIGHT) % SERVER_HEIGHT;

	let new_missile = Object.assign( {}
			                       , missile, { x: new_x
			                       , y: new_y
			                       , life: ( victim == null? missle.life-1 : 0 ) 
			                       })

	return { missile: new_missile, hit: victim }
}

// returns the ship hit by missile, marked to explode, or null if ship not hit
//
function missile_hit(missile,ship,dt) {    // -> ship | null 
	let pl = ship_shapeInPosition(ship).pointList;
	if (polyLine(pl,missile.x, missile.y, missile.x + missile.dx * dt, missile.y + missile.dy * dt)) {
		return Object.assign( {}, ship, { explode: true });
	} else {
		return null;
	}
}
