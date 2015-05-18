/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface ISettingsParams extends angular.route.IRouteParamsService {
        id: number
    }

    interface ISettingsScope extends ng.IScope {
        mappack: any
        isAuthor: boolean
    }

    export class MappackWorldsSettingsController {

        public static $injector = [
            "$scope", "$http", "$routeParams"
        ];

        constructor(
            private $scope: ISettingsScope,
            private $http: ng.IHttpService,
            private $routeParams: ISettingsParams
        ){
            var id = $routeParams.id;
            $http.get("/api/mappack/" + id).success(function(data: any){
                $scope.mappack = data.mappack;
                $scope.isAuthor = data.isAuthor;
            });
        }
    }
}
