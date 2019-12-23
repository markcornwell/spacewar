//-----------------------------------------------------------------------------------------------------------
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
//-----------------------------------------------------------------------------------------------------------

import { Matrix, Vector, R } from './mat2d.js'
import { lineLine, polyLine } from './collide.js'
import { Shape } from './shape.js'
import { Missile, missileArray } from './missile.js'
import { scale, missileLife, rotationDelta, burnForce } from './parm.js'
import { Ship } from './ship.js'


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
			ship1.rotate(rotationDelta);
			break;
		case "KeyD":
			ship1.rotate(-rotationDelta);
			break;
		case "KeyS":
			ship1.burn(burnForce);
			ship1.burnOn = true;
			break;
		case "KeyW":
			//ship1.fire();
			console.log("fire");
			new Missile(ship1);
			break;
		case "KeyJ":
			ship2.rotate(rotationDelta);
			break;
		case "KeyL":
			ship2.rotate(-rotationDelta);
			break;
		case "KeyK":
			ship2.burn(burnForce);
			ship2.burnOn = true;
			break;
		case "KeyI":
			//ship2.fire();
			console.log("fire");
			new Missile(ship2);
			break;
	}

	// if (e.code == "KeyA") {
	// 	ship1.rotate(rotationDelta);
	// } else if (e.code == "KeyD") {
	// 	ship1.rotate(-rotationDelta);
	// } else if (e.code == "KeyS") {
	// 	ship1.burn(burnForce);
	// 	ship1.burnOn = true;
	// } else if (e.code == "KeyW") {
	// 	//ship1.fire();
	// 	console.log("fire");
	// 	new Missile(ship1);
	// } else if (e.code == "KeyJ") {
	// 	ship2.rotate(rotationDelta);
	// } else if (e.code == "KeyL") {
	// 	ship2.rotate(-rotationDelta);
	// } else if (e.code == "KeyK") {
	// 	ship2.burn(burnForce);
	// 	ship2.burnOn = true;
	// } else if (e.code == "KeyI") {
	// 	//ship2.fire();
	// 	console.log("fire");
	// 	new Missile(ship2);
	// }
}

function commandKeyUp(e) {
	//console.log(e);

	// Cleaned up if/else chain with a switch statement
	switch(e.code){
		case "KeyS":
			ship1.burnOn = false;
			break;
		case "KeyS":
			ship2.burnOn = false;
			break;
	}

	// if (e.code == "KeyS") {
	// 	ship1.burnOn = false
	// } else if (e.code == "KeyK") {
	// 	ship2.burnOn = false
	// }
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
			ship1.burn(burnForce);
			ship1.burnOn = true;
		};
		burnBtn.ontouchend = function(){
			ship1.burnOn = false;
		};
		fireBtn.ontouchstart = function(){
			new Missile(ship1);
		};
		leftRot.ontouchstart = function(){
			ship1.rotate(-rotationDelta);
		};
		rightRot.ontouchstart = function(){
			ship1.rotate(rotationDelta);
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

var Wedge = new Shape( 	[ new Vector(scale,0)
				  		, new Vector(-scale, scale/4) 
						, new Vector(-scale, -scale/4)  
						]);

var WedgeFlame = new Shape( [ new Vector (-scale, 0)
							, new Vector (-scale * 5/4, 0)
							]);


var shipArray = [];
var radius = scale

var ship2 = new Ship(Wedge, WedgeFlame, canvas.width*(3/4), canvas.height*(1/2), 0 , -0.2, radius, -Math.PI/2);
var ship1 = new Ship(Wedge, WedgeFlame, canvas.width*(1/4), canvas.height*(1/2), 0 ,  0.2, radius,  Math.PI/2);


shipArray.push(ship1);
shipArray.push(ship2);

//-----------------------------------------
// ANIMATE -- main animation loop
//-----------------------------------------

export function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0,0,innerWidth,innerHeight);
	
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
	var shipArrayNew = [];
	for (var i = 0; i < shipArray.length; i++) {
		if (shipArray[i].explode == false) {
			shipArrayNew.push(shipArray[i])
		}
	}
	shipArray = shipArrayNew;
}

animate();
