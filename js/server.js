// server.js
//
// cd ~mark/spacewar
// node --experimental-modules js/server.js
// open http://localhost:5000
// open http://localhost:5000
// open http://localhsot:5000

// Dependencies
import express from 'express'
import http from 'http'
import path from 'path'
import socketIO from 'socket.io'

const dirname = process.cwd() + "/"; 

console.log(dirname);

var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/js', express.static(dirname + '/js'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(dirname, '/index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
	console.log("connected");
});

// for testing
setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  }); 
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);