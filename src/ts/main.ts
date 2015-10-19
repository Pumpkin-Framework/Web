/// <reference path='_all.ts' />

//import angular = require("angular");

var a = angular.module('pumpkin', [
    "ngRoute",
    "angulartics",
    "angulartics.google.analytics",
    "btford.socket-io"
]).factory("socket", ["socketFactory", function(socketFactory: () => any): any {
    return socketFactory();
}])
    .controller("pumpkinWeb.LoginController", pumpkinWeb.LoginController)
    .controller("pumpkinWeb.HomeController", pumpkinWeb.HomeController)
    .controller("pumpkinWeb.PlayerInfoController", pumpkinWeb.PlayerInfoController)
    .controller("pumpkinWeb.MappackOverviewController", pumpkinWeb.MappackOverviewController)
    .controller("pumpkinWeb.MappackSettingsController", pumpkinWeb.MappackSettingsController)
    .controller("pumpkinWeb.MappackWorldsSettingsController", pumpkinWeb.MappackWorldsSettingsController)
    .controller("pumpkinWeb.MappackInfoController", pumpkinWeb.MappackInfoController)
    .controller("pumpkinWeb.MappackEditDescriptionController", pumpkinWeb.MappackEditDescriptionController)
    .controller("pumpkinWeb.AccountCreateController", pumpkinWeb.AccountCreateController)
    .controller("pumpkinWeb.ActivateAccountController", pumpkinWeb.AccountActivateController)
    .controller("pumpkinWeb.MappackCreateController", pumpkinWeb.MappackCreateController)
    .controller("pumpkinWeb.IssuesOverviewController", pumpkinWeb.IssuesOverviewController)
    .config(["$routeProvider", "$locationProvider", function(router: ng.route.IRouteProvider, location: ng.ILocationProvider){
        router.when("/", {templateUrl: "/static/partials/home.html", controller: "pumpkinWeb.HomeController"});
        router.when("/login", {templateUrl: "/static/partials/login.html", controller: "pumpkinWeb.LoginController"});
        router.when("/account/new", {templateUrl: "/static/partials/new-account.html", controller: "pumpkinWeb.AccountCreateController"});
        router.when("/activate/:token", {templateUrl: "/static/partials/activate-account.html", controller: "pumpkinWebAccountActivateController"});
        router.when("/mappack/new", {templateUrl: "/static/partials/mappack/new-mappack.html", controller: "pumpkinWeb.MappackCreateController"});
        router.when("/mappack/:id", {templateUrl: "/static/partials/mappack/mappack.html", controller: "pumpkinWeb.MappackInfoController"});
        router.when("/mappack/:id/edit", {templateUrl: "/static/partials/mappack/edit-desc.html", controller: "pumpkinWeb.MappackEditDescriptionController"});
        router.when("/mappack/:id/settings", {templateUrl: "/static/partials/mappack/settings.html", controller: "pumpkinWeb.MappackSettingsController"});
        router.when("/mappack/:id/settings/worlds", {templateUrl: "/static/partials/mappack/settings/worlds.html", controller: "pumpkinWeb.MappackWorldsSettingsController"});
        router.when("/mappacks", {templateUrl: "/static/partials/mappack/overview.html", controller: "pumpkinWeb.MappackOverviewController"});
        router.when("/user/:username", {templateUrl: "/static/partials/player.html", controller: "pumpkinWeb.PlayerInfoController"});
        router.when("/issues", {templateUrl: "/static/partials/issues/overview.html", controller: "pumpkinWeb.IssuesOverviewController"});
        router.otherwise({redirectTo: "/"});

        //location.html5Mode(true);
    }]).run(["$rootScope", "$http", "$location", function($rootScope: pumpkinWeb.IRootScope, $http: ng.IHttpService, $location: ng.ILocationService){
        $rootScope.navbarCollapsed = false;

        $http.get('/api/session').success(function(data: any) {
            $rootScope.session = data;
        });

        $rootScope.logout = function(){
            $http.delete('/api/session').success(function(){
                $rootScope.session = {exists: false};
                $location.path("/");
            });
        };

        $rootScope.newMappack = function(){
            $location.path("/mappack/new");
        };
    }]);

angular.bootstrap(document, ['pumpkin']);
