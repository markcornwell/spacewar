// check.js
//
// Testing framework
//
// __filename and __dirname are node.js things and work only in a nodd.js context
//
export function check(name,e1,e2) {
	if (e1 === e2) {
		console.log(name," pass");
	} else {
		console.log(name," FAIL");
	}
}
