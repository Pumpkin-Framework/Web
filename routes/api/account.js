var express = require('express');
var mail = require('../../mailer');
var query = require('../../database');
var uuid = require("node-uuid");
var bcrypt = require("bcrypt-nodejs");
var router = express.Router();

var usernameRegex = /^([a-zA-Z0-9_\-]{3,32})/;
var fullNameRegex = /^([a-zA-Z\- ]{3,128})/;
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post("/", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var fullName = req.body.fullName;

    if(username.length < 3){
        res.send({success: false, error: "Your username is too short"});
        return;
    }
    if(username.length > 32){
        res.send({success: false, error: "Your username is too long"});
        return;
    }
    if(!usernameRegex.test(username)){
        res.send({success: false, error: "Your username is not valid"});
        return;
    }
    if(!emailRegex.test(email)){
        res.send({success: false, error: "Your email address is not valid"});
        return;
    }
    if(!fullNameRegex.test(fullName)){
        res.send({success: false, error: "Your full name is not valid"});
        return;
    }
    if(password.length < 8){
        res.send({success: false, error: "Your password is too short"});
        return;
    }

    query("SELECT * FROM users WHERE username=$1", [username], function(err, result){
        if(err){
            res.send({success: false, error: "Something went wrong while checking if your username is available"});
        }else{
            if(result.rows.length == 0){
                var actToken = uuid.v4().split("-").join("");
                bcrypt.hash(password, null, null, function(err, hash){
                    if(err){
                        res.send({success: false, error: "Something went wrong while saving your password"});
                        console.log(err);
                        return;
                    }
                    query("INSERT INTO users(username, email, fullname, passwordhash, acttoken) VALUES($1, $2, $3, $4, $5)", [username, email, fullName, hash, actToken], function(err, result){
                        if(err){
                            res.send({success: false, error: "Something went wrong while creating your account"});
                            console.log(err);
                        }else{
                            mail(email, "Activate your account", "Click this link to activate your account. \nhttp://pumpkin.jk-5.nl/#/activate/" + actToken);
                            res.send({success: true});
                        }
                    });
                });
            }else{
                res.send({success: false, error: "Your username is already in use. Please choose another one"});
            }
        }
    });
});

router.post("/activate", function(req, res) {
    var token = req.body.token;
    query("SELECT * FROM users WHERE acttoken=$1", [token], function(err, result){
        if(err){
            console.log(err);
            res.send({success: false, error: "Something went wrong while activating your account"});
            return;
        }
        if(result.rows.length == 0){
            res.send({success: false, error: "This activation link is invalid"});
            return;
        }

        query("UPDATE users SET acttoken=NULL WHERE id=$1", [result.rows[0].id], function(err, result){
            if(err){
                console.log(err);
                res.send({success: false, error: "Something went wrong while activating your account"});
                return;
            }
            res.send({success: true});
            //TODO: create and send session
        });
    });
});

router.get("/available", function(req, res) {
    var username = req.params["username"];
    query("SELECT * FROM users WHERE username=$1", [username], function(err, result){
        if(err){
            res.send({available: true});
        }else{
            res.send({available: result.rows.length == 0});
        }
    });
});

module.exports = router;
