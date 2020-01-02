# testall.sh
#

node --experimental-modules test-collide.js
node --experimental-modules test-mat2d.js
node --experimental-modules test-missile.js
node --experimental-modules test-ship.js
node --experimental-modules test-star.js
node --experimental-modules test-body.js

# test-draw is run by refreshing ../../test.html in the browser
