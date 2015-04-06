var indexPage = require("./pages/index");
var mappackSettingsPage = require("./pages/mappack/settings");
var newAccountPage = require("./pages/new-account");
var activateAccountPage = require("./pages/activate-account");
var mappackOverviewPage = require("./pages/mappack/overview");
var mappackInfoPage = require("./pages/mappack/mappack");
var loginPage = require("./pages/login");

angular.module("pumpkin", [
    "ngRoute",
    "angulartics",
    "angulartics.google.analytics",
    indexPage.name,
    loginPage.name,
    mappackSettingsPage.name,
    newAccountPage.name,
    activateAccountPage.name,
    mappackInfoPage.name,
    mappackOverviewPage.name
])
    .config(["$routeProvider", require("./routes")])
    .run(function($rootScope, $http, $location){
        $rootScope.navbarCollapsed = false;

        $http.get('/api/session').success(function(data) {
            $rootScope.session = data;
        });

        $rootScope.logout = function(){
            $http.delete('/api/session').success(function(){
                $rootScope.session = {exists: false};
                $location.path("/");
            });
        };
    })
;

angular.bootstrap(document, ["pumpkin"]);
