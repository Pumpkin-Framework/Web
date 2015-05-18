var bcrypt = require("bcrypt-nodejs");

module.exports = function(env){
    env.router.get("/api/session/", function(req, res) {
        var id = req.session ? req.session.user : undefined;
        if(!id){
            res.send({exists: false});
            return;
        }
        req.env.query("SELECT * FROM users WHERE id=$1", [id], function(results){
            if(results.rows.length != 1){
                res.send({exists: false});
                return;
            }
            var ret = results.rows[0];
            delete ret.id;
            delete ret.acttoken;
            delete ret.passwordhash;
            res.send({
                exists: true,
                user: ret
            });
        });
    });

    env.router.put("/api/session/", function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if(!username || !password){
            res.send({success: false, error: "Missing username or password"});
            return;
        }
        req.env.query("SELECT * FROM users WHERE username=$1", [username], function(results){
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
                    delete ret.id;
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

    env.router.delete("/api/session/", function(req, res) {
        req.session.reset();
        res.send({success: true});
    });
};
