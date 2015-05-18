var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var clientSessions = require("client-sessions");
var http = require("http");
var events = require("events");
var WebSocketServer = require("ws").Server;

var app = express();

var env = new events.EventEmitter();
env.query = require("./database");
env.mail = require("./mailer");
env.filestore = require("./filestore");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(clientSessions({
    cookieName: 'session',
    secret: 'thisIsAFuckingSecureSecretThatEveryoneCanKnowAndWillBeReplacedInProductionSoFuckYou'
}));
app.use(cookieParser());
app.use(require("multer")({dest: "./uploads/"}));
app.use(express.static(path.join(__dirname, '../build')));

app.use(function(req, res, next){
    req.env = {
        requireSession: function(){
            if(req.session && req.session.user){
                return req.session.user;
            }else{
                res.status(401).send({success: false, error: "Not authenticated"});
                return false;
            }
        },
        query: function(query, args, cb){
            env.query(query, args, function(err, result){
                if(err){
                    console.log("Database error: ");
                    console.log(err);
                    res.status(500).send({success: false, error: "Database error"});
                }else{
                    cb(result);
                }
            });
        }
    };
    next();
});

var router = express.Router();
app.use(router);

var server = http.createServer(app);
var io = require("socket.io")(server, {
    serveClient: false
});

env.io = io;
env.router = router;
env.gameserver = {};

require('./routes/api/sessions')(env);
require('./routes/api/account')(env);
require('./routes/api/mappack')(env);
require('./routes/api/simple')(env);

var wss = new WebSocketServer({server: server, path: "/gameserver"});
require("./gameserver")(wss, env);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

server.listen(port);
server.on('error', function(error){
    if(error.syscall !== 'listen'){
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch(error.code){
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', function(){
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});

module.exports = app;

function normalizePort(val) {
    var port = parseInt(val, 10);
    if(isNaN(port)){ //Pipe
        return val;
    }
    if(port >= 0){ //Port
        return port;
    }
    return false;
}
