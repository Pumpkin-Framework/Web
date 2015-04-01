module.exports = function(router){
    router.when("/", {templateUrl: "/partials/home.html", controller: "HomeController"});
    router.when("/account/new", {templateUrl: "/partials/new-account.html", controller: "NewAccountController"});
    router.when("/activate/:token", {templateUrl: "/partials/activate-account.html", controller: "ActivateAccountController"});
    router.when("/mappack/:id/settings", {templateUrl: "/partials/mappack/settings.html", controller: "MappackSettingsController"});
    router.otherwise({redirectTo: "/"});
};
