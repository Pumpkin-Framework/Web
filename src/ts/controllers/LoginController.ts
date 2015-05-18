/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface ILoginScope extends ng.IScope {
        alert: ILoginAlert
        login: ILoginData
        doLogin(): void
    }
    interface ILoginAlert {
        head: string
        desc: string
        cls: string
    }
    interface ILoginData {
        username: string
        password: string
    }

    export class LoginController {

        public static $injector = [
            "$scope", "$http", "$rootScope", "$location"
        ];

        constructor(
            private $scope: ILoginScope,
            private $http: ng.IHttpService,
            private $rootScope: IRootScope,
            private $location: ng.ILocationService
        ){
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
                $http.put("/api/session", {username: $scope.login.username, password: $scope.login.password}).success(function(data: any){
                    if(!data.success){
                        $scope.alert.cls = "alert-danger";
                        $scope.alert.head = "Oops!";
                        $scope.alert.desc = data.error;
                    }else{
                        $rootScope.session = data.session;
                        $location.path("/");
                    }
                });
            }
        }
    }
}
