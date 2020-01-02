//-----------------------------------------------------------------------------------------------------------
// Spacewar!
// Copyright (C) 2019 by Mark R. Cornwell
// MIT License; see LICENSE for details
//
// Ref: https://en.wikipedia.org/wiki/Spacewar!
//
//
// outline of main animatin loop ( Play mode )
//
// Destruction 
// * destroy any bodies colliding with sun
// * destroy any ships colliding with another ship
// * destroy any ships colliding with missile
// * destroy any missiles with no life
// * destroy any missiles colliding with ship
// * destroy any missiles colliding with missile
//
// Controls
// * read and record the control states
// * pick a time dt to apply the control
// * apply any rotations implied by control
// * apply any forces implied by the control
//
//  Gravity
// * apply any forces implied by the sun
//
// Motions
// * update xy for all bodies
// Display
// * update the display from the current position/rotation of all existing bodies
//
// Note: 
// * collisions create explosion animations managed on client side
// * sparkling sun animation managed on client side
// * potential for different client side skins
//
//-----------------------------------------------------------------------------------------------------------

//import { Vector } from './mat2d.js'
import { lineLine, polyLine } from './collide.js'
import { Shape } from './shape.js'
import { Missile } from './missile.js'
import { SHIP_SCALE, STAR_ENABLE, SERVER_HEIGHT, SERVER_WIDTH, STAR_RADIUS, WEDGE, WEDGE_FLAME, ROTATION_DELTA } from './parm.js'
import { Ship, ship_burn } from './ship.js'
import { Star, star_gravity } from './star.js'
import { ship_draw, star_draw, draw_clear } from './draw.js'
import { body_update_xy, body_rotate } from './body.js'
import { getControl } from './controls.js'


const radius = SHIP_SCALE;

let ship2 = Ship(WEDGE, WEDGE_FLAME, SERVER_WIDTH*(3/4), SERVER_HEIGHT*(1/2), 0 , -0.05, radius, -Math.PI/2);
let ship1 = Ship(WEDGE, WEDGE_FLAME, SERVER_WIDTH*(1/4), SERVER_HEIGHT*(1/2), 0 ,  0.05, radius,  Math.PI/2);

// assign ships to control slots (ship i get control i-1)
ship1.slot = 0;
ship2.slot = 1;

let star = Star(SERVER_WIDTH/2, SERVER_HEIGHT/2, STAR_RADIUS );  // new

console.log(star);

let space = { x: SERVER_WIDTH, y: SERVER_HEIGHT };   // note that space is in server coordinates -- correct later

let control = getControl();

// put all game bodies in one flat array.  Bodies will have a tag to make further distinctions as necessary.
	
let everybody = [ship1, ship2, star];

console.log(everybody);

function draw(body) {
	switch(body.tag) {
		case "ship" : ship_draw(body);  break;
	    case "star" : star_draw(body);  break;
	}
}

//-----------------------------------------
// ANIMATE -- main animation loop
//-----------------------------------------

function animate() {
	requestAnimationFrame(animate);

// outline of main animatin loop ( Play mode )
//
// Destruction 
// * destroy any bodies colliding with sun
// * destroy any ships colliding with another ship
// * destroy any ships colliding with missile
// * destroy any missiles with no life
// * destroy any missiles colliding with ship
// * destroy any missiles colliding with missile
//
// Controls

// * read and record the control states
	let ships = everybody.filter(body => body.tag == "ship"); 

    
// * pick a time dt to apply the control
	let dt = 1000/60;

// * apply any rotations implied by control

    console.log(control[0]);

    const rotateR = body => (body.tag == "ship" && (control[body.slot].rotateRight && body_rotate(body,-ROTATION_DELTA,dt)) || body);
    const rotateL = body => (body.tag == "ship" && (control[body.slot].rotateLeft && body_rotate(body,  ROTATION_DELTA,dt)) || body);
    everybody = everybody.map(rotateR);
    everybody = everybody.map(rotateL);

// * apply any forces implied by the control
    everybody = everybody.map(body => (body.tag == "ship" && (control[body.slot].burnOn && ship_burn(body,dt))  || body));

//  Gravity
// * apply any forces implied by the sun
	everybody = everybody.map(body => star_gravity(star,body,dt));
//
// Motions
// * update xy for all bodies
	everybody = everybody.map(body => body_update_xy(body,space,dt));

// Display
// * update the display from the current position/rotation of all existing bodies
    draw_clear();
	everybody.map(draw);

// Note: 
// * collisions create explosion animations managed on client side
// * sparkling sun animation managed on client side
// * potential for different client side skins

	//c.clearRect(0,0,innerWidth,innerHeight);


	/**********************************
    // OLD CHEESE
    //
	// Update Star - assign gravitational forces to ships
	if (starEnable) {
		star.update(c,shipArray);
	}

	// Update Shipes
	for (var i  = 0; i < shipArray.length; i++) {
		shipArray[i].update(c)
	}

    // Clear away missiles whose life has expired. 
	// Oldest missiles are always on the front of the array
	while( missileArray.length >0 && missileArray[0].life < 0) {
		missileArray.shift();
	}

    // update missiles
	for (var i = 0; i < missileArray.length; i++) {
		missileArray[i].update(c,shipArray)
	}

	// remove any exploded ships 
	explodeShips();
	*************************************/
}

animate();

