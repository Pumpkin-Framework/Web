/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface IInfoParams extends angular.route.IRouteParamsService {
        id: number
    }

    interface IInfoScope extends ng.IScope {
        mappack: IMappack
        isAuthor: boolean
    }

    interface IMappack {
        id: number
        descUrl: string
        updated: number
    }

    export class MappackInfoController {

        public static $injector = [
            "$scope", "$http", "$routeParams"
        ];

        constructor(
            private $scope: IInfoScope,
            private $http: ng.IHttpService,
            private $routeParams: IInfoParams
        ){
            var id = $routeParams.id;
            $http.get("/api/mappack/" + id).success(function(data: any){
                $scope.mappack = data.mappack;
                $scope.mappack.descUrl = "/api/mappack/" + $scope.mappack.id + "/description.html?r=" + Math.random();
                $scope.mappack.updated = new Date(data.mappack.descriptionUpdated).getTime();
                $scope.isAuthor = data.isAuthor;
            });
        }
    }
}
