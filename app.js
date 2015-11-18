var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.set('views', __dirname + "/public");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res){
		res.render('index.html');
});

var options = {
    debug: true
}
var server = require('http').createServer(app);

app.use('/peerjs', ExpressPeerServer(server, options));

server.listen(8081);

var clientsId = [];

server.on('connection', function(id){
	//
});

server.on('disconnect', function(id){
	//
});
