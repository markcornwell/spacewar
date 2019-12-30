// check.js
//
// Testing framework

export function check(name,e1,e2) {
	if (e1 == e2) {
		console.log(name," pass");
	} else {
		console.log(name," FAIL");
	}
}

