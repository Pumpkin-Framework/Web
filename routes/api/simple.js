var express = require('express');
var router = express.Router();

router.get("/online-players", function(req, res) {
    res.send([
        {
            id: 0,
            fullName: "Jeffrey Kog",
            mcUsername: "jk_5"
        },
        {
            id: 1,
            fullName: "Martijn Reening",
            mcUsername: "PostVillageCore"
        },
        {
            id: 2,
            fullName: "Matthias van de Meent",
            mcUsername: "mattashii_"
        },
        {
            id: 3,
            fullName: "Maurice van der Ploeg",
            mcUsername: "zM600D"
        },
        {
            id: 4,
            fullName: "Thomas Nevels",
            mcUsername: "ThimThom"
        },
        {
            id: 5,
            fullName: "Marit Kog",
            mcUsername: "Clank26"
        },
        {
            id: 6,
            fullName: "Jelte Koops",
            mcUsername: "jeltexx"
        },
        {
            id: 7,
            fullName: "Jorick Ensing",
            mcUsername: "SeanyJo"
        },
        {
            id: 8,
            fullName: "Carel Botterman",
            mcUsername: "carel538"
        },
        {
            id: 9,
            fullName: "Maurits Botterman",
            mcUsername: "maurits538"
        },
        {
            id: 10,
            fullName: "Wouter Hagedoorn",
            mcUsername: "wouter"
        },
        {
            id: 11,
            fullName: "Notch",
            mcUsername: "notch"
        },
        {
            id: 12,
            fullName: "Je Moeder",
            mcUsername: "jemoeder"
        }
    ]);
});

module.exports = router;
