module.exports = function(router){
    router.when("/", {templateUrl: "/partials/home.html", controller: "HomeController"});
    router.when("/mappack/:id/settings", {templateUrl: "/partials/mappack/settings.html", controller: "MappackSettingsController"});
    router.otherwise({redirectTo: "/"});
};
