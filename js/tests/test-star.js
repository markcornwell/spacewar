// test-star.js
//

import { check } from './check.js'
import { Star, star_destroys_ship } from '../star.js'

check("10",0,0);
check("12", Star(10,20,5).x, 10);
check("13", Star(10,20,5).y, 20);
check("14", Star(10,20,5).radius, 5);

let ship = { x: 300, y: 200, explode: false };

check("20", star_destroys_ship(Star(300,200,10),ship).explode, true);
check("21", star_destroys_ship(Star(300,500,10),ship).explode, false);
check("22", star_destroys_ship(Star(300,205,10),ship).explode, true);
check("23", star_destroys_ship(Star(300,210,10),ship).explode, false);
check("23", star_destroys_ship(Star(300,210,20),ship).explode, true);

