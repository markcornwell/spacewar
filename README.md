# spacewar
Javascript implementation of 1962 game Spacewar! originally developed for the PDP-1

_Background_

This project is a multiplayer version of the first true computer video game, Spacewar!
The game was developed for the PDP-1 and represents a major milestone in the evolution of
computer games.  Our interpretation here tries to be true to the gameplay of that original
game.  We want to re-create the experience of that early game, but deliver it over the internet
so that players around the world can experience the immediacy of playing other human beings in
a game of skill and cunning.

_Game Play_

The game is simple.  Two spaceships orbit a central star (or black hole).  The ships move
in a flat 2D space.Each ship is gyro stabilized and can rotate right or left.  Each has a
rocket they can burn to generate force in the direction they are pointing.  Each has missiles
that fire forward from the nose of the ship.  The object of the game is to destroy the opposing
ship.  Ships can be destroyed by hitting missiles (their opponents or their own) or by moving
too close to the sun, which exerts a gravitational force on the ships.

That is about it.  A simple game.

_Multiplayer Framework_

The main challenges come in when we address the problem of two players in different locations
playing each other.  Each player will have a client program that displays the game and captures
the plaeyr commands and transmits them to a server.  The server will accept the commands and
send what is needed to each player to keep their view of the game synchronized.  Each player
should feel as if they were in the presence of the other player watching the same screen.

Also, we want to avoid cheating.  Each player has control over the client software running
on their device.  Early multiplayer games suffered from hackers modifying the client to
cheat at the game mechanics -- by making themselves invulnerable, or granting extra weapons.
To avoid this we adopt the stragety that all the physics and representation of the state
reside in the server.  The server knows where the ships are, their velocity, the positions of
all the missiles, the star location, the gravity of the sun.  The client know only how to
render the ships on the display and how to interpret the commands the user enters on the
keyboard or touchscreen.  There is no information in the client that can let the client cheat.

So, while the server handles all the plysics, the client handles all the rendering, and interprets
user commands.  Simple.

_Scaability_

Key the the concept of the game is that it should scale to WWW proportions.  How does the program
behave is 10,000 people show up to play Spacewar on a find Saturday morning / Friday night depending
where your are relative to the intermational date line.  Not optimistic that this will every happen,
but we want our design to accomodate the possibility.

Now the clide side all runs locally in the browsers, so scaling them is free.  We just deliver the
javascript to the browsers and they run the clients on local hardware.  The servers on the other
hand present a challenge.  Since this is a two player game, we need to dedicate on server for every
two players.  OUr approach is to use a containerized game server so that the server for any 
instance of the game (between 2 players) runs in its own dedicated container on a virualized host.

We will need some experimentation to discover how many containers we can run per host, but I estimate
we can get about 50 containers per host.  That means one host can service 100 simultaneous games.
So we could scale to 1000 simultaneous games by firing up 10 hosts.

Of couse these are just WAGs and we will need to adjust thost figures after running some real tests
and collection real data from deployed systems.

_Monetization_

It turns out that Amazon does not give out high volume AWS services for free.  If a few hundred thousand
people showed up on my server one weekend, I might see a very high bill a the end of the month.  How 
am I going to pay that bill?  I dont' want to get stiffed for a couple of grand so that other can have
fun.  I'm a nice guy, but I have limits.  A good market solution would be that all these users give
someting in return so that we can all pay off Amazon and everyone is happy.

To that end, we might have advertising, a fee that frees players from looking at advertising, sponsors
who might give financial support in return for propotion in the form of a logo or badge on the site.

There is of course a balance.




