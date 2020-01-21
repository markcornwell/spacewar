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
//  Experimenting with Ramda -- didn't really use it yet
//-----------------------------------------------------------------------------------------------------------

import { SHIP_SCALE, STAR_ENABLE, STAR_RADIUS, WEDGE, WEDGE_FLAME, ROTATION_DELTA, TIME_DELTA } from './parm.js'
import { Missile, missile_hit} from './missile.js'
import { Ship, ship_burn } from './ship.js'
import { Star, star_gravity } from './star.js'
import { space } from './draw.js'
import { body_update_xy, body_rotate, body_distance } from './body.js'

// Server Side Dependencies -- pulled from server.js exemplar
import express from 'express'
import http from 'http'
import path from 'path'
import socketIO from 'socket.io'
//import * as R from 'ramda'

const PORT = 5555;

const dirname = process.cwd(); 

var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', PORT);
app.use('/js', express.static(path.join(dirname, "js")));
app.use('/css', express.static(path.join(dirname, "css")));
app.use('/web_modules', express.static(path.join(dirname,"web_modules")));

// Routing
app.get('/', function(request, response) {
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

 // maps socket.id to controls
var control = {};                    /****** MUTATABLE STATE *****/

// a list of available ships, including where they orginate
var shipsAvail = [
  Ship(WEDGE, WEDGE_FLAME, space.x*(1/4), space.y*(1/2), 0 ,  0.05, SHIP_SCALE,  Math.PI/2),
  Ship(WEDGE, WEDGE_FLAME, space.x*(3/4), space.y*(1/2), 0 , -0.05, SHIP_SCALE, -Math.PI/2),
  ];

console.log("shipsAvail: ",shipsAvail.length)

io.on('connection', function(socket) {
  // when a new connection happens we need allocate a ship for that connection
  // and associate it with the socket and push it onto the everybody list.
  socket.on('new player', function() {
    if (shipsAvail.length > 0) {
      let ship = shipsAvail.pop()
      ship.slot = socket.id;
      everybody.push(ship);
    }
    else {
      console.log("no ships available"); 
      // --- TBD --- need to push a message to the player ---- TBD ----     
    };
  });

  // update control state as it comes in
  socket.on('control', function(data) {
    control[socket.id] = data;                /***** MUTABABLE STATE ******/
  });
});

const star = Star(space.x/2, space.y/2, STAR_RADIUS );  // new

const dt = TIME_DELTA;

let everybody = ( STAR_ENABLE ? [ star ] : [] );    /***** MUTATABLE STATE VARIABLE  ********/

const or = (a,b) => a || b;   

//--------------------------------------------------------------------
// ANIMATE -- main animation loop   (Called about 60 times a second)
//--------------------------------------------------------------------

setInterval(function() {
    everybody = step(control,everybody);    // calcuate next state
    console.log("control: ", control);                           
    console.log("everybody: ", everybody);
    io.sockets.emit("state", everybody);          // tell clients the new state
  }, 
  1000 / 60);


// step :: (control,[body]) => [body]
function step(control, everybody) {
// * destroy any ships colliding with another ship  --TBD
// * destroy any missiles colliding with missiles  -- tbd

   const missiles = everybody.filter(body => body.tag == "missile");
   const ships    = everybody.filter(body => body.tag == "ship");

   const missile_hits1 = (dt,missiles,body) => missiles.map(msl => missile_hit(msl,body,dt)).reduce(or,false);
   const missile_hits2 = (dt,body,ships) => ships.map(shp => missile_hit(body,ships,dt)).reduce(or,false);

// * decrement missile life  -- destroy any missiles with no life
    const age_missile = body => 
         (body.tag == "missile"
            ? (body.life > 0 ? Object.assign({}, body, {life: body.life - 1}) : null)
            : body);

// * apply any rotations implied by control 
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

// * apply any forces implied by the control
    const doBurn = (body,dt) => (body.tag == "ship" 
                                          && control[body.slot] != undefined
                                          && control[body.slot].burnOn 
    	                             ?  Object.assign({}, ship_burn(body,dt), { burnOn: true} )
    	                             :  Object.assign({}, body, { burnOn: false }));

// * fire any missles implied by the control
    const missile_fire = body => (body.tag == "ship" 
                                           && control[body.slot] != undefined
                                           && control[body.slot].fire  
                                    ? Missile(body) 
                                    : null );

    const new_missiles = everybody.map(missile_fire).filter(x => x!=null);

    return everybody
            .filter(body=> (body.tag != "ship" || body_distance(body,star) > star.radius))    // ships destroyed by star
            .filter(body => body.tag != "ship" || !missile_hits1(dt,missiles,body))           // ships hit by missles
            .filter(body => body.tag != "missile" || !missile_hits2(dt,body,ships))           // missles that hit ships
            .map(age_missile).filter(x => x!=null)                                            // age missles, remove if 0 life
            .map(rotateR).map(rotateL)                                                        // rotation command
            .map(body => doBurn(body,dt))                                                     // burn command (updates dx,dy)
            .concat(new_missiles)                                                             // fire command
            .map(body => star_gravity(star,body,dt))                                          // gravity (updates dx,dy)
            .map(body => body_update_xy(body,space,dt))                                       // position update
}
