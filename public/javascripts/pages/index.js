var angular = require("angular");

module.exports = angular.module("pumpkin.index", ["ui.bootstrap"])
    .controller("HomeController", ["$scope", "$http", function($scope, $http){
        $scope.onlinePlayers = [];
        $http.get("/api/online-players").success(function(data){
            $scope.onlinePlayers = data;
        });
    }])
;
