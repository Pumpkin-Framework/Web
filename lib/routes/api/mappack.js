var fs = require('fs');
var path = require("path");
var markdown = require("markdown").markdown;

var nologoImg = path.join(__dirname, '../../public/images', 'nologo.png');

module.exports = function(env){
    env.router.get("/api/mappack/", function(req, res) {
        req.env.query("SELECT \
                 mappacks.id, \
                 mappacks.name, \
                 string_agg(users.username, ', ') AS authors \
               FROM mappacks \
                 JOIN mappack_author ON mappack_author.mappack_id = mappacks.id \
                 JOIN users ON mappack_author.author_id = users.id \
               WHERE public=TRUE \
               GROUP BY mappacks.id, mappacks.name"
            , [], function(result){
                res.send({success: true, mappacks: result.rows});
            });
    });

    env.router.post("/api/mappack/", function(req, res) {
        var userid = req.env.requireSession();
        if(!userid) return;
        req.env.query("INSERT INTO mappacks (name, description, description_by, description_updated) VALUES($1, 'No description available yet', $2, NOW()) RETURNING id", [req.body.name, userid], function(result){
            if(result.rows.length == 1){
                var mpid = result.rows[0].id;
                req.env.query("INSERT INTO mappack_author (mappack_id, author_id, role) VALUES($1, $2, 'Creating the mappack')", [mpid, userid], function(result) {
                    res.send({success: true, mappack: {id: mpid}});
                });
            }else{
                res.send({success: false, error: "Database error"});
            }
        });
    });

    env.router.get("/api/mappack/:id", function(req, res) {
        var id = req.params["id"];
        var userid = req.session ? req.session.user : undefined;
        req.env.query("SELECT \
                 mappacks.id, \
                 mappacks.name, \
                 mappacks.version, \
                 mappacks.description_by, \
                 mappacks.description_updated, \
                 string_agg(author.id::TEXT, ', ') AS author_ids, \
                 string_agg(author.username, ', ') AS authors, \
                 editor.username AS editor_username\
               FROM mappacks \
                 JOIN mappack_author ON mappack_author.mappack_id = mappacks.id \
                 INNER JOIN users author ON mappack_author.author_id = author.id \
                 INNER JOIN users editor ON mappacks.description_by = editor.id \
               WHERE mappacks.id=$1 \
               GROUP BY mappacks.id, mappacks.name, mappacks.version, editor.username, mappacks.description_by, mappacks.description_updated"
            , [id], function(result){
                if(result.rows.length == 0){
                    res.send({success: false, error: "Mappack does not exist"});
                }else{
                    var r = result.rows[0];
                    var anames = r.authors.split(", ");
                    var aids = r.author_ids.split(", ");
                    var authors = [];
                    for(var i in anames){
                        authors.push({
                            id: parseInt(aids[i]),
                            username: anames[i]
                        });
                    }
                    delete r.authors;
                    delete r.author_ids;
                    r.authors = authors;
                    r.descriptionEditor = {
                        username: r.editor_username
                    };
                    r.descriptionUpdated = r.description_updated;
                    delete r.editor_username;
                    delete r.description_by;
                    delete r.description_updated;
                    res.send({
                        success: true,
                        mappack: r,
                        isAuthor: (userid && aids.indexOf(userid.toString()) != -1)
                    });
                }
        });
    });

    env.router.get("/api/mappack/:id/logo.png", function(req, res) {
        var id = req.params["id"];
        req.env.query("SELECT logo_file FROM mappacks WHERE id=$1", [id], function(result){
            if(result.rows.length == 0){
                res.send({success: false, error: "Mappack not found"});
            }else{
                var fileId = result.rows[0].logo_file;
                if(fileId){
                    res.set("Content-Type", "image/png");
                    res.sendFile(env.filestore.getPath(fileId));
                }else{
                    res.sendFile(nologoImg);
                }
            }
        });
    });

    env.router.get("/api/mappack/:id/description.html", function(req, res) {
        var id = req.params["id"];
        req.env.query("SELECT description FROM mappacks WHERE mappacks.id=$1", [id], function(result){
            if(result.rows.length == 0){
                res.send({success: false, error: "Mappack does not exist"});
            }else{
                res.send(markdown.toHTML(result.rows[0].description));
            }
        });
    });

    function filterImages(ast, cb){
        if(!cb.level) cb.level = 0;
        ast.forEach(function(e, i, arr){
            if(cb.done) return;
            if(Array.isArray(e)){
                cb.level ++;
                filterImages(e, cb);
                cb.level --;
            }else if((typeof e) == "string"){
                if(e == "img" && i < arr.length - 1){
                    var img = arr[i + 1];
                    if(img.href.indexOf("https://pumpkin.jk-5.nl/") != 0 && img.href.indexOf("http://pumpkin.jk-5.nl/") != 0){
                        cb({
                            success: false,
                            error: "Image reference to external domain is not allowed. Bad url:  " + img.href
                        });
                        cb.done = true;
                    }
                }
            }
        });
        if(cb.level == 0 && !cb.done){
            cb(undefined);
        }
    }

    env.router.get("/api/mappack/:id/description.md", function(req, res) {
        var id = req.params["id"];
        req.env.query("SELECT description FROM mappacks WHERE mappacks.id=$1", [id], function(result){
            res.send(result.rows[0].description);
        });
    });

    env.router.post("/api/mappack/:id/description.md", function(req, res) {
        var id = req.params["id"];
        var data = req.body["data"];
        var userid = req.env.requireSession();
        if(!userid) return;
        req.env.query("SELECT \
                 string_agg(mappack_author.author_id::TEXT, ', ') AS author_ids \
               FROM mappacks \
                 JOIN mappack_author ON mappack_author.mappack_id = mappacks.id \
               WHERE mappacks.id=$1"
            , [id], function(result){
                if(result.length == 0){
                    res.send({success: false, error: "Mappack does not exist"});
                    return
                }
                var r = result.rows[0];
                var aids = r.author_ids.split(", ");
                if(aids.indexOf(userid.toString()) != -1){
                    var ast = markdown.parse(data);
                    filterImages(ast, function(err){
                        if(err != undefined){
                            res.send(err);
                        }else{
                            req.env.query("UPDATE mappacks SET description=$1, description_by=$2, description_updated=NOW() WHERE id=$3", [data, userid, id], function(result){
                                res.send({success: true});
                            });
                        }
                    });
                }else{
                    res.status(401).send({success: false, error: "You may not edit this mappack"});
                }
            });
    });
};
