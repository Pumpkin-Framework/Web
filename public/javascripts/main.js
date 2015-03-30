window.$ = window.jQuery = require('jquery');
var bootstrap = require("bootstrap");
var angular = require("angular");
require('angular-router-browserify')(angular);

var indexPage = require("./pages/index");
var mappackSettingsPage = require("./pages/mappack/settings");

angular.module("pumpkin", [
    "ngRoute",
    indexPage.name,
    mappackSettingsPage.name
])
    .config(["$routeProvider", require("./routes")])
    .run(function($rootScope, $http){
        $http.get('/api/session').success(function(data) {
            $rootScope.session = data;
        });
    })
;

angular.bootstrap(document, ["pumpkin"]);
