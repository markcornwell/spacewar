// test-collide.js

import { check } from './check.js';
import { lineLine, polyLine } from '../collide.js'

// Test cases
check("10", lineLine(-5,-5, +5,+5, -5,+5, +5,-5), true );
check("11", lineLine( 0,0,  0,10,  5,0,  5,10 ), false );

check("20", polyLine( [{x: 0, y:0}, {x:0, y:10}, {x:10, y:10}], 0, 10, 10,  0), true);
check("21", polyLine( [{x: 0, y:0}, {x:0, y:10}, {x:10, y:10}],15, 15, 20, 20), false);
