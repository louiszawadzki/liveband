//var binaryServer = require('binaryjs').BinaryServer;
var express = require('express');
var PeerServer = require('peer').PeerServer;
var server = PeerServer({port:9001});

var app = express();
app.set('views', __dirname + "/public");
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
	res.render('index');
});

app.listen(8081);

server.on('connection', function(client_id){
    for (var clientKey in server.clients){
	    var otherClient = server.clients[clientKey];
	    if (clientKey != client_id) {
            for (var streamKey in otherClient.streams){
                var stream = otherClient.streams[streamKey];
                var send = client.createStream();
                stream.pipe(send);
            }
        }            
    }
    server.clients[client_id].on('stream', function(stream, meta){
	    for (var clientKey in server.clients){
		    var otherClient = server.clients[clientKey];
		    if (otherClient != client) {
                var send = otherClient.createStream(meta);
                stream.pipe(send);
            }            
	    }
    });
});

server.on('disconnection', function(client_id){
	//TODO
});
