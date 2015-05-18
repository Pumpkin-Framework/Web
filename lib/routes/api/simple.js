module.exports = function(env){
    function add(path){
        env.filestore.add(path, function(err, id){
            console.log(path + ": " + id);
        });
    }

    env.on("gs-player-join", function(player){
        env.io.sockets.emit("player-join", player);
    });

    env.on("gs-player-leave", function(player){
        env.io.sockets.emit("player-leave", player);
    });

    env.router.get("/api/online-players", function(req, res) {
        res.send({success: true, onlinePlayers: env.gameserver.onlinePlayers});
    });

    env.router.post("/api/upload", function(req, res){
        console.log(req.files);
        res.send("ok");
    });

    env.router.get("/api/file/:id", function(req, res) {
        res.sendFile(env.filestore.getPath(req.params.id));
    });
};
