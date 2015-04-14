module.exports = angular.module("pumpkin.playerinfo", [])
    .controller("PlayerInfoController", ["$scope", "$http", "$rootScope", "$location", "$routeParams", function($scope, $http, $rootScope, $location, $routeParams){
        var username = $routeParams.username;
        $scope.player = {
            username: username
        };
        $http.get("/api/player/" + username).success(function(data){
            $scope.player = data.player;
        });
    }])
;
