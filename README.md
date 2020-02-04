# Spacewar!
Javascript implementation of 1962 game Spacewar! originally developed for the PDP-1

## Background

This project is a multiplayer version of the first true computer video game, Spacewar!

Spacewar was developed for the PDP-1 by engineers at DEC and MIT.  Our interpretation
here tries to be true to the gameplay of that original game.  We want to re-create
the experience of that early game, but deliver it using modern equipment and
infrastructure. By modern we mean browsers on phones, tablets, laptops and desktops
tied together by cloud based services.

## Game Play

The game is simple.  Two spaceships orbit a central star (or black hole).  The ships move
on a flat 2D screen.  Imagine each ship is gyro stabilized and can rotate right or left.  Each has a
rocket they can burn to generate force in the direction they are pointing.  Each has missiles
that fire forward from the nose of the ship.  The object of the game is to survive and destroy
the opposing ship.  Ships can be destroyed by hitting missiles (their opponents or their own)
or by moving too close to the sun, which exerts a gravitational force on the ships.

That is about it.  A simple game.

## Multiplayer Framework

The main challenges come in when we address the problem of two players in different locations
playing each other.  Each player will have a client program that displays the game and captures
the plaeyer commands and transmits them to a server.  The server will accept the commands and
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

## Scalability

Key the the concept of the game is that it should scale to WWW proportions.  How does the program
behave if 10,000 people show up to play Spacewar one fine day. Not counting on this ever happening,
but I am fascinated by the challeges of designing of a system that scales gracefully
to accomodate that possibility.
Now the client side runs in the browser, so scaling clients is almost free. The servers on the other
hand present a challenge.  Our approach is to use a containerized game server so that any 
instance of the game (between 2 players) runs in its own dedicated container on a virualized host.

We will need some experimentation to discover how many containers we can run per host, but lets assume
we can get about 50 containers per host.  That means one host can service 100 simultaneous games.
So we could scale to 1000 simultaneous games by firing up 10 hosts.

Of couse these are just WAGs and we will need to adjust thost figures after running some real tests
and analyzing real data collected from deployed systems.

## Monetization

It turns out that Amazon does not give out high volume AWS services for free. So, if this service were
to scale up, once could expect to see ads, perhaps sponsors and subscription fees for premium
services.

There is of course a balance. We won't give out information without permission, and will never send
unsolicited emails.  If you subscribe to our mailing list, you can opt out at anytime with a single
click.


