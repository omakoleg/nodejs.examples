// client module
"use strict";
const
	zmq = require('zmq');

exports.runClient = function(pulIpc, pushIpc){
	let
		push = zmq.socket('push').connect(pushIpc),
		pull = zmq.socket('pull').connect(pulIpc);
	console.log("Worker running: " + process.pid);
	// send register event
	push.send(JSON.stringify({
		type: 'register',
		pid: process.pid
	}));
	// process requests
	pull.on('message', function(data){
		let message = JSON.parse(data);
		push.send(JSON.stringify({
			type: 'result',
			original: message,
			pid: process.pid
		}))
	});
}
