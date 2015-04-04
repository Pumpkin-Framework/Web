var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var clientSessions = require("client-sessions");

var app = express();

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
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use("/javascripts", browserify("./public/javascripts"));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/session', require('./routes/api/sessions'));
app.use('/api/account', require('./routes/api/account'));
app.use('/api/mappack', require('./routes/api/mappack'));
app.use('/api/', require('./routes/api/simple')); //Always last

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        //res.status(err.status || 500);
        //res.send({success: false});
        console.log(err);
        throw err;
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    //res.status(err.status || 500);
    //res.send({success: false});
    console.log(err);
    throw err;
});


module.exports = app;
