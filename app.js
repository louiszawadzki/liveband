var binaryServer = require('binaryjs').BinaryServer;
var express = require('express');

var app = express();
app.set('views', __dirname + "/public");
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
	res.render('index');
});

app.listen(8081);

var server = binaryServer({port:9000});
server.on('connection', function(client){
	console.log("new connection");
    client.on('stream', function(stream, meta){
	    for (var clientKey in server.clients){
		    var otherClient = server.clients[clientKey];
		    if (otherClient != client) {
                var send = otherClient.createStream(meta);
                stream.pipe(send);
            }            
	    }
    });
    client.on('close', function() {
        //TODO
    });
});
