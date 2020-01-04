// controls.js
//
// -------------------------------------------------------------
// Keybord Commands and Controls
//
// We want the burn as long as the key is pressed
// and end when the player releases the key.
//--------------------------------------------------------------
//
// MRC  2019-12-31
//
// Objective: reuse as much coe as we can between the serverless
// game and the clien/server version.  Minimise the amout of code
// we need to maintain.
//
// Start with straightforward re-implementation of two players
// sharing hte same keyboared. 
//
// Main difference between the serverless and client implementation
// is that the client will only control one ship, while the serverless
// must control both ships.  The touch screen interface only provides
// control for one ship, so only applies to 2-player.  2nd player
// may be either a human or the local AI.
//----------------------------------------------------------------

/*
function Control() {
	return { rotateLeft: false, rotateRight: false, burnOn: false, fire: false } 
}

export var control = [ Control(), Control() ];
*/
export function getControl() {
	return JSON.stringify([ control1, control2 ]);
}


let control1 = { rotateLeft: false, rotateRight: false, burnOn: false, fire: false, fireEnable: true };
let control2 = { rotateLeft: false, rotateRight: false, burnOn: false, fire: false, fireEnable: true };


document.addEventListener('keydown', commandKeyDown);
document.addEventListener('keyup', commandKeyUp);

function commandKeyDown(e) {
	//console.log(e);

	// Cleaned up confusing if/else chain with a switch statement
	switch(e.code){
		case "KeyA":
			control1.rotateLeft = true;
			break;
		case "KeyD":
			control1.rotateRight = true;
			break;
		case "KeyS":
			control1.burnOn = true;
			break;
		case "KeyW":
			control1.fire = true;
			break;
		case "KeyJ":
			control2.rotateLeft = true;
			break;
		case "KeyL":
			control2.rotateRight = true;
			break;
		case "KeyK":
			control2.burnOn = true;
			break;
		case "KeyI":
			control2.fire = true;
			break;
	}
}


function commandKeyUp(e) {
	switch(e.code){
		case "KeyA":
			control1.rotateLeft = false;
			break;
		case "KeyD":
			control1.rotateRight = false;
			break;
		case "KeyS":
			control1.burnOn = false;
			break;
		case "KeyW":
		    control1.fire = false;
			break;
		case "KeyJ":
			control2.rotateLeft = false;
			break;
		case "KeyL":
			control2.rotateRight = false;
			break;
		case "KeyK":
			control2.burnOn = false;
			break;
		case "KeyI":
			control2.fire = false;
			break;
	}
}

// ------------------------------------------------
// MOBILE CONTROLS
// Written by Jeff Puls 12/22/2019
// ------------------------------------------------

// Detect if screen is touch-enabled (will return true for any touch screen device, not just iOS/Android)
const 	isTouchDevice = 'ontouchstart' in document.documentElement;
const	btnsToggle = document.querySelector('#touch-toggle');
const	mobileControls = document.querySelector('#mobile-controls');

// If device is touch enabled, display the touch controls and add listeners
if (isTouchDevice){
	mobileControls.style.display = "initial";
	btnsToggle.style.display = "initial";

	const burnBtn = document.querySelector('#accel'),
		  fireBtn = document.querySelector('#fire'),
		  leftRot = document.querySelector('#left'),
		  rightRot = document.querySelector('#right');

		burnBtn.ontouchstart = function(){
			control1.burnOn = true;
		};
		burnBtn.ontouchend = function(){
			control1.burnOn = false;
		};

		fireBtn.ontouchstart = function(){
			control1.fire = true;
		};
		fireBtn.ontouchend = function(){
			control1.fire = false;
		};

		leftRot.ontouchstart = function(){
			control1.rotateLeft = true;
		};
		leftRot.ontouchend = function(){
			control1.rotateLeft = false;
		};

		rightRot.ontouchstart = function(){
			control1.rotateRight = true;
		};
		rightRot.ontouchend = function(){
			control1.rotateRight = false;
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

