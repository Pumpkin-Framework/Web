module.exports = function(router){
    router.when("/", {templateUrl: "/partials/home.html", controller: "HomeController"});
    router.otherwise({redirectTo: "/"});
};
