module.exports = angular.module("pumpkin.mappack.info", [])
    .controller("MappackInfoController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){
        var id = $routeParams.id;
        $http.get("/api/mappack/" + id).success(function(data){
            $scope.mappack = data.mappack;
            $scope.mappack.descUrl = "/api/mappack/" + $scope.mappack.id + "/description.html?r=" + Math.random();
            $scope.mappack.updated = new Date(data.mappack.descriptionUpdated).getTime();
            $scope.isAuthor = data.isAuthor;
        });
    }])
    .controller("MappackEditDescriptionController", ["$scope", "$http", "$routeParams", "$timeout", function($scope, $http, $routeParams, $timeout){
        var id = $routeParams.id;

        $scope.mappack = {
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
        $http.get("/api/mappack/" + id + "/description.md").success(function(data){
            editor.setValue(data);
            editor.clearSelection();
            editor.moveCursorTo(0, 0);
        });

        $scope.save = function(){
            $http.post("/api/mappack/" + id + "/description.md", {data: editor.getValue()}).success(function(data){
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
    }])
;
