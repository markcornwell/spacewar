// draw.js
//
// Function: Drawing functions for spacewar canvas
//
// Secrets: what libraries are used to draw on the display
//

// Ship

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
	let pointList = shape.pointList;
	if (pointList.length == 0) {
		console.log("Warning: Shape draw has empty pointList");
		return c;
	}
    c.beginPath();
	c.strokeStyle = 'white';
	c.moveTo(pointList[0].x,pointList[0].y)

	for (var i = 1; i<pointList.length; i++) {
		c.lineTo(pointList[i].x,pointList[i].y);
	}
        
    c.lineTo(pointList[0].x,pointList[0].y);
	c.strokeStyle = 'white';
	c.stroke();
	return c;
}
