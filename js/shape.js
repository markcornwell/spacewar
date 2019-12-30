// shape.js
//
// A Shape is a sequence of points in cartesian coodinates
// with respect to an orthogonal x,y coodinates. 
// We can rotate the shape about the origin and and translate
// that shape to an arbitrary position on the canvas.
//
// For any given rotation and translation, a shape will have
// a bounding box.

import { Vector, mat2d_R } from './mat2d.js'

export function Shape(pointList) {
	return { pointList: pointList }
}

export function shape_rotate(shape,theta) {
	return Object.assign( {}, pointList, shape.pointList.map(p => mat2d_multv(mat2d_R(theta),p)))
}

export function shape_translate(shape,v) {
	return Object.assign( {} , pointList, shape.pointList.map(p => vector_translate(v,p)))
}
