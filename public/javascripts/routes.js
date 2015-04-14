module.exports = function(router){
    router.when("/", {templateUrl: "/partials/home.html", controller: "HomeController"});
    router.when("/login", {templateUrl: "/partials/login.html", controller: "LoginController"});
    router.when("/account/new", {templateUrl: "/partials/new-account.html", controller: "NewAccountController"});
    router.when("/activate/:token", {templateUrl: "/partials/activate-account.html", controller: "ActivateAccountController"});
    router.when("/mappack/new", {templateUrl: "/partials/mappack/new-mappack.html", controller: "NewMappackController"});
    router.when("/mappack/:id", {templateUrl: "/partials/mappack/mappack.html", controller: "MappackInfoController"});
    router.when("/mappack/:id/edit", {templateUrl: "/partials/mappack/edit-desc.html", controller: "MappackEditDescriptionController"});
    router.when("/mappack/:id/settings", {templateUrl: "/partials/mappack/settings.html", controller: "MappackSettingsController"});
    router.when("/mappacks", {templateUrl: "/partials/mappack/overview.html", controller: "MappackOverviewController"});
    router.when("/user/:username", {templateUrl: "/partials/player.html", controller: "PlayerInfoController"});
    router.otherwise({redirectTo: "/"});
};
