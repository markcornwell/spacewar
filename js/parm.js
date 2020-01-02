// parm.js
//
// parameters

export const SHIP_SCALE = 20;                 // scale the size of the ships when drawn
export const MISSILE_SPEED = 1.5;             // controls dx/dy of missiles
export const MISSILE_LIFE = 400;              // lifetime of missile in frame resfreshes
export const ROTATION_DELTA = Math.PI/100;    // how fast to rotate ship 
export const BURN_FORCE = 0.01;               // force of the thruster during a burn
export const STAR_RADIUS = 10;                // desctuctive radius of the star
export const MASS_SHIP = 0.01;                   // mass of a ship
export const MASS_STAR = 80;             // mass of the star
export const STAR_ENABLE = true;              // set to false to run without the center star
export const SERVER_WIDTH = 800;              // standard display height in server coordinates
export const SERVER_HEIGHT = 600;             // standard display width in seerver coordinates

// default shapes for ships

let D = SHIP_SCALE;

function p(x,y) { return {x: x, y: y} }

export const WEDGE = {pointList: [ { x: D,  y: 0 },
				            { x: -D, y: D/4 }, 
				            { x: -D, y: -D/4 } 
				          ]};

//console.log("Wedge: ", WEDGE);

export const WEDGE_FLAME = {pointList: [ { x: -D, y: 0 }
						        , { x: -D * 5/4, y: 0 }
						        ]};

