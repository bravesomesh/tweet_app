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
  response.render('index');
});

var tw = new twitter({
        consumer_key: "uq8JioRp9MO3gV2HOGdiRsQET",
        consumer_secret: "CCqwyfHDWdkcxkur6gXeScoRJh2uL4n8wSf0lDbj5d7ldM5DL4",
        access_token_key: "79397028-cF3MViGhI55FrmAKamnThr8duPAsMWvFViJsLQdUY",
        access_token_secret: "9Bp8j6Bra7aaa1c8x8mz8Tqh1p2UxZSBD969z05xDktVx"
    }),
    stream = null,
    track = "pizza,dosa,idly,food",
    users = [];

sockets.sockets.on("connection", function(socket) {
    tw.stream("statuses/filter", { track: track }, function(s) {
        stream = s;
        stream.on("data", function(data) {
            setInterval(function(){
                socket.broadcast.emit("new tweet", data);
                socket.emit("new tweet", data);
            }, 10000);
        });
    });
    socket.emit("connected", {
        tracking: track
    });
});
