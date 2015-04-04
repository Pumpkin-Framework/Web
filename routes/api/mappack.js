var fs = require('fs');
var express = require('express');
var mail = require('../../mailer');
var query = require('../../database');
var path = require("path");
var router = express.Router();

var nologoImg = path.join(__dirname, '../../public/images', 'nologo.png');

router.get("/", function(req, res) {
    query("SELECT \
             mappacks.id, \
             mappacks.name, \
             string_agg(users.fullname, ', ') AS authors \
           FROM mappacks \
             JOIN mappack_author ON mappack_author.mappack_id = mappacks.id \
             JOIN users ON mappack_author.author_id = users.id \
           GROUP BY mappacks.id, mappacks.name"
        , [], function(err, result){
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(result.rows);
            }
        });
});

router.get("/:id", function(req, res) {
    var id = req.params["id"];
    query("SELECT \
             mappacks.id, \
             mappacks.name, \
             string_agg(users.fullname, ', ') AS authors \
           FROM mappacks \
             JOIN mappack_author ON mappack_author.mappack_id = mappacks.id \
             JOIN users ON mappack_author.author_id = users.id \
           WHERE mappacks.id=$1 \
           GROUP BY mappacks.id, mappacks.name"
        , [id], function(err, result){
            if(err){
                console.log(err);
                res.send({});
            }else{
                res.send(result.rows[0]);
            }
    });
});

router.get("/:id/logo.png", function(req, res) {
    var id = req.params["id"];
    query("SELECT id FROM mappacks WHERE id=$1", [id], function(err, result){
        if(err){
            console.log(err);
            res.send(500, {error: "Database error"});
        }else if(result.rows.length == 0){
            res.send(404, {error: "Mappack not found"});
        }else{
            var p = path.join(__dirname, "../../mappacks/" + result.rows[0].id, "logo.png");
            fs.stat(p, function(err){
                res.sendFile(err ? nologoImg : p);
            });
        }
    });
});

module.exports = router;
