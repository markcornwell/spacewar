# lobby.sh
# shell script to test RESTful lobby server lobby.js
#
#  $ npm run lobby
#
# Then in a new shell window:
#
#  $ . lobby.sh
#
# More automation to check the results -- eliminate manual review of logs
# each curl script start a new session -- should mimic running from same session
#

echo 1
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET localhost:4999/hello
echo
echo 2
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X PUT localhost:4999/test-reset
echo
echo 3
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST localhost:4999/new
echo
echo 4
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET localhost:4999/ls
echo
echo 5
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET localhost:4999/ls
echo
echo 6
curl -H "Accept: application/json" -H "Content-Type: application/json" -X PUT localhost:4999/test-reset
echo
echo 7
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET localhost:4999/ls
echo
echo 8
curl -H "Accept: application/json" -H "Content-Type: application/json" -X POST localhost:4999/new
echo
echo 9
curl -H "Accept: application/json" -H "Content-Type: application/json" -X POST localhost:4999/new
echo
echo 10
curl -H "Accept: application/json" -H "Content-Type: application/json" -X POST localhost:4999/new
echo
echo 11
curl -H "Accept: application/json" -H "Content-Type: application/json" -X DELETE localhost:4999/rm/100 
echo done

