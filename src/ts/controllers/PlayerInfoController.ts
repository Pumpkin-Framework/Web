/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface IPlayerInfoScope {
        player: IPlayerInfoPlayer
    }

    interface IPlayerInfoPlayer {
        username: string
    }

    interface IPlayerInfoRouteParams extends angular.route.IRouteParamsService {
        username: string
    }

    export class PlayerInfoController {

        public static $injector = [
            "$scope", "$http", "$rootScope", "$location", "$routeParams"
        ];

        private username: string;

        constructor(
            private $scope: IPlayerInfoScope,
            private $http: ng.IHttpService,
            private $rootScope: IRootScope,
            private $location: ng.ILocationService,
            private $routeParams: IPlayerInfoRouteParams
        ){
            this.username = $routeParams.username;
            $scope.player = <IPlayerInfoPlayer>{};
            $scope.player.username = this.username;
            $http.get("/api/player/" + this.username).success(function(data: any){
                $scope.player = data.player;
            });
        }
    }
}
