// mat2d.js
//
// Matrix and Vector multiplication, translation, rotation
// on 2D vectors and 2x2 matrices.

export function Matrix(a11,a12,a21,a22) {
	return { a11: a11, a12: a12, a21: a21, a22: a22 }
}

export function mat2d_multm(A,B) {
	return Matrix( A.a11 * B.a11 + A.a12 * B.a21
			     , A.a11 * B.a12 + A.a12 * B.a22
			     , A.a21 * B.a11 + A.a22 * B.a21
			     , A.a21 * B.a12 + A.a22 * B.a22
				 )
}

export function mat2d_multv(A,v) {
	return { x: A.a11 * v.x + A.a12 * v.y
		   , y: A.a21 * v.x + A.a22 * v.y
		   }}

export function mat2d_R(theta) {
	return Matrix( Math.cos(theta)
		         , -Math.sin(theta)
		         , Math.sin(theta)
		         , Math.cos(theta) 
		         )
}

// vector is nust anything with an x and y xoordinate
// why not just say {x: x, y: y} and drop this function
// all together

// instead of calling this vector just write { x: x, y:y }
// We are not going to change the representation of 2d vectors
// so do not encapsulate.

//export function Vector(x,y) {
//	return { x: x
//		   , y: y
//		   }
//}

// translate is a fancy word for adding to vectors
// pointwise. 
//

export function vector_translate(vect,point) {
	return { x: vect.x + point.x, y: vect.y + point.y }
}

export function vector_rotate(vect,theta) {
	return mat2d_multv(mat2d_R(theta),vect)
}
