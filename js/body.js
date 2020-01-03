// body.js
//
// can use body_rotate on ships

// anything with a theta property is rotatable
export function rotatable(body) { return body.theta != undefined }

// (body,delta,dt) => body
export function body_rotate(body,omega,dt) {  // omega is angular velocity
	if (rotatable(body)) {
		return Object.assign( {}, body, { theta: normalize_angle(body.theta + omega*dt) } )
	} else {
		return body;
	}
}

// normalize angle to the range [0, 2*PI]
function normalize_angle(theta) {
	if (theta < 0) { return normalize_angle(theta + 2*Math.PI) }
	if (theta >= 2*Math.PI) { return normalize_angle(theta - 2*Math.PI) }
	return theta;
}

// update a body in wrap around space from velocity and time
// keep the body inside the positive dimensions of the spac
// by wrapping at the edges.
export function body_update_xy(body,space,dt) {
	return Object.assign({}, body, {
		x: (body.x + space.x + body.dx * dt) % space.x,
		y: (body.y + space.y + body.dy * dt) % space.y 
	})}

// update the dxdy of hte body from a force over time
export function body_update_dxdy(body,force,dt) {
	return Object.assign({}, body, {
		dx: body.dx * force.x * dt,
		dy: body.dy = force.y * dt
	})}

export function body_distance_squared(body1, body2) {
	return (body1.x - body2.x)**2 + (body1.y - body2.y)**2
}

export function body_distance(body1, body2) {
	return Math.sqrt(body_distance_squared(body1,body2))
}

