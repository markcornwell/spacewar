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

document.addEventListener('keydown', commandKeyDown);
document.addEventListener('keyup', commandKeyUp);

function commandKeyDown(e) {
	console.log(e);

	// Cleaned up confusing if/else chain with a switch statement
	switch(e.code){
		case "KeyA":
			ship1.rotateLeft = true;
			break;
		case "KeyD":
			ship1.rotateRight = true;
			break;
		case "KeyS":
			ship1.burnOn = true;
			break;
		case "KeyW":
			ship1.fire = true;
			break;
		case "KeyJ":
			ship2.rotateLeft = true;
			break;
		case "KeyL":
			ship2.rotateRight = true;
			break;
		case "KeyK":
			ship2.burnOn = true;
			break;
		case "KeyI":
			ship2.fire = true;
			break;
	}
}


function commandKeyUp(e) {
	switch(e.code){
		case "KeyA":
			ship1.rotateLeft = false;
			break;
		case "KeyD":
			ship1.rotateRight = false;
			break;
		case "KeyS":
			ship1.burnOn = false;
			break;
		case "KeyW":
			ship1.fire = false;
			break;
		case "KeyJ":
			ship2.rotateLeft = false;
			break;
		case "KeyL":
			ship2.rotateRight = false;
			break;
		case "KeyK":
			ship2.burnOn = false;
			break;
		case "KeyI":
			ship2.fire = false;
			break;
	}
}


// ------------------------------------------------
// MOBILE CONTROLS
// Written by Jeff Puls 12/22/2019
// ------------------------------------------------

// Detect if screen is touch-enabled (will return true for any touch screen device, not just iOS/Android)
const 	isTouchDevice = 'ontouchstart' in document.documentElement,
		btnsToggle = document.querySelector('#touch-toggle'),
		mobileControls = document.querySelector('#mobile-controls');

// If device is touch enabled, display the touch controls and add listeners
if (isTouchDevice){
	mobileControls.style.display = "initial";
	btnsToggle.style.display = "initial";

	const burnBtn = document.querySelector('#accel'),
		  fireBtn = document.querySelector('#fire'),
		  leftRot = document.querySelector('#left'),
		  rightRot = document.querySelector('#right');

		burnBtn.ontouchstart = function(){
			ship1.burnOn = true;
		};
		burnBtn.ontouchend = function(){
			ship1.burnOn = false;
		};

		fireBtn.ontouchstart = function(){
			ship1.fire = true;
		};
		fireBtn.ontouchend = function(){
			ship1.fire = false;
		};

		leftRot.ontouchstart = function(){
			ship1.rotateLeft = true;
		};
		leftRot.ontouchend = function(){
			ship1.rotateLeft = false;
		};

		rightRot.ontouchstart = function(){
			ship1.rotateRight = true;
		};
		rightRot.ontouchend = function(){
			ship1.rotateRight = false;
		};

		// Enable toggling of touch controls (for touchscreen laptops, external keyboards/gamepads, etc)
		btnsToggle.ontouchstart = function(){
			if (mobileControls.style.display != "none"){
				mobileControls.style.display = "none";
				this.style.opacity = ".1"
			} else {
				mobileControls.style.display = "initial";
				this.style.opacity = ".5"
			}
		}
}

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

