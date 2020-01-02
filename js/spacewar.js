//-----------------------------------------------------------------------------------------------------------
// Spacewar!
// Copyright (C) 2019 by Mark R. Cornwell
// MIT License; see LICENSE for details
//
// Ref: https://en.wikipedia.org/wiki/Spacewar!
//
// This is my interpretation of the classic game "Spacewar!" originally developed for the DEC PDP-1
// in 1962 by Steve Russell in collaboration with Martin Gretz and Wayne Wiitanen.  It holds a special
// place personally for me.  I first read about Spacewar! from an article in my Dad's copy of
// Analog, the science fiction magazine, sometime in the 60's. Then in the 70's while still in High School,
// I visited North Carolina State's EE Department on a college visit.  They had a demo os Spacewar running
// on one of their computers.  That would have been about 1973 or 1974.  It was great!  I had a joystick to
// control the pitch of the ship and a foot button to control thrust.  I think there was a fire button.
// It was magical.  Later in grad school, home for Christams vacation in 1979, I implemented a version 
// of Spaceware in Basic on a Commodor 64.  It worked, and I saved it off on a cassette tape.  So, this is
// my first attempt at spacewar since Chirstmas vacation, 1979 -- 40 years give or take a couple of weeks.
// Long overdue!
//
//-----------------------------------------------------------------------------------------------------------

import { Vector } from './mat2d.js'
import { lineLine, polyLine } from './collide.js'
import { Shape } from './shape.js'
import { Missile, missileArray } from './missile.js'
import { shipScale, starEnable, serverHeight, serverWidth, starRadius } from './parm.js'
import { Ship, explodeShips } from './ship.js'
import { Star } from './star.js'

//-------------------------------------------------
// SETUP --- Define the Shapes and Objects Here
//-------------------------------------------------

const Wedge = Shape( [ Vector(shipScale,0)
				     , Vector(-shipScale, shipScale/4) 
				     , Vector(-shipScale, -shipScale/4)  
				     ]);

const WedgeFlame = Shape( [ Vector (-shipScale, 0)
						  , Vector (-shipScale * 5/4, 0)
						  ]);

const radius = shipScale;


var ship2 = Ship(Wedge, WedgeFlame, serverWidth*(3/4), serverHeight*(1/2), 0 , -0.5, radius, -Math.PI/2);
var ship1 = Ship(Wedge, WedgeFlame, serverWidth*(1/4), serverHeight*(1/2), 0 ,  0.5, radius,  Math.PI/2);


var shipArray = [ ship1, ship2 ];
var star = Star(serverWidth/2, serverHeight/2, starRadius );  // new

//-----------------------------------------
// ANIMATE -- main animation loop
//-----------------------------------------

export function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0,0,innerWidth,innerHeight);
	
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
}

animate();

