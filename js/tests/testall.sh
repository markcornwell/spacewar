# testall.sh
#

date > tests.out

node --experimental-modules test-collide.js >> tests.out 
node --experimental-modules test-mat2d.js >> tests.out
node --experimental-modules test-missile.js >> tests.out
node --experimental-modules test-ship.js >> tests.out
node --experimental-modules test-star.js >> tests.out
node --experimental-modules test-body.js >> tests.out

# test-draw is run by refreshing ../../test.html in the browser
cat tests.out
