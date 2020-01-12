//-----------------------------------------------------------------------------------------------------------
// Spacewar!
// Copyright (C) 2019 by Mark R. Cornwell
// MIT License; see LICENSE for details
//
// Ref: https://en.wikipedia.org/wiki/Spacewar!
//
//-----------------------------------------------------------------------------------------------------------
//  Multiplayer Client/Server Version -- SERVER SIDE FUNCTIONS
//
//  Everything in this file is on the server side.  The server handles all the physics of the ships.  The
//  client handles all the rendering.  THe client send the control setting to the server.  Thte takes those 
//  and feeds them into the physics prior to the updates of the physics engine.
//
//-----------------------------------------------------------------------------------------------------------

import { SHIP_SCALE, STAR_ENABLE, STAR_RADIUS, WEDGE, WEDGE_FLAME, ROTATION_DELTA, TIME_DELTA } from './parm.js'
import { Missile, missile_hit} from './missile.js'
import { Ship, ship_burn } from './ship.js'
import { Star, star_gravity } from './star.js'
import { space } from './draw.js'
import { body_update_xy, body_rotate, body_distance } from './body.js'
//import { getControl } from './controls2.js'


// Server Side Dependencies -- pulled from server.js exemplar
import express from 'express'
import http from 'http'
import path from 'path'
import socketIO from 'socket.io'


const PORT = 5555;

//const dirname = process.cwd() + "/"; 
const dirname = process.cwd(); 

var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', PORT);
//app.use('/js', express.static(dirname + '/js'));
app.use('/js', express.static(path.join(dirname, "js")));
app.use('/css', express.static(path.join(dirname, "css")));
app.use('/web_modules', express.static(path.join(dirname,"web_modules")));

// Routing
app.get('/', function(request, response) {
  //response.sendFile(path.join(dirname, '/index.html'));
  response.sendFile(path.join(dirname, '/spacewar2.html'));
});

// Starts the server.
server.listen(PORT, function() {
  console.log('Starting server on port ',PORT);
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
  console.log("connected");
});

var control = {};   // maps socket.id to controls

// a list of available ships, including where they orginate
var shipsAvail = [
  Ship(WEDGE, WEDGE_FLAME, space.x*(1/4), space.y*(1/2), 0 ,  0.05, SHIP_SCALE,  Math.PI/2),
  Ship(WEDGE, WEDGE_FLAME, space.x*(3/4), space.y*(1/2), 0 , -0.05, SHIP_SCALE, -Math.PI/2),
  ];

console.log("shipsAvail: ",shipsAvail.length)

//---  new stuff

io.on('connection', function(socket) {
  // when a new connection happens we need to create the ship for that connection
  // and associate it with the socket and push it onto the everybody list.

  socket.on('new player', function() {
    if (shipsAvail.length > 0) {
      let ship = shipsAvail.pop()
      ship.slot = socket.id;
      everybody.push(ship);
    }
    else {
      // --- TBD --- need to push a message to the player ---- TBD ----
      console.log("no ships available");  
    };
  });

  socket.on('control', function(data) {
    // update control state as it comes in
    control[socket.id] = data;
  });
});



let star = Star(space.x/2, space.y/2, STAR_RADIUS );  // new

//let space = { x: space.x, y: space.y };   // note that space is in server coordinates -- correct later
let dt = TIME_DELTA;


// put all game bodies in one flat array.  Bodies have a tag to make further distinctions as needed
//let everybody = [ship1, ship2];
let everybody = [];
if (STAR_ENABLE) {
    everybody.push(star);
}

console.log("body count: ",everybody.length);

const nonNull = x => (x != null);
const or = (a,b) => a || b;   

//--------------------------------------------------------------------
// ANIMATE -- main animation loop   (Called about 60 times a second)
//--------------------------------------------------------------------

// Server side does not have an Animate loop so we cannot use request animation frame
// on the server side.  Replace this with a calls to set Interval.

setInterval(animate, 1000 / 60);


function animate() {
//	requestAnimationFrame(animate);

//---------------
// Destruction 
//---------------
// * destroy any bodies colliding with sun
   everybody = everybody.filter(body=> (body.tag != "ship" || body_distance(body,star) > star.radius));

// * destroy any ships colliding with another ship
// * destroy any ships colliding with missile
// * destroy any missiles colliding with ship -- by symmetry

   let missiles = everybody.filter(body => body.tag == "missile");
   let ships    = everybody.filter(body => body.tag == "ship");

   let missile_hits1 = (dt,missiles,body) => missiles.map(msl => missile_hit(msl,body,dt)).reduce(or,false); 
   let missile_hits2 = (dt,missile,ships) => ships.map(shp => missile_hit(missile,shp,dt)).reduce(or,false); 

   everybody = everybody.filter(body => (body.tag !="ship" || !missile_hits1(dt,missiles,body)));
   everybody = everybody.filter(body => (body.tag !="missile" || !missile_hits2(dt,body,ships)));

// * destroy any missiles with no life
   everybody = everybody.map(body => 
        (body.tag == "missile"
   			? (body.life > 0 ? Object.assign({}, body, {life: body.life - 1}) : null)
   			: body));

   everybody = everybody.filter(nonNull);

// * destroy any missiles colliding with missiles
//-----------
// Controls
//-----------
// * read and record the control states
//   let control = JSON.parse(getControl());
    
// * pick a time dt to apply the control
	//let dt = 1000/60;


   console.log("control: ", control);
   console.log("everybody: ", everybody);


// * apply any rotations implied by control -- perhaps pull dt from a timestamp on the control ??
    const rotateR = body => (body.tag == "ship" 
                                      && control[body.slot] != undefined
                                      && control[body.slot].rotateRight 
                                      && body_rotate(body,-ROTATION_DELTA,dt)
                            ) || body;

    const rotateL = body => (body.tag == "ship" 
                                      && control[body.slot] != undefined
                                      && control[body.slot].rotateLeft  
                                      && body_rotate(body,  ROTATION_DELTA,dt)
                            ) || body;


    everybody = everybody.map(rotateR);
    everybody = everybody.map(rotateL);

// * apply any forces implied by the control
    const doBurn = (body,dt) => (body.tag == "ship" 
                                          && control[body.slot] != undefined
                                          && control[body.slot].burnOn 
    	                             ?  Object.assign({}, ship_burn(body,dt), { burnOn: true} )
    	                             :  Object.assign({}, body, { burnOn: false }));

    everybody = everybody.map(body => doBurn(body,dt));

    

 // * create abt missiles fire implied by the control - TBD: missile on fire on false->true transitions

    const missile_fire = body => (body.tag == "ship" 
                                           && control[body.slot] != undefined
                                           && control[body.slot].fire  
                                    ? Missile(body) 
                                    : null );

    const new_missiles = everybody.map(missile_fire).filter(nonNull);




    everybody = everybody.concat(new_missiles);

  /****************************************** ADD IN INCREMENTALLY       
**************************************************************/

//  Gravity
// * apply any gravitational forces implied by any stars
	   everybody = everybody.map(body => star_gravity(star,body,dt));
//
// Motions
// * update xy for by dxdy * dt all bodies
	   everybody = everybody.map(body => body_update_xy(body,space,dt));

// Display - in multiplayer, this will send everybody to the server
// * update the display from the current position/rotation of all existing bodies

     io.sockets.emit("state", everybody);

  //draw_clear();
	//everybody.map(draw);

// Note: 
// * collisions create explosion animations managed on client side
// * sparkling sun animation managed on client side
// * potential for different client side skins

}

//animate();
