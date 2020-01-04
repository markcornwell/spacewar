// missile.js
//
// Missiles come into being when they are launched from ship.  The shipe's
// speed and heading determine the speed and heading of the missile.

import { SHIP_SCALE, MISSILE_SPEED, MISSILE_LIFE } from './parm.js';
import { polyLine } from './collide.js';
import { ship_shapeInPosition } from './ship.js'

// constructs a new Missile fired from the front of the given ship
export function Missile(ship) {
	return {
		tag: "missile",
		x: ship.x + SHIP_SCALE * 1.5 * Math.cos(ship.theta),
		y: ship.y + SHIP_SCALE * 1.5 * Math.sin(ship.theta),
		dx: ship.dx + MISSILE_SPEED * Math.cos(ship.theta),
		dy: ship.dy + MISSILE_SPEED * Math.sin(ship.theta),
		life: MISSILE_LIFE
	}}

// returns true if the ship is hit by the missile
export function missile_hit(missile,body,dt) {    // -> ship | null
	if (body.tag != "ship") {
		return false;
	} else {
		let pl = ship_shapeInPosition(body).pointList;
		return polyLine(pl,missile.x, missile.y, missile.x + missile.dx * dt, missile.y + missile.dy * dt)
	}
}
