var fs = require('fs');
var express = require('express');
var mail = require('../../mailer');
var query = require('../../database');
var path = require("path");
var markdown = require("markdown").markdown;
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
    var userid = req.session ? req.session.user : undefined;
    query("SELECT \
             mappacks.id, \
             mappacks.name, \
             string_agg(users.id::TEXT, ', ') AS author_ids, \
             string_agg(users.fullname, ', ') AS authors, \
             mappack_revision.version \
           FROM mappacks \
             JOIN mappack_author ON mappack_author.mappack_id = mappacks.id \
             JOIN users ON mappack_author.author_id = users.id \
             JOIN mappack_revision ON mappacks.current_rev = mappack_revision.id \
           WHERE mappacks.id=$1 \
           GROUP BY mappacks.id, mappacks.name, mappack_revision.version, mappack_revision.date"
        , [id], function(err, result){
            if(err) {
                console.log(err);
                res.send({});
            }else if(result.rows.length == 0){
                res.send({success: false, error: "Mappack does not exist"});
            }else{
                var r = result.rows[0];
                var anames = r.authors.split(", ");
                var aids = r.author_ids.split(", ");
                var authors = [];
                for(var i in anames){
                    authors.push({
                        id: parseInt(aids[i]),
                        fullName: anames[i]
                    });
                }
                delete r.authors;
                delete r.author_ids;
                r.authors = authors;
                res.send({
                    success: true,
                    mappack: r,
                    isAuthor: (userid && aids.indexOf(userid.toString()) != -1)
                });
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
            res.send(200, {error: "Mappack not found"});
        }else{
            var p = path.join(__dirname, "../../mappacks/" + result.rows[0].id, "logo.png");
            fs.stat(p, function(err){
                res.sendFile(err ? nologoImg : p);
            });
        }
    });
});

router.get("/:id/description.html", function(req, res) {
    var id = req.params["id"];
    query("SELECT description FROM mappacks WHERE mappacks.id=$1", [id], function(err, result){
        if(err){
            console.log(err);
            res.send("");
        }else if(result.rows.length == 0){
            res.send({success: false, error: "Mappack does not exist"});
        }else{
            res.send(markdown.toHTML(result.rows[0].description));
        }
    });
});

router.get("/:id/description.md", function(req, res) {
    var id = req.params["id"];
    query("SELECT description FROM mappacks WHERE mappacks.id=$1", [id], function(err, result){
        if(err){
            console.log(err);
            res.send("");
        }else{
            res.send(result.rows[0].description);
        }
    });
});

module.exports = router;
