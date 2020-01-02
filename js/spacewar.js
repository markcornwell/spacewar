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
import { SHIP_SCALE, STAR_ENABLE, SERVER_HEIGHT, SERVER_WIDTH, STAR_RADIUS, WEDGE, WEDGE_FLAME } from './parm.js'
import { Ship, explodeShips } from './ship.js'
import { Star } from './star.js'
import { ship_draw, draw_clear } from './draw.js'
import { body_update_xy } from './body.js'


const radius = SHIP_SCALE;

let ship2 = Ship(WEDGE, WEDGE_FLAME, SERVER_WIDTH*(3/4), SERVER_HEIGHT*(1/2), 0 , -0.05, radius, -Math.PI/2);
let ship1 = Ship(WEDGE, WEDGE_FLAME, SERVER_WIDTH*(1/4), SERVER_HEIGHT*(1/2), 0 ,  0.05, radius,  Math.PI/2);

let star = Star(SERVER_WIDTH/2, SERVER_HEIGHT/2, STAR_RADIUS );  // new

let space = { x: SERVER_WIDTH, y: SERVER_HEIGHT };   // note that space is in server coordinates -- correct later


// put all game bodies in one flat array.  Bodies will have a tag to make further distinctions as necessary.
	
let everybody = [ship1, ship2];

function draw(body) {
	switch(body.tag) {
		case "ship" : ship_draw(body);
				      break;
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
// * pick a time dt to apply the control
// * apply any rotations implied by control
// * apply any forces implied by the control
//
//  Gravity
// * apply any forces implied by the sun
//
// Motions
// * update xy for all bodies

	let dt = 1000/60;
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

