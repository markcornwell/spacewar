//----------------------------------------------------------------------------------------------------------
// Spacewar!
// Copyright (C) 2019 by Mark R. Cornwell
// MIT License; see LIECNSE for details
//
// Ref: https://en.wikipedia.org/wiki/Spacewar!
//
// This is my interpretation of the classic game "Spacewar!" originally developed for the DEC PDP-1
// in 1962 by Steve Russell in collaboration with Martin Gretz and Wayne Wiitanen.  It holds a special
// place personally for me.  I first read about Spacewar! from an article in my Dad's copy of
// Analog, the science fiction magazine, sometime in the 60's. Then in the 70's while still in High School,
// I visited North Carolina State's EE Department on a college visit.  They have a demo os space war running
// on one of their computers.  That would have been about 1973 or 1974.  It was great!  I had a joystick to
// control the pitch of the ship and a foot button to control thrust.  I think there was a fire button.
// It was magical.  Later in grad school, home for Christams vacation in 1979, I implemented a version 
// of Spaceware in Basic on a Commodor 64.  It worked, and I saved it off on a cassette tape.  So, this is
// my first attempt at spacewar since Chirstmas vacation, 1979.  40 years give or take a couple of weeks.
// Long overdue!
//
//----------------------------------------------------------------------------------------------------------

import { Matrix, Vector, R } from './mat2d.js'
import { lineLine, polyLine } from './collide.js'
import { Shape } from './shape.js'
import { Missile, missileArray } from './missile.js'
import { shipScale, missileLife, rotationDelta, burnForce } from './parm.js'
import { Ship, shipArray, explodeShips } from './ship.js'
import { Star } from './star.js'

// Initialize the canvas context

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

// --------------------------------------------------
// Keybord Commands and Controls
//
// We want the burn as long as the key is pressed
// and end when the player releases the key.
//--------------------------------------------------

document.addEventListener('keydown',commandKeyDown);
document.addEventListener('keyup', commandKeyUp);

function commandKeyDown(e) {
	console.log(e);

	if (e.code == "KeyD") {
		ship1.rotate(rotationDelta);
	} else if (e.code == "KeyA") {
		ship1.rotate(-rotationDelta);
	} else if (e.code == "KeyS") {
		ship1.burn(burnForce);
		ship1.burnOn = true;
	} else if (e.code == "KeyW") {
		//ship1.fire();
		console.log("fire");
		new Missile(ship1);
	} else if (e.code == "KeyL") {
		ship2.rotate(rotationDelta);
	} else if (e.code == "KeyJ") {
		ship2.rotate(-rotationDelta);
	} else if (e.code == "KeyK") {
		ship2.burn(burnForce);
		ship2.burnOn = true;
	} else if (e.code == "KeyI") {
		//ship2.fire();
		console.log("fire");
		new Missile(ship2);
	}
}

function commandKeyUp(e) {
	//console.log(e);
	if (e.code == "KeyS") {
		ship1.burnOn = false
	} else if (e.code == "KeyK") {
		ship2.burnOn = false
	}
}

//-------------------------------------------------
// SETUP --- Define the Shapes and Objects Here
//-------------------------------------------------

var Wedge = new Shape( 	[ new Vector(shipScale,0)
				  		, new Vector(-shipScale, shipScale/4) 
						, new Vector(-shipScale, -shipScale/4)  
						]);

var WedgeFlame = new Shape( [ new Vector (-shipScale, 0)
							, new Vector (-shipScale * 5/4, 0)
							]);

var radius = shipScale;

var ship2 = new Ship(Wedge, WedgeFlame, canvas.width*(3/4), canvas.height*(1/2), 0 , -0.2, radius, -Math.PI/2);
var ship1 = new Ship(Wedge, WedgeFlame, canvas.width*(1/4), canvas.height*(1/2), 0 ,  0.2, radius,  Math.PI/2);


shipArray.push(ship1);
shipArray.push(ship2);

var star = new Star();

//-----------------------------------------
// ANIMATE -- main animation loop
//-----------------------------------------

export function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0,0,innerWidth,innerHeight);

	// Update Star - assign gravitational forces to ships
	star.update(c,shipArray);
	
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

	// remoave any exploded ships
	explodeShips();

}

animate();
