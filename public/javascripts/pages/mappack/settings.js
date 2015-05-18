
module.exports = angular.module("pumpkin.mappack.settings", [])
    .controller("MappackSettingsController", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http){
        var id = $routeParams.id;
        $http.get("/api/mappack/" + id).success(function(data){
            $scope.mappack = data.mappack;
            $scope.isAuthor = data.isAuthor;
        });
    }])
    .controller("MappackWorldsSettingsController", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http){
        var id = $routeParams.id;
        $http.get("/api/mappack/" + id).success(function(data){
            $scope.mappack = data.mappack;
            $scope.isAuthor = data.isAuthor;
        });
    }])
;
