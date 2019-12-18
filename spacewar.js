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
//                        
//  Layer 1            Shapes        Representations of Shapes, rotations, and translations of same.
//                        
//  Layer 0          Matrix Ops      Basic primitives for 2x2 matrix operations and 2x1 vector operations
//
//-----------------------------------------------------------------------------------------------------------


var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

this.sin = Math.sin;
this.cos = Math.cos;
this.PI = Math.PI;

var c = canvas.getContext('2d');

console.log(canvas);

//-----------------------------------------------------------
// Matrix and Vector multiplication, translation, rotation
// on 2D vectors and 2x2 matrices.
//-----------------------------------------------------------

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

function R(theta) {
	return new Matrix( cos(theta), -sin(theta), sin(theta), cos(theta) )
}

//-----------------------------------------------------------------
// Collision Detection
// http://www.jeffreythompson.org/collision-detection/line-line.php
//-----------------------------------------------------------------

function lineLine(x1,y1,x2,y2,x3,y3,x4,y4) {

  // calculate the distance to intersection point
  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}

function polyLine(pointList, x1, y1, x2, y2) {

  // go through each of the vertices, plus the next
  // vertex in the list
  var next;
  for (var current=0; current < pointList.length; current++) {

    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current+1;
    if (next == pointList.length) {
    	next = 0;
    }

    // get the PVectors at our current position
    // extract X/Y coordinates from each
    x3 = pointList[current].x;
    y3 = pointList[current].y;
    x4 = pointList[next].x;
    y4 = pointList[next].y;

    // do a Line/Line comparison
    // if true, return 'true' immediately and
    // stop testing (faster)
    hit =lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
    	console.log("polyLine hit!")
      	return true;
    } 
  }
  return false;
}


// Self test on load
function check(name,e1,e2) {
	if (e1 == e2) {
		console.log(name," pass");
	} else {
		console.log(name," FAIL");
	}
}

check("t1", lineLine(-5,-5, +5,+5, -5,+5, +5,-5), true );
check("t2", lineLine( 0,0,  0,10,  5,0,  5,10 ), false );
check("t3", polyLine([new Vector(0,0), new Vector(0,10), new Vector(10,10)],0,10,10,0), true);
check("t4", polyLine([new Vector(0,0), new Vector(0,10), new Vector(10,10)],15,15,20,20), false);


//------------------------------------------------------------
// A Shape is a sequence of points centered about the origin.  
// We can rotate the shape about its center and and translate
// to an arbitrary position on the canvas.
//------------------------------------------------------------

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
			console.log("Warning: Shape draw has empty pointList");
			return this;
		}
    	c.beginPath();
		c.strokeStyle = 'white';
		//c.fillStyle = 'rgba(0, 0, 255, 0.4)';
		//c.fill();

		c.moveTo(pointList[0].x,pointList[0].y)

		for (var i = 1; i<pointList.length; i++) {
			c.lineTo(pointList[i].x,pointList[i].y);
		}
        
        c.lineTo(pointList[0].x,pointList[0].y);

		c.strokeStyle = 'white';
		//c.fillStyle = 'rgba(0, 0, 255, 0.4)';
		//c.fill();
		c.stroke();
	}

    // does the line intersect any of the slides of the Shape (Polygon?)
	//this.polyLineCollide = function(x1,y1,x2,y2) {
		//console.log(polyLine);
	//	return polyLine(this.pointList,x1,y2,x2,y2);
	//}
}

// A Ship will have postion x,y and a velocity dx,dy.  It will also have
// orientation described by an angle theta measured from the horizontal
// in radians, e.g. Pi/2 points straight up. 


const missileSpeed = 3;
const missileLife = 150
var missileArray = [];

function Ship(shape,flame,x,y,dx,dy,radius,theta) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.theta = theta;
	this.burnOn = false;
	this.shape = shape;
	this.flame = flame;
	this.explode = false;

    this.draw = function() {
    	this.shape.rotate(this.theta).translate(new Vector(this.x,this.y)).draw();
    	if (this.burnOn) {
    		this.flame.rotate(this.theta).translate(new Vector(this.x,this.y)).draw();
    	}     
    }

    this.shapeInPosition = function () {
    	return this.shape.rotate(this.theta).translate(new Vector(this.x,this.y))
    }

	// Update ecapsulates the game physics of the object.  Right now ships bounce off
	// the edges of the canvas.  This will change.  We want the ships that go
	// off the top to come back on the bottoms, and simmilarly wrap around on
	// all found sides of the drawing a


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

	// Rotate by adding some angle to theta.  Keeps theta normalized between
	// -2*PI and +2*PI.

	this.rotate = function(delta) {
		//console.log("rotate");
		this.theta = this.theta + delta;
		if (this.theta > (2*PI))  {
			this.theta = this.theta - (2*PI);
		} else if (this.theta < -2*PI) {
			this.theta = this.theta + (2*PI);
		}
	}

	// Burn applies a force in the direction theta which will modify the dx,dy
	// components of the velocity.

	this.burn = function(force) {
		console.log("Burn");
	    this.dx = this.dx + force * cos(this.theta);
	    this.dy = this.dy + force * sin(this.theta);
	}

	// Fire creates a missile at the nose of the ship point x,y plus a tiny
	// delta so it does not overlap the ship.  The velocity of the ship is
	// taken as the basis fo the veolicty of the missile, then an additional
	// velocity is added in the direction o the current orientation of hte
	// ship.

	this.fire = function() {
		missileArray.push(new Missile( this.x + scale * cos(this.theta)
									 , this.y + scale * sin(this.theta)
									 , this.dx + missileSpeed * cos(this.theta)
									 , this.dy + missileSpeed * sin(this.theta)
									 , missileLife
									 ))
	}
}

// Missiles are simpler than ships.  They have a position, but not a dimension
// they render on the screen as points, each appearing as a dot on the screen.
// They have a positin and a x-y position as well as a lifetime.  As they move the life
// is dectrmented.  When the life hits 0 or becomes negative the missile goes away.

function Missile(x,y,dx,dy,life) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.life = life;

	this.draw = function() {
		c.beginPath();
		c.arc(this.x,this.y,2,0,2*Math.PI,false);
        c.stroke();
	}

	this.update = function(shipArray) {
		this.life -= 1;

		// right now missile bounce off the edges.  We should change this to warp.
		if (this.x > innerWidth || this.x < 0) {
			this.dx = -this.dx;
		}
		if (this.y > innerHeight || this.y  < 0) {
			this.dy = -this.dy;
		}

		// look for any ships missile might have it
		//
		for (var i  = 0; i < shipArray.length; i++) {
			var pointList = shipArray[i].shapeInPosition().pointList;
			if (polyLine(pointList, this.x, this.y, this.x + 10*this.dx, this.y + 10*this.dy)) {
				console.log("missile hit!");
				shipArray[i].explode = true;
				this.life = 0;
			}
		}

	    // upate the missile position
		this.x += this.dx;
		this.y += this.dy;

		this.draw();
	}
}

//--------------------------------------------------
// Keybord Commands and Controls
//
// We want the burn as long as the key is pressed
// and end when the player releases the key.
//--------------------------------------------------


document.addEventListener('keydown',commandKeyDown);
document.addEventListener('keyup', commandKeyUp);

var rotationDelta = PI/20;
var burnForce = 1;

function commandKeyDown(e) {
	//console.log(e);
	if (e.key == "[") {
		ship1.rotate(rotationDelta);
	} else if (e.key == "]") {
		ship1.rotate(-rotationDelta);
	} else if (e.key == "=") {
		ship1.burn(burnForce);
		ship1.burnOn = true;
	} else if (e.code == "ShiftRight") {
		ship1.fire();
	} else if (e.key == "q") {
		ship2.rotate(rotationDelta);
	} else if (e.key == "w") {
		ship2.rotate(-rotationDelta);
	} else if (e.key == "2") {
		ship2.burn(burnForce);
		ship2.burnOn = true;
	} else if (e.code == "ShiftLeft") {
		ship2.fire();
	}
}

function commandKeyUp(e) {
	//console.log(e);
	if (e.key == "=") {
		ship1.burnOn = false
	} else if (e.key == "2") {
		ship2.burnOn = false
	}
}

//-------------------------------------------------
// SETUP --- Define the Shapes and Objects Here
//-------------------------------------------------

var scale = 30;

// ugly -- needs cleanup
var Wedge = new Shape( [ new Vector(scale,0)
			  		   , new Vector(-scale, scale/4)
			           , new Vector(-scale, -scale/4)
			           ]);

var WedgeFlame = new Shape( [ new Vector (-scale, 0)
							, new Vector (-scale * 5/4, 0)
							]);

var shipArray = [];
var radius = scale

ship1 = new Ship(Wedge, WedgeFlame, canvas.width*(3/4), canvas.height*(1/2), 0 , -0.2, radius, -PI/2);
ship2 = new Ship(Wedge, WedgeFlame, canvas.width*(1/4), canvas.height*(1/2), 0 ,  0.2, radius,  PI/2);


shipArray.push(ship1);
shipArray.push(ship2);


//-----------------------------------------
// ANIMATE -- main animation loop
//-----------------------------------------

function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0,0,innerWidth,innerHeight);
	
	// Update Shipes
	for (var i  = 0; i < shipArray.length; i++) {
		shipArray[i].update()
	}

    // Clear away missiles whose life has expired. 
	// Oldest missiles are always on the front of the array
	while( missileArray.length >0 && missileArray[0].life < 0) {
		missileArray.shift();
	}

    // update missiles
	for (var i = 0; i < missileArray.length; i++) {
		missileArray[i].update(shipArray)
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
