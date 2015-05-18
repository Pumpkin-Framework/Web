/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface IInfoScope extends ng.IScope {
        mappack: IMappack
        isAuthor: boolean
        create(): void
    }

    interface IMappack {
        name: string
        world: IMappackWorld
    }

    interface IMappackWorld {
        generator: string
        upload: boolean
        uploadFile: any
        flatOptions: string
    }

    export class MappackCreateController {

        public static $injector = [
            "$scope", "$http", "$location"
        ];

        constructor(
            private $scope: IInfoScope,
            private $http: ng.IHttpService,
            private $location: ng.ILocationService
        ){
            $scope.mappack = <IMappack>{
                name: "",
                world: {
                    generator: "overworld",
                    upload: false,
                    uploadFile: {},
                    flatOptions: "3;minecraft:bedrock,2*minecraft:dirt,minecraft:grass;1;village"
                }
            };
            $scope.create = function(){
                $http.post("/api/mappack", {name: $scope.mappack.name}).success(function(data: any){
                    $location.path("/mappack/" + data.mappack.id + "/settings");
                });

                /*var xhr = new XMLHttpRequest();
                 var formData = new FormData();
                 xhr.open("POST", "/api/upload");
                 formData.append("file", $scope.mappack.world.upload);
                 xhr.send(formData);*/
            };
        }
    }
}
