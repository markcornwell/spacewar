// draw.js
//
// Function: Drawing functions for spacewar canvas
//
// Secrets: what libraries are used to draw on the display

// Note: These drawing functions will migrate over to the client.  Expect them to
//       disappear sompletely from the server side.
//
// These functions are not pure functions.  They access a mutable canvas and they
// make calls to random.
//

// Refactoring.  Now that drawing functions are together, no one else needs
// to know about the canvas, so I can remove it from the parameter list.
// Allow functions to access the canvas implicitly

// Initialize the canvas context

import { shape_translate, shape_rotate } from './shape.js'

// Test if code is running in a browser; else assume node.js
// browser :: () -> boolean
const browser = typeof document != 'undefined';

if (browser) {
	var canvas = document.querySelector('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var c = canvas.getContext('2d');
	console.log("context: ", c);
	//c.strokeStyle = 'green';
	c.strokeStyle = '#39FF14'; // NEN
}

// the dimensions of bounded space infinite in any direction
export var space = (browser ? {x: canvas.width, y: canvas.height }
						    : {x: 500, y:500 });

export function draw_clear() {
	//c.clearRect(0,0,space.x,space.y);
	c.clearRect(0,0,canvas.width,canvas.height);
}

export function draw(body) {
	console.log("draw: ", body);
	switch(body.tag) {
		case "ship" : ship_draw(body);  break;
        case "star" : star_draw(body);  break;
        case "missile" : missile_draw(body); break;
	}
}

export function draw_circle(body) {  // works on any body with a radius
	c.beginPath();
	console.log("setting strokestyle to white");
    //c.strokeStyle = "white";	
    c.arc(body.x,body.y,body.radius,0,2*Math.PI,false);
    c.stroke();
}

// Star - note no translations or rotations

export function star_draw(body) {
	// draw star with a sparking effect
	//console.log("star_draw",body);
	console.log("star_draw: ", body);
	c.beginPath();
	for (var i = 0; i < 6; i++) {			
		c.moveTo(body.x,body.y);
		c.lineTo(body.x + (Math.random() - 0.5) * 2*body.radius,
			     body.y + (Math.random() - 0.5) * 2*body.radius);
	};
	c.strokeStyle = '#39FF14';
	c.stroke();
}

// Shape - actually draws a polygon from pointList
// a shape is anything with a pointlist property
// Important to note that shape draw does no rotations or 
// translations on the shape.

// I think polygon is a better name.  Reserve the term shape
// for something more general.

export const draw_polygon = shape_draw;

export function shape_draw(shape) {
	let pl = shape.pointList;
	if (pl.length == 0) {
		console.log("Warning: Shape draw has empty pointList");
	}
    c.beginPath();
	c.moveTo(pl[0].x,pl[0].y)

	for (var i = 1; i<pl.length; i++) {
		c.lineTo(pl[i].x,pl[i].y);
	}

    c.lineTo(pl[0].x,pl[0].y);
	c.stroke();
}

// Ship
//
// Key thing here is that the function is doing the needed translations
// and rotations on the raw shape before drawing it.  It also conditionally
// draws the burn if it is indicated.
//

export function ship_draw(ship) {
	if (ship.tag != 'ship') { 
		return null 
	} else {
    	shape_draw(shape_translate(shape_rotate(ship.shape, ship.theta)
    	                          , { x: ship.x, y: ship.y }
    	                          ));
    	if (ship.burnOn) {
    		shape_draw( shape_translate ( shape_rotate(ship.flame, ship.theta), 
    		                                           {x: ship.x, y: ship.y}))
    	}
    }}

// Missile -- unlike ship, missile does no translations or rotations
// note that a missile is a simple body

export function missile_draw(missile) {
	c.beginPath();
	c.arc(missile.x,missile.y,2,0,2*Math.PI,false);
    c.stroke();
}

