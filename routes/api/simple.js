module.exports = function(env){
    function add(path){
        env.filestore.add(path, function(err, id){
            console.log(path + ": " + id);
        });
    }

    env.router.get("/api/online-players", function(req, res) {
        res.send([
            {
                id: 0,
                username: "jk_5"
            },
            {
                id: 1,
                username: "PostVillageCore"
            },
            {
                id: 2,
                username: "mattashii_"
            },
            {
                id: 3,
                username: "zM600D"
            },
            {
                id: 4,
                username: "ThimThom"
            },
            {
                id: 5,
                username: "Clank26"
            },
            {
                id: 6,
                username: "jeltexx"
            },
            {
                id: 7,
                username: "SeanyJo"
            },
            {
                id: 8,
                username: "carel538"
            },
            {
                id: 9,
                username: "maurits538"
            },
            {
                id: 10,
                username: "wouter"
            },
            {
                id: 11,
                username: "notch"
            },
            {
                id: 12,
                username: "jemoeder"
            }
        ]);
    });

    env.router.post("/api/upload", function(req, res){
        console.log(req.files);
        res.send("ok");
    });

    env.router.get("/api/file/:id", function(req, res) {
        res.sendFile(env.filestore.getPath(req.params.id));
    });
};
