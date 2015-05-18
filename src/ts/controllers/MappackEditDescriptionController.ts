/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface IInfoParams extends angular.route.IRouteParamsService {
        id: number
    }

    interface IInfoScope extends ng.IScope {
        mappack: IMappack
        isAuthor: boolean
        alert: IAlert
        save(): void
    }

    interface IMappack {
        id: number
        descUrl: string
        updated: number
    }

    interface IAlert {
        head: string
        desc: string
        cls: string
    }

    export class MappackEditDescriptionController {

        public static $injector = [
            "$scope", "$http", "$routeParams", "$timeout"
        ];

        constructor(
            private $scope: IInfoScope,
            private $http: ng.IHttpService,
            private $routeParams: IInfoParams,
            private $timeout: ng.ITimeoutService
        ){
            var id = $routeParams.id;

            $scope.mappack = <IMappack>{
                id: id
            };

            $scope.alert = {
                head: "",
                desc: "",
                cls: "hidden"
            };

            var editor = ace.edit("mappack-desc-editor");
            editor.getSession().setMode("ace/mode/markdown");
            editor.setTheme("ace/theme/github");
            editor.setValue("Loading...");
            editor.clearSelection();
            editor.moveCursorTo(0, 0);
            editor.setBehavioursEnabled(true);
            editor.setShowFoldWidgets(false);
            editor.setShowPrintMargin(false);
            editor.getSession().setUseSoftTabs(true);
            editor.getSession().setUseWrapMode(true);
            editor.$blockScrolling = Infinity;
            $http.get("/api/mappack/" + id + "/description.md").success(function(data: any){
                editor.setValue(data);
                editor.clearSelection();
                editor.moveCursorTo(0, 0);
            });

            $scope.save = function(){
                $http.post("/api/mappack/" + id + "/description.md", {data: editor.getValue()}).success(function(data: any){
                    $scope.alert = {
                        head: data.success ? "Jay!" : "Oops!",
                        desc: data.success ? "Your changes have been saved" : data.error,
                        cls: data.success ? "alert-success" : "alert-danger"
                    };
                    $timeout(function(){
                        $scope.alert = {
                            head: "",
                            desc: "",
                            cls: "hidden"
                        };
                    }, 10000);
                });
            };

            $scope.$on("$destroy", function(){
                editor.destroy();
            });
        }
    }
}
