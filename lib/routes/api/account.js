var uuid = require("node-uuid");
var bcrypt = require("bcrypt-nodejs");

var usernameRegex = /^([a-zA-Z0-9_\-]{3,32})/;
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = function(env){
    env.router.post("/api/account/", function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;

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
        if(password.length < 8){
            res.send({success: false, error: "Your password is too short"});
            return;
        }

        req.env.query("SELECT * FROM users WHERE username=$1", [username], function(result){
            if(result.rows.length == 0){
                var actToken = uuid.v4().split("-").join("");
                bcrypt.hash(password, null, null, function(err, hash){
                    if(err){
                        res.send({success: false, error: "Something went wrong while saving your password"});
                        console.log(err);
                        return;
                    }
                    env.query("INSERT INTO users(username, email, passwordhash, acttoken) VALUES($1, $2, $3, $4, $5)", [username, email, hash, actToken], function(err, result){
                        if(err){
                            res.send({success: false, error: "Something went wrong while creating your account"});
                            console.log(err);
                        }else{
                            env.mail(email, "Activate your account", "Click this link to activate your account. \nhttp://pumpkin.jk-5.nl/#/activate/" + actToken);
                            res.send({success: true});
                        }
                    });
                });
            }else{
                res.send({success: false, error: "Your username is already in use. Please choose another one"});
            }
        });
    });

    env.router.post("/api/account/activate", function(req, res) {
        var token = req.body.token;
        req.env.query("SELECT * FROM users WHERE acttoken=$1", [token], function(result){
            if(result.rows.length == 0){
                res.send({success: false, error: "This activation link is invalid"});
                return;
            }

            req.env.query("UPDATE users SET acttoken=NULL WHERE id=$1", [result.rows[0].id], function(result){
                res.send({success: true});
                //TODO: create session
            });
        });
    });

    env.router.get("/api/account/available", function(req, res) {
        var username = req.params["username"];
        req.env.query("SELECT * FROM users WHERE username=$1", [username], function(result){
            res.send({available: result.rows.length == 0});
        });
    });
};
