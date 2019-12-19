// mat2d.js
//
// Matrix and Vector multiplication, translation, rotation
// on 2D vectors and 2x2 matrices.

export function Matrix(a11,a12,a21,a22) {
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

export function Vector(x,y) {
	this.x = x;
	this.y = y;

	this.translate = function (v) {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	this.rotate = function(theta) {
		return R(theta).multv(this);
	}
}

export function R(theta) {
	return new Matrix( Math.cos(theta), -Math.sin(theta), Math.sin(theta), Math.cos(theta) )
}