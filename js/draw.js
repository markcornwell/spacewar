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

function star_draw_circle(star,c) {  // unused
	let x = star.x;
	let y = star.y;
	let r = star.radius;	
	c.beginPath();
	c.arc(x,y,r,0,2*Math.PI,false);
    c.stroke();
    return c;
}

// Star

function star_draw(star,c) {
	// draw star with a sparking effect
	let x = star.x;
	let y = star.y;
	let r = star.radius;
	c.beginPath();
	for (var i = 0; i < 6; i++) {			
		c.moveTo(x,y);
		c.lineTo(x + (Math.random() - 0.5) * 2*r, y + (Math.random() - 0.5) * 2*r);
	}
	c.stroke();
	return c;
}

// Shape

export function shape_draw(shape,c) {
	let pl = shape.pointList;
	if (pl.length == 0) {
		console.log("Warning: Shape draw has empty pointList");
		return c;
	}
    c.beginPath();
	c.strokeStyle = 'white';
	c.moveTo(pl[0].x,pl[0].y)

	for (var i = 1; i<pl.length; i++) {
		c.lineTo(pl[i].x,pl[i].y);
	}
        
    c.lineTo(pl[0].x,pl[0].y);
	c.strokeStyle = 'white';
	c.stroke();
	return c;
}

// Ship

export function ship_draw(ship,c) {
    shape_draw( shape_translate( shape_rotate(ship.shape, ship.theta)
    	                       , Vector(ship.x,ship.y
    	                       )
    	      ,c)

    if (ship.burnOn) {
    	shape_draw( sahpe_translate ( shape_rotate(ship.flame, theta), 
    		                          Vector(ship.x,ship.y)
    		                        )
    	          ,c)
    }
    return c;
}

// Missile

function missle_draw(missile,c) {
	c.beginPath();
	c.arc(missile.x,missile.y,2,0,2*Math.PI,false);
    c.stroke();
}


