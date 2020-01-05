// test-star.js
//

import { check } from './check.js'
import { Star } from '../star.js'

check("10",0,0);
check("12", Star(10,20,5).x, 10);
check("13", Star(10,20,5).y, 20);
check("14", Star(10,20,5).radius, 5);

