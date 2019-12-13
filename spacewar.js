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
// Architecture
//
//  Layer 2            Ships         Prepresents Ships with controls   
//                       |
//  Layer 1            Shapes        Representations of Shapes, rotations, and translations of same.
//                       |
//  Layer 0          Matrix Ops      Basic primitives for 2x2 matrix operations and 2x1 vector operations
//
//-----------------------------------------------------------------------------------------------------------

//------------------------------------------- Rendering
//
var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

this.sin = Math.sin;
this.cos = Math.cos;
this.PI = Math.PI;

var c = canvas.getContext('2d');

console.log(canvas);


// Matrix operations
//
function Matrix(a11,a12,a21,a22) {
	this.a11 = a11;
	this.a12 = a12;
	this.a21 = a21;
	this.a22 = a22;

	this.multm = function(M) {
		return new Matrix
			( this.a11 * M.a11 + this.a12 * M.a21
			, this.a11 * M.a12 + this.a12 * M.a22
			, this.a21 * M.a11 + this.a22 * M.a21
			, this.a21 * M.a12 + this.a22 * M.a22
			)
	}

	this.multv = function(v) {
		return new Vector
			(this.a11 * v.x + this.a12 * v.y
			,this.a21 * v.x + this.a22 * v.y
			)
	}
}

function Vector(x,y) {
	this.x = x;
	this.y = y;

	this.translate = function (v) {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	this.rotate = function(theta) {
		return R(theta).multv(this);
	}
}

// Matrix to rotate theta radians about the origin
function R(theta) {
	return new Matrix( cos(theta), -sin(theta), sin(theta), cos(theta) )
}
//
// ----------------------------------------  Shapes  
//

function Shape(pointList) {

	this.pointList = pointList;

	this.rotate = function(theta){
		return new Shape(this.pointList.map(p => R(theta).multv(p)));
	}

	this.translate = function(v) {
		return new Shape(this.pointList.map(p => p.translate(v)));
	}

	this.draw = function() {
		if (pointList.length == 0) {
			console.log("Shape draw has empty pointList");
			return this;
		}
    	c.beginPath();
		c.strokeStyle = 'white';
		//c.fillStyle = 'rgba(0, 0, 255, 0.4)';
		c.fill();

		c.moveTo(pointList[0].x,pointList[0].y)

		for (var i = 1; i<pointList.length; i++) {
			c.lineTo(pointList[i].x,pointList[i].y);
		}
        
        c.lineTo(pointList[0].x,pointList[0].y);

		c.strokeStyle = 'white';
		//c.fillStyle = 'rgba(0, 0, 255, 0.4)';
		c.fill();
		c.stroke();
	}
}

// Shapes used by Ships

var scale = 40;


// ugly -- needs cleanup
var Wedge = new Shape( [new Vector(scale,0)
			  			 ,new Vector(-scale, scale/4)
			             ,new Vector(-scale, -scale/4)
			             ])

// Need a way of linking these shapes to the physics to the entities
// of my game.  Can I leverage the concept behind box2D?  Need to 
// review them and see whta good ideas I can crib.



//-------------------------------------------- Ships

function Ship(shape,x,y,dx,dy,radius,theta) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.theta = theta;
	this.burnOn = false;
	this.shape = shape;

    this.draw = function() {
    	var rotatedShape = this.shape.rotate(this.theta);
    	var translatedShape = rotatedShape.translate(new Vector(this.x,this.y));
    	translatedShape.draw();
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

		this.draw(canvas);
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
var radius = scale

ship1 = new Ship(Wedge, canvas.width*(3/4), canvas.height*(1/2), 0 , -0.2, radius, -PI/2);
ship2 = new Ship(Wedge, canvas.width*(1/4), canvas.height*(1/2), 0 ,  0.2, radius,  PI/2);


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
