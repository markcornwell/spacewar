// test-draw.js
//
// In brwser test of drawing functions.  
// This file runs in the context of ../../test.html
//
//

import { draw_circle, draw_polygon } from '../draw.js'
import { SHIP_SCALE, WEDGE, WEDGE_FLAME } from '../parm.js'
import { vector_translate, vector_rotate } from '../mat2d.js'
import { Shape, shape_translate, shape_rotate } from '../shape.js'
import { mat2d_R } from '../mat2d.js'

console.log( "test-draw.js" );

let body1 = { x: 100, y: 100 , radius: 10 };


draw_circle(body1);
draw_circle( Object.assign( {}, body1, { x: 200 }));
draw_circle( Object.assign( {}, body1, { x: 300 }));


draw_polygon(shape_translate(WEDGE, {x: 100, y: 200}));
draw_polygon(shape_translate(WEDGE_FLAME, { x: 100, y: 200 } ));

draw_polygon(shape_translate(WEDGE, {x: 200, y: 200}));

draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI/2), {x: 300, y: 200}));
draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI*2), {x: 400, y: 200}));
draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI*3), {x: 500, y: 200}));
draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI/4), {x: 600, y: 200}));
draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI/8), {x: 700, y: 200}));

draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI/8), {x: 100, y: 300}));
draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI/8), {x: 200, y: 300}));
draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI/8), {x: 300, y: 300}));
draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI/8), {x: 400, y: 300}));
draw_polygon(shape_translate(shape_rotate(WEDGE, Math.PI/8), {x: 500, y: 300}));



console.log("done");