/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface IMappackScope extends ng.IScope {
        mappacks: IMappack[]
    }

    interface IMappack {

    }

    export class MappackOverviewController {

        public static $injector = [
            "$scope", "$http"
        ];

        constructor(
            private $scope: IMappackScope,
            private $http: ng.IHttpService
        ){
            $scope.mappacks = [];
            $http.get("/api/mappack").success(function(data: any){
                $scope.mappacks = data.mappacks;
            });
        }
    }
}
