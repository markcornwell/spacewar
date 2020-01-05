// test-body.js
//

import { check } from './check.js'
import { rotatable, body_rotate, body_update_xy, body_update_dxdy } from '../body.js'

console.log( "test-body.js" );

let space = { x: 1000, y: 1000 };

console.log(space.x);

check("00",0,0);

check("10", rotatable( { theta: 0} ), true);
check("11", rotatable( { foo: 0} ), false);

check("20", body_rotate( {theta: 0}, 0, 1).theta, 0);
check("21", body_rotate( {theta: 0}, Math.PI/2, 1).theta, Math.PI/2);
check("22", body_rotate( {theta: 0}, Math.PI/2, 2).theta, Math.PI);
check("23", body_rotate( {theta: 0}, Math.PI/2, 3).theta, 3*Math.PI/2);
check("24", body_rotate( {theta: 0}, Math.PI/2, 4).theta, 0);

check("30", body_update_xy( {x: 0, y:0, dx:10, dy:20}, space, 1).x, 10);
check("31", body_update_xy( {x: 0, y:0, dx:10, dy:20}, space, 2).x, 20);
