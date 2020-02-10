// matchmaker.js
//
// Server Side Dependencies -- pulled from server.js exemplar
//
// Any client needing matchmake services must register and recieve a cookie.
// The client can present this cookie to make challenges, join games and
// interact in the server in ways requiring identification of the client.
// 
// https://www.js-tutorials.com/nodejs-tutorial/crud-operations-using-nodejs-express-mongodb-mongoose/
//
// This pattern in very differnt from that described in a tutorial I like.  Here we use app.
// The tutorial at https://www.youtube.com/watch?v=fgTGADljAeg uses a router object instead, and
// much cleaner and more realistic.  Does a btter job of error handling, standard REST error codes,
// and seem cleaner and more mature.  Going to start my matchmaker.js over again from scratch.
// 


import express from 'express'
//import path from 'path'
import cors from 'cors'
//import socketIO from 'socket.io'
//import cookieParser from 'cookie-parser'
import session from 'express-session'

const PORT = 4999;
const COOKIE_SECRET = "Purple People Eater"
const COOKIE_NAME = "spacewar"
const dirname = process.cwd();

var app = express();
//var server = http.Server(app);
//var io = socketIO(server);

//app.use(cors());

//app.use(cookieParser());
app.use(session({
	secret: COOKIE_SECRET,
//	store: sessionStore,  // connect-mongo session store
	name: COOKIE_NAME,
	resave: true,
	saveUninitialized: true
}));

//app.use('/js', express.static(path.join(dirname, "js")));
//app.use('/web_modules', express.static(path.join(dirname,"web_modules")));

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
	//console.log(req.session);
	res.json({message: "hello"});
});

app.post('/new', function(req,res) {
	console.log("/new");	
	console.log("session.id:", req.session.id);
	//console.log(req.session);

	challenges[req.session.id] = Challenge(challenge_number++,Date.now());

	res.json(challenges);
});

app.get('/ls', function(req,res) {
	console.log("ls");	
	console.log("session.id:", req.session.id);
	//console.log(req.session);	
	res.json(challenges);
});

app.get('/count', function(req,res) {
	console.log("count");
	console.log("session.id:", req.session.id);
	res.json(Object.keys(challenges).length)
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

console.log("starting matchmaker server on port " + PORT)
app.listen(PORT);


