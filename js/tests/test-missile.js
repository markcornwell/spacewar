// test-missile.js
//
import { check } from './check.js'
import { SHIP_SCALE, SERVER_WIDTH, SERVER_HEIGHT } from '../parm.js'
import { Vector } from '../mat2d.js'
import { Missile } from '../missile.js'
import { Ship } from '../ship.js'
import { Shape } from '../shape.js'

check("00",0,0);


//-------------------------------------------------
// SETUP --- Define the Shapes and Objects Here
//-------------------------------------------------

const Wedge = Shape( [ Vector(SHIP_SCALE,0)
				     , Vector(-SHIP_SCALE, SHIP_SCALE/4) 
				     , Vector(-SHIP_SCALE, -SHIP_SCALE/4)  
				     ]);

const WedgeFlame = Shape( [ Vector (-SHIP_SCALE, 0)
						  , Vector (-SHIP_SCALE * 5/4, 0)
						  ]);


const radius = SHIP_SCALE;


var ship2 = Ship(Wedge, WedgeFlame, SERVER_WIDTH*(3/4), SERVER_HEIGHT*(1/2), 0 , -0.5, radius, -Math.PI/2);
var ship1 = Ship(Wedge, WedgeFlame, SERVER_WIDTH*(1/4), SERVER_HEIGHT*(1/2), 0 ,  0.5, radius,  Math.PI/2);

check("10", radius, SHIP_SCALE);
check("11", Wedge.pointList.length, 3);
check("12", WedgeFlame.pointList.length, 2);
check("13", Wedge.pointList[0].x, SHIP_SCALE);


check("21", ship2.dx, 0);
check("22", ship2.dy, -0.5);

check("31", Missile(ship1).x, Missile(ship1).x);
check("31", Missile(ship1).y, Missile(ship1).y);


