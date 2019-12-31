// test-collide.js

import { check } from './check.js';
import { lineLine, polyLine } from '../collide.js'
import { Vector } from '../mat2d.js'

// Test cases
check("t1", lineLine(-5,-5, +5,+5, -5,+5, +5,-5), true );
check("t2", lineLine( 0,0,  0,10,  5,0,  5,10 ), false );
check("t3", polyLine([Vector(0,0), Vector(0,10), Vector(10,10)],0,10,10,0), true);
check("t4", polyLine([Vector(0,0), Vector(0,10), Vector(10,10)],15,15,20,20), false);

