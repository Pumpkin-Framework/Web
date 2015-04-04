module.exports = function(router){
    router.when("/", {templateUrl: "/partials/home.html", controller: "HomeController"});
    router.when("/login", {templateUrl: "/partials/login.html", controller: "LoginController"});
    router.when("/account/new", {templateUrl: "/partials/new-account.html", controller: "NewAccountController"});
    router.when("/activate/:token", {templateUrl: "/partials/activate-account.html", controller: "ActivateAccountController"});
    router.when("/mappack/:id", {templateUrl: "/partials/mappack/mappack.html", controller: "MappackInfoController"});
    router.when("/mappack/:id/settings", {templateUrl: "/partials/mappack/settings.html", controller: "MappackSettingsController"});
    router.when("/mappacks", {templateUrl: "/partials/mappack/overview.html", controller: "MappackOverviewController"});
    router.otherwise({redirectTo: "/"});
};
