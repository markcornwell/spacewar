// test-mat2d.js
//

import { check } from './check.js'
import { Matrix, mat2d_multm, mat2d_multv, mat2d_R } from '../mat2d.js'


check("00",0,0);

let M = Matrix(10,20,30,40);
let v = {x: 11, y: 22 };

let I = Matrix(1,0,0,1);

check("10", mat2d_multv(I,v).x, v.x);
check("11", mat2d_multv(I,v).y, v.y);
check("12", mat2d_multv(mat2d_R(0),v).x, v.x);
check("13", mat2d_multv(mat2d_R(0),v).y, v.y);

check("13", mat2d_multv(mat2d_R(2*Math.PI),v).y, v.y);

console.log(Math.PI);
console.log(2*Math.PI);
console.log(mat2d_R(2*Math.PI));