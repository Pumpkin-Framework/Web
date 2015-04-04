var express = require('express');
var router = express.Router();
var query = require('../../database');
var bcrypt = require("bcrypt-nodejs");

router.get("/", function(req, res) {
    var id = req.session ? req.session.user : undefined;
    if(!id){
        res.send({exists: false});
        return;
    }
    query("SELECT * FROM users WHERE id=$1", [id], function(err, results){
        if(err){
            res.send(500, {exists: false, error: "Database error"});
            return;
        }
        if(results.rows.length != 1){
            res.send({exists: false});
            return;
        }
        var ret = results.rows[0];
        ret.fullName = ret.fullname;
        delete ret.id;
        delete ret.fullname;
        delete ret.acttoken;
        delete ret.passwordhash;
        res.send({
            exists: true,
            user: ret
        });
    });
});

router.put("/", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if(!username || !password){
        res.send({success: false, error: "Missing username or password"});
        return;
    }
    query("SELECT * FROM users WHERE username=$1", [username], function(err, results){
        if(err){
            res.send(500, {success: false, error: "Database error"});
            return;
        }
        if(results.rows.length != 1){
            res.send(401, {success: false, error: "Incorrect username or password"});
            return;
        }
        if(results.rows[0].acttoken){
            res.send(401, {success: false, error: "Your account is not activated yet"});
            return;
        }
        bcrypt.compare(password, results.rows[0].passwordhash, function(err, result){
            if(err || !result){
                res.send(401, {success: false, error: "Incorrect username or password"});
            }else{
                req.session = {
                    user: results.rows[0].id
                };
                var ret = results.rows[0];
                ret.fullName = ret.fullname;
                delete ret.id;
                delete ret.fullname;
                delete ret.acttoken;
                delete ret.passwordhash;
                res.send({
                    success: true,
                    session: {
                        exists: true,
                        user: ret
                    }
                });
            }
        })
    });
});

router.delete("/", function(req, res) {
    req.session.reset();
    res.send({success: true});
});

module.exports = router;
