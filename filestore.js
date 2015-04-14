var fs = require("fs");
var uuid = require("node-uuid");
var path = require("path");

var filestoreBase = path.join(__dirname, "filestore");

function exists(path, cb){
    fs.stat(path, function(err){
        cb(err ? false : true);
    });
}

function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", done);

    var wr = fs.createWriteStream(target);
    wr.on("error", done);
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

exists(filestoreBase, function(exists){
    if(!exists) fs.mkdir(filestoreBase, function(err){});
});

module.exports = {
    add: function(file, cb){
        var id = uuid.v4().split("-").join("");
        var dest = path.join(filestoreBase, id);
        copyFile(file, dest, function(err){
            if(cb) cb(err, id);
        })
    },
    addPipe: function(){
        var id = uuid.v4().split("-").join("");
        var dest = path.join(filestoreBase, id);
        return fs.createWriteStream(dest);
    },
    getPath: function(id){
        return path.join(filestoreBase, id);
    },
    readPipe: function(id){
        var dest = path.join(filestoreBase, id);
        return fs.createReadStream(dest);
    },
    remove: function(id, cb){
        var location = path.join(filestoreBase, id);
        fs.unlink(location, cb);
    }
};
