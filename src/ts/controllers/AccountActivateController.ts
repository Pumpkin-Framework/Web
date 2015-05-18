/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface IInfoParams extends angular.route.IRouteParamsService {
        token: string
    }

    interface IInfoScope extends ng.IScope {
        account: IAccount
        alert: IAlert
    }

    interface IAccount {
    }

    interface IAlert {
        head: string
        desc: string
        cls: string
    }

    export class AccountActivateController {

        public static $injector = [
            "$scope", "$http", "$routeParams"
        ];

        constructor(
            private $scope: IInfoScope,
            private $http: ng.IHttpService,
            private $routeParams: IInfoParams
        ){
            var token = $routeParams.token;
            $scope.account = <IAccount>{};
            $scope.alert = {
                head: "",
                desc: "",
                cls: "hidden"
            };
            $http.post("/api/account/activate", {token: token}).success(function(data: any){
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
        }
    }
}
