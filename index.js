var http = require('http');
var synth = require('./synth');

var server = http.createServer(function(req,res){
	res.writeHead(200);
	res.end('hello');
});
server.listen(8080);
