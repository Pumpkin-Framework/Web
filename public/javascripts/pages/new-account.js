var usernameRegex = /^([a-zA-Z0-9_\-]{3,32})/;
var fullNameRegex = /^([a-zA-Z\- ]{3,128})/;
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = angular.module("pumpkin.newAccount", [])
    .controller("NewAccountController", ["$scope", "$http", function($scope, $http){
        $scope.alert = {
            head: "",
            desc: "",
            cls: "hidden"
        };
        $scope.account = {
            username: "",
            fullName: "",
            email: "",
            password1: "",
            password2: ""
        };
        $scope.cls = {
            username: "",
            fullName: "",
            email: "",
            password1: "",
            password2: ""
        };
        $scope.formDisabled = false;
        $scope.$watch("account.username", function(newVal){
            if(newVal.length == 0) return;
            if(newVal.indexOf(" ") == -1 && usernameRegex.test(newVal)){
                $http.get("/api/account/available?username=" + newVal).success(function(data){
                    if($scope.account.username != newVal) return;
                    if(data.available){
                        $scope.cls.username = "has-success";
                    }else{
                        $scope.cls.username = "has-error";
                    }
                });
            }else{
                $scope.cls.username = "has-error";
            }
        });
        $scope.$watch("account.fullName", function(newVal){
            if(newVal.length == 0) return;
            if(fullNameRegex.test(newVal)){
                $scope.cls.fullName = "has-success";
            }else{
                $scope.cls.fullName = "has-error";
            }
        });
        $scope.$watch("account.password1", function(newVal){
            if(newVal.length == 0) return;
            if(newVal.length >= 8){
                $scope.cls.password1 = "has-success";
            }else{
                $scope.cls.password1 = "has-error";
            }
            if(newVal != $scope.account.password2){
                $scope.cls.password2 = "has-error";
            }else if($scope.account.password2 >= 8){
                $scope.cls.password2 = "has-success";
            }
        });
        $scope.$watch("account.password2", function(newVal){
            if(newVal.length == 0) return;
            if(newVal.length >= 8 && $scope.account.password1 == newVal){
                $scope.cls.password2 = "has-success";
            }else{
                $scope.cls.password2 = "has-error";
            }
        });
        $scope.$watch("account.email", function(newVal){
            if(!newVal || newVal.length == 0) return;
            if(emailRegex.test(newVal)){
                $scope.cls.email = "has-success";
            }else{
                $scope.cls.email = "has-error";
            }
        });
        $scope.create = function(){
            if($scope.account.username.length < 3){
                $scope.alert.cls = "alert-warning";
                $scope.alert.head = "Oh snap!";
                $scope.alert.desc = "Your username is too short";
                return;
            }
            if($scope.account.username.length > 32){
                $scope.alert.cls = "alert-warning";
                $scope.alert.head = "Oh snap!";
                $scope.alert.desc = "Your username is too long";
                return;
            }
            if(!usernameRegex.test($scope.account.username)){
                $scope.alert.cls = "alert-warning";
                $scope.alert.head = "Oh snap!";
                $scope.alert.desc = "Your username is not valid";
                return;
            }
            var username = $scope.account.username;
            $http.get("/api/account/available?username=" + username).success(function(data){
                if(!data.available){
                    $scope.alert.cls = "alert-warning";
                    $scope.alert.head = "That's unfortunate!";
                    $scope.alert.desc = "That username is not available";
                    $scope.cls.username = "has-error";
                    return;
                }
                if(!emailRegex.test($scope.account.email)){
                    $scope.alert.cls = "alert-warning";
                    $scope.alert.head = "Oh snap!";
                    $scope.alert.desc = "Your email address is not valid";
                    return;
                }
                if(!fullNameRegex.test($scope.account.fullName)){
                    $scope.alert.cls = "alert-warning";
                    $scope.alert.head = "Oh snap!";
                    $scope.alert.desc = "Your full name is not valid";
                    return;
                }
                if($scope.account.password1.length < 8){
                    $scope.alert.cls = "alert-warning";
                    $scope.alert.head = "Oh snap!";
                    $scope.alert.desc = "Your password is too short";
                    return;
                }
                if($scope.account.password1 != $scope.account.password2){
                    $scope.alert.cls = "alert-warning";
                    $scope.alert.head = "Oh snap!";
                    $scope.alert.desc = "Both passwords don't match";
                    return;
                }

                $http.post("/api/account", {
                    username: $scope.account.username,
                    password: $scope.account.password1,
                    fullName: $scope.account.fullName,
                    email: $scope.account.email
                }).success(function(data){
                    if(data.success){
                        $scope.alert.cls = "alert-success";
                        $scope.alert.head = "Jay!";
                        $scope.alert.desc = "Your account is created. Check your mailbox for instructions on how to activate it";
                        $scope.formDisabled = true;
                    }else{
                        $scope.alert.cls = "alert-warning";
                        $scope.alert.head = "Oops!";
                        $scope.alert.desc = "Something went wrong. Try again in a few minutes";
                    }
                });
            });
        };
    }])
;
