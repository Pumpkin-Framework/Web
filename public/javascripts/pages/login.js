var angular = require("angular");

module.exports = angular.module("pumpkin.login", [])
    .controller("LoginController", ["$scope", "$http", "$rootScope", "$location", function($scope, $http, $rootScope, $location){
        $scope.alert = {
            head: "",
            desc: "",
            cls: "hidden"
        };
        $scope.login = {
            username: "",
            password: ""
        };
        $scope.doLogin = function(){
            $http.put("/api/session", {username: $scope.login.username, password: $scope.login.password}).success(function(data){
                if(!data.success){
                    $scope.alert.cls = "alert-danger";
                    $scope.alert.head = "Oops!";
                    $scope.alert.desc = data.error;
                }else{
                    $rootScope.session = data.session;
                    $location.path("/");
                }
            });
        };
    }])
;
