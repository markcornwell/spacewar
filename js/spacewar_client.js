// game.js
//
// Client side of spacewar game
//

//import 'socket.io-client';

import { draw } from '/js/draw.js'

var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

socket.emit('new player');  // announce new player to server

setInterval(function() {
  socket.emit('control', control);
}, 1000 / 60);


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
//
//----------------------------------------------------------------
// Client/Server Multiplayer
//----------------------------------------------------------------
//
// The mutlplayer version client side only needs to worry about one
// ser of the controls.  The client ontrol setting will be grabbed
// by the client via getControl and that JSON string will be sent
// to the server.  Ther server will will have a handler listening
// on the socket, and the socket-id will identify what ship the
// controls are bound to.
//----------------------------------------------------------------

/*
export function getControl() {
  return JSON.stringify([ control1, control2 ]);
}
*/

// Every client has only one control


let control = { rotateLeft: false, rotateRight: false, burnOn: false, fire: false, fireEnable: true };
//let control2 = { rotateLeft: false, rotateRight: false, burnOn: false, fire: false, fireEnable: true };

document.addEventListener('keydown', commandKeyDown);
document.addEventListener('keyup', commandKeyUp);

function commandKeyDown(e) {
  // Cleaned up confusing if/else chain with a switch statement
  switch(e.code){
    case "KeyA":
      control.rotateLeft = true;
      break;
    case "KeyD":
      control.rotateRight = true;
      break;
    case "KeyS":
      control.burnOn = true;
      break;
    case "KeyW":
      control.fire = true;
  }
}

function commandKeyUp(e) {
  switch(e.code){
    case "KeyA":
      control.rotateLeft = false;
      break;
    case "KeyD":
      control.rotateRight = false;
      break;
    case "KeyS":
      control.burnOn = false;
      break;
    case "KeyW":
        control.fire = false;
      break;
  }
}

// ------------------------------------------------
// MOBILE CONTROLS
// Written by Jeff Puls 12/22/2019
// ------------------------------------------------

// Detect if screen is touch-enabled (will return true for any touch screen device, not just iOS/Android)
const isTouchDevice = 'ontouchstart' in document.documentElement;
const btnsToggle = document.querySelector('#touch-toggle');
const mobileControls = document.querySelector('#mobile-controls');

// If device is touch enabled, display the touch controls and add listeners
if (isTouchDevice){
  mobileControls.style.display = "initial";
  btnsToggle.style.display = "initial";

  const burnBtn = document.querySelector('#accel'),
      fireBtn = document.querySelector('#fire'),
      leftRot = document.querySelector('#left'),
      rightRot = document.querySelector('#right');

    burnBtn.ontouchstart = function(){
      control.burnOn = true;
    };
    burnBtn.ontouchend = function(){
      control.burnOn = false;
    };

    fireBtn.ontouchstart = function(){
      control.fire = true;
    };
    fireBtn.ontouchend = function(){
      control.fire = false;
    };

    leftRot.ontouchstart = function(){
      control.rotateLeft = true;
    };
    leftRot.ontouchend = function(){
      control.rotateLeft = false;
    };

    rightRot.ontouchstart = function(){
      control.rotateRight = true;
    };
    rightRot.ontouchend = function(){
      control.rotateRight = false;
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


var canvas = document.getElementById('canvas');
canvas.width = 500;
canvas.height = 500;
var context = canvas.getContext('2d');

socket.on('state', function(everybody) {
  context.clearRect(0, 0, 500, 500);
  context.fillStyle = 'green';
  for (var id in everybody) {
    var body = everybody[id];
    draw(body);
  }
});
