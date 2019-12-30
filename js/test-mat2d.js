// test-star.js
//

import { check } from './check.js'
import { Matrix, mat2d_multm, Vector, mat2d_multv, mat2d_R, vector_translate, vector_rotate  } from './mat2d.js'

check("10",0,0);

let I = Matrix(1,0,0,1);
let A = Matrix(1,2,3,4);

check("11",A.a11, 1, true);
check("12",A.a12, 2, true);
check("13",A.a21, 3, true);
check("14",A.a22, 4, true);


check("21", mat2d_multm(A,I).a11, A.a11, true);
check("22", mat2d_multm(A,I).a12, A.a12, true);
check("23", mat2d_multm(A,I).a21, A.a21, true);
check("24", mat2d_multm(A,I).a22, A.a22, true);

let v = Vector(10,20);

check("31", mat2d_multv(I,v).x, v.x, true);
check("32", mat2d_multv(I,v).y, v.y, true);

