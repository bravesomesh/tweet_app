var express = require("express"),
    http = require("http"),
    io = require("socket.io"),
    theport = process.env.PORT || 4000,
    path = require('path'),
    twitter = require("ntwitter");

var app = express();
var server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
server.listen(theport);
console.log ("http server on port: " + theport);

var sockets = io.listen(server);

app.get('/', function(request, response) {
  response.render('bargraph');
});

var tw = new twitter({
        consumer_key: "Your consumer_key",
        consumer_secret: "Your consumer_secret",
        access_token_key: "Your access_token_key",
        access_token_secret: "Your access_token_secret"
    }),
    stream = null,
    track = "pizza,dosa,idly,food",
    users = [];

sockets.sockets.on("connection", function(socket) {
    tw.stream("statuses/filter", {
        track: track
    }, function(s) {
        stream = s;
        stream.on("data", function(data) {
            socket.broadcast.emit("new tweet", data);
            socket.emit("new tweet", data);
        });
    });
    socket.emit("connected", {
        tracking: track
    });
});
