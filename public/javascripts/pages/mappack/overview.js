var angular = require("angular");

module.exports = angular.module("pumpkin.mappack.overview", [])
    .controller("MappackOverviewController", ["$scope", "$http", function($scope, $http){
        $scope.mappacks = [];
        $http.get("/api/mappack").success(function(data){
            $scope.mappacks = data;
        });
    }])
;
