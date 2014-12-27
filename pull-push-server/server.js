"use strict";

const
	cluster = require('cluster'),
	zmq = require('zmq'),
	client = require('./client.js'),
	serverPushIpc = "ipc://server-push.ipc",
	serverPullIpc = "ipc://server-pull.ipc",
	clientsCount = 3;
let
	registeredClients = 0;

if(cluster.isMaster){
	let
		push = zmq.socket('push').bind(serverPushIpc),
		pull = zmq.socket('pull').bind(serverPullIpc);

	pull.on('message', function(data){
		let message = JSON.parse(data);
		console.log(message);
		if( message.type === 'register'){
			registeredClients++ ;
			console.log("Worker registered: " + message.pid);
		} else if(message.type === 'result'){
			console.log("Result from: " + message.pid + " accepted");
		}
	});
	console.log('Start waiting queue');
	let timer = setInterval(function(){
		if(registeredClients >= clientsCount){
			clearInterval(timer);
			//start sending messages
			console.log("All workers registered");
			for(let i = 0;i < 30; i++){
				push.send(JSON.stringify({
					type: 'job'
				}));
			}
		}
	}, 100);

	console.log('Create workers');
	for(let i = 0; i < clientsCount; i++){
		cluster.fork();
	}
	process.on('SIGINT', function() {
	  pull.close();
	  push.close();
	  process.exit();
	});
} else {
	client.runClient(serverPushIpc, serverPullIpc);
}
