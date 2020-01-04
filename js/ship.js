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
		shape: shape,
		flame: flame,
		explode: false,
	}
}

export function ship_shapeInPosition(ship) {
	return shape_translate(shape_rotate(ship.shape, ship.theta),{ x: ship.x, y: ship.y });
}

export function ship_burn(ship,dt) {
	let new_dx = ship.dx + BURN_FORCE * dt * Math.cos(ship.theta);
	let new_dy = ship.dy + BURN_FORCE * dt * Math.sin(ship.theta);
	return Object.assign({}, ship, { dx: new_dx, dy: new_dy });
}
