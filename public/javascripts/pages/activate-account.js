
module.exports = angular.module("pumpkin.activateAccount", [])
    .controller("ActivateAccountController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){
        var token = $routeParams.token;
        $scope.account = {};
        $scope.alert = {
            head: "",
            desc: "",
            cls: "hidden"
        };
        $http.post("/api/account/activate", {token: token}).success(function(data){
            if(!data.success){
                $scope.alert = {
                    head: "Oh snap!",
                    desc: data.error,
                    cls: "alert-danger"
                };
            }else{
                $scope.alert = {
                    head: "Jay!",
                    desc: "Your account is now activated",
                    cls: "alert-success"
                };
            }
        });
    }])
;
