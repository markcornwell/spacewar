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
import cors from 'cors'
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

app.use(cors());

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

let challenge_number = 100;
let challenges = {};

const Challenge = (num,time) => { 
	return { number: num, issued: time }
};

// List of games currently in play.  Each game corresponds to a server
// instance each with its own distinct URL.
let gamesInPlay = [];

app.get('/hello', function(req,res) {
	console.log("session.id:", req.session.id);
	console.log(req.session);

	res.json({message: "hello"});
});

app.post('/new', function(req,res) {
	console.log("/new");	
	console.log("session.id:", req.session.id);
	console.log(req.session);

	challenges[req.session.id] = Challenge(challenge_number++,Date.now());

	res.json(challenges);
});

app.get('/ls', function(req,res) {
	console.log("ls");	
	console.log("session.id:", req.session.id);
	console.log(req.session);	

	res.json(challenges);
});

// do I need a route to get this fancy??
// do routes uwork with session??
app.delete('/rm/:number([0-9]{3,})', function(req,res) {
	console.log("/rm");	
	console.log("session.id: ", req.session.id);
	console.log(req.session);
	console.log("removing challenge number " + req.params.number);

	//challenges = challenges.filter((x) => x.number != req.params.number);

	for (let key in challenges) {
		if (challenges[key].number == req.params.number) {
			delete challenges[key];
			break;
		}
	}

	res.json(challenges);
});

//*************************
//
// for testing only  -- remove in production
//

app.put('/test-reset', function(req,res) {
	console.log("test-reset");	
	console.log("session.id: ", req.session.id);
	console.log(req.session);	
	challenge_number = 100;
    challenges = {};
	res.json(challenges);
});

app.put('/test', function(req,res) {
	console.log("session.id: ", req.session.id);
	console.log(req.session);
	if (req.session.page_views) {
		req.session.page_views++;
		res.send("you visited this page " + req.session.page_views + " times.")
	} else {
		req.session.page_views = 1;
		res.send("Welcome to this page for the first time!")
	}
});

//
//*************************

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
