window.$ = window.jQuery = require('jquery');
var bootstrap = require("bootstrap");
var angular = require("angular");
require('angular-router-browserify')(angular);

var indexPage = require("./pages/index");
var mappackSettingsPage = require("./pages/mappack/settings");
var newAccountPage = require("./pages/new-account");
var activateAccountPage = require("./pages/activate-account");

angular.module("pumpkin", [
    "ngRoute",
    indexPage.name,
    mappackSettingsPage.name,
    newAccountPage.name,
    activateAccountPage.name
])
    .config(["$routeProvider", require("./routes")])
    .run(function($rootScope, $http){
        $http.get('/api/session').success(function(data) {
            $rootScope.session = data;
        });
    })
;

angular.bootstrap(document, ["pumpkin"]);
