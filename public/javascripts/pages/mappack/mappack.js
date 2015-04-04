var angular = require("angular");

module.exports = angular.module("pumpkin.mappack.info", [])
    .controller("MappackInfoController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){
        var id = $routeParams.id;
        $scope.mappack = [];
        $http.get("/api/mappack/" + id).success(function(data){
            $scope.mappack = data;
        });
    }])
;
