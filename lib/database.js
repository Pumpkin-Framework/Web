var pg = require('pg').native;
var conString = require("./dbconfig").connstring;

module.exports = function(query, args, cb){
    pg.connect(conString, function(err, client, done) {
        if(err){
            cb(err);
            return;
        }
        client.query(query, args, function(err, result){
            done();
            process.nextTick(function(){
                cb(err, result);
            });
        });
    });
};
