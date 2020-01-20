// lobby.js
//
// Server Side Dependencies -- pulled from server.js exemplar
//
// Any client needing matchmake services must register and recieve a cookie.
// The client can present this cookie to make challenges, join games and
// interact in the server in ways requiring identification of the client.
// 

import express from 'express'
import http from 'http'
import path from 'path'
//import socketIO from 'socket.io'
//import cookieParser from 'cookie-parser'
import session from 'express-session'

const PORT = 4999;
const COOKIE_SECRET = "Purple People Eater"
const COOKIE_NAME = "spacewar"
const dirname = process.cwd();

var app = express();
var server = http.Server(app);
//var io = socketIO(server);

//app.use(cookieParser());
app.use(session({
	secret: COOKIE_SECRET,
//	store: sessionStore,  // connect-mongo session store
	name: COOKIE_NAME,
	resave: true,
	saveUninitialized: true
}));

app.use('/js', express.static(path.join(dirname, "js")));
app.use('/web_modules', express.static(path.join(dirname,"web_modules")));

// list of challenges available.  A Challenge is a user advertising to other
// users that he is available for a game.  Each challenge will be a record
// fitting the follow template.

let session_count = 0;

let challenges = [];

const CHALLENGE = {
	session_id:  null,             // unique session identifier"
	player_name: "anonymous",      // name entered by the user, anonymous is none given 
	create_time: null,             // as returned by Date.now()
}

// List of games currently in play.  Each game corresponds to a server
// instance each with its own distinct URL.
let gamesInPlay = [];

// when any requests come to the matchmaker, that request is checked for a session-id
// if no session id is present (or the session id has expired) a new session id is
// assigned as part of the reponse.

app.get('/lobby', function(req,res) {
	if (req.session.page_views) {
		req.session.page_views++;
		res.send("you visited this page " + req.session.page_views + " times.")
	} else {
		req.session.page_views = 1;
		res.send("Welcome to this page for the first time!")
	}
});

console.log("starting lobby server on port " + PORT)
app.listen(PORT);

// Anticipate changing all these to sub-functions of lobby, invoked by an op=fcn parameter
// should simplify the routing.  Use different rounts for other communication, like messages
// from back end servers.  The /lobby route is for all communication with the welcome client.

/*
// Routing
app.get('/list-challenges', function(request, response) {
  //response.sendFile(path.join(dirname, '/spacewar2.html'));
  console.log("got request /list-challenges");
  response.json(`{from: "matchmaker", challenges: ${JSON.stringify(challenges)} }`)
});

app.get('/new-challenge', function(request, response) {
	console.log("got request /new-challenge");
	challenges.push({ challenge : "dummy", time: `${Date.now()}` });
	response.json(`{from: "matchmaker", challenges: ${JSON.stringify(challenges)} }`)
});

app.get('/list-games', function(request, response) {
  //response.sendFile(path.join(dirname, '/spacewar2.html'));
  console.log("got request /list-games");
  response.json( `{ from: "matchmaker", games: ${JSON.stringify(games)} }`);
});


// Starts the server.
server.listen(PORT, function() {
  console.log('Starting matchmaker service on port ',PORT);
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
  console.log("connected");
});

*/
