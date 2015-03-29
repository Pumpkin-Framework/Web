var express = require('express');
var router = express.Router();

router.get("/", function(req, res) {
    res.send({
        exists: true,
        user: {
            username: "jk-5",
            fullName: "Jeffrey Kog"
        }
    });
});

module.exports = router;
