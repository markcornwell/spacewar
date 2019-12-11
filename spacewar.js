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
// It was magical.  Later in grad school, home for Christams vacati0n around 1979, I implemented a version 
// of Spaceware in Basic on a Commodor 64.  It worked, and I saved it off on a cassette tape.  So this is
// my first attempt at spacewar since Chirstmas vacation, 1979.  40 years give or take a couple of weeks.
// Long overdue!
//
// TBD
// - enter a;; the following enhancements into github
// - add abiity to fire missiles, track their movements on screen
// - add a bun animation on the ship to show rocket burn
// - needs to be 2 player
// - provide an AI for single payer mode
// - add a star in the center and account for gravity
// - add a way to set parameters: gravity, sun or no sun, ship velocity, missile velocity, burn strenth
// - accurate portrayals of spaceships" the needle" and "the wedge"
// - support for panci button -- teleport to random location of screen
// - ships should wrap around the edges of the screen
// - simulate posphor persistence to create 1960's radar CRT effect
// - sound effect for rock burn
// - sound effect for missile fire
// - sound effect for missle hit,explosion 
// - background music, atmopherics
// - starfield background
// - invert screen to black spece background, ships in white
//-----------------------------------------------------------------------------------------------------------

var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

this.sin = Math.sin;
this.cos = Math.cos;
this.PI = Math.PI;

var c = canvas.getContext('2d');

console.log(canvas);

function Ship(x,y,dx,dy,radius,theta) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.theta = theta;
	
	// encapsulates the appearance of the object
	this.draw = function() {

		// cCrners of untranslated ship triangle are at p1=(r,0) p2=(-r,r/4), p3=(-r,-r/4)
	    // inline the rotation matrix to rotate by theta and then translate by (x,y)
	    // https://en.wikipedia.org/wiki/Rotation_matrix

	    this.p1x =  ( this.radius * cos(this.theta)  -          0        * sin(this.theta))   + this.x;
	    this.p1y =  ( this.radius * sin(this.theta)  +          0        * cos(this.theta))   + this.y;

	    this.p2x =  (-this.radius * cos(this.theta)  -  (this.radius/4) * sin(this.theta)) + this.x;
	    this.p2y =  (-this.radius * sin(this.theta)  +  (this.radius/4) * cos(this.theta)) + this.y;

	    this.p3x =  (-this.radius  * cos(this.theta) +  (this.radius/4) * sin(this.theta))  + this.x;
	    this.p3y =  (-this.radius  * sin(this.theta) -  (this.radius/4) * cos(this.theta))  + this.y;

	    c.beginPath()
		c.strokeStyle = 'white';
		//c.fillStyle = 'rgba(0, 0, 255, 0.4)';
		c.fill();
	    c.moveTo(this.p1x,this.p1y);
	    c.lineTo(this.p2x,this.p2y);
	    c.lineTo(this.p3x,this.p3y);
	    c.lineTo(this.p1x,this.p1y);
		c.strokeStyle = 'white';
		//c.fillStyle = 'rgba(0, 0, 255, 0.4)';
		c.fill();
		c.stroke();
	}

	// encapsulates the game physics of the object
	this.update = function() {
		if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
			this.dx = -this.dx;
		}
		if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
			this.dy = -this.dy;
		}
	
		this.x += this.dx;
		this.y += this.dy;

		this.draw();
	}

	this.rotate = function(delta) {
		console.log("rotate");
		this.theta = this.theta + delta;
		if (this.theta > (2*PI))  {
			this.theta = this.theta - (2*PI);
		} else if (this.theta < -2*PI) {
			this.theta = this.theta + (2*PI);
		}
	}

	this.burn = function(force) {
		console.log("Burn");
	    this.dx = this.dx + force * cos(this.theta);
	    this.dy = this.dy + force * sin(this.theta);
	}

}

document.addEventListener('keydown',commandKeyDown);
document.addEventListener('keyup', commandKeyUp);

var rotationDelta = PI/20;
var burnForce = 1;

function commandKeyDown(e) {
	console.log(e);
	if (e.key == "[") {
		ship1.rotate(rotationDelta);
	} else if (e.key == "]") {
		ship1.rotate(-rotationDelta);
	} else if (e.key == "=") {
		ship1.burn(burnForce);
		ship1.burnOn = true;
	} else if (e.key == "q") {
		ship2.rotate(rotationDelta);
	} else if (e.key == "w") {
		ship2.rotate(-rotationDelta);
	} else if (e.key == "2") {
		ship2.burn(burnForce);
		burnOn = true;
	}
}

function commandKeyUp(e) {
	console.log(e);
	if (e.key == "=") {
		ship1.burnOn = false
	} else if (e.key == "2") {
		ship2.burnOn = false
	}
}


// SETUP

var shipArray = [];
var radius = 40

ship1 = new Ship( canvas.width*(3/4), canvas.height*(1/2), 0 , -0.2, radius, -PI/2);
ship2 = new Ship( canvas.width*(1/4), canvas.height*(1/2), 0 ,  0.2, radius,  PI/2);


shipArray.push(ship1);
shipArray.push(ship2);


console.log(shipArray);

// ANIMATE

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);
	
	for (var i  = 0; i < shipArray.length; i++) {
		shipArray[i].update()
	}
}

animate();
