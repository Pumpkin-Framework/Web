module.exports = angular.module("pumpkin.mappack.info", [])
    .controller("MappackInfoController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){
        var id = $routeParams.id;
        $http.get("/api/mappack/" + id).success(function(data){
            $scope.mappack = data.mappack;
            $scope.mappack.descUrl = "/api/mappack/" + $scope.mappack.id + "/description.html?r=" + Math.random();
            $scope.isAuthor = data.isAuthor;
        });
    }])
    .controller("MappackEditDescriptionController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){
        var id = $routeParams.id;

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
    }])
;
