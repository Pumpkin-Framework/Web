
module.exports = angular.module("pumpkin.mappack.settings", [])
    .controller("MappackSettingsController", ["$scope", "$routeParams", function($scope, $routeParams){
        //TODO: query from db
        $scope.mappack = {
            id: $routeParams.id
        };
        $scope.settings = [
            {
                name: "Name",
                type: "string",
                value: "insert name here"
            },
            {
                name: "Spawn Mobs",
                type: "boolean",
                value: true
            },
            {
                name: "Gamemode",
                type: "select",
                options: ["survival", "creavive", "adventure", "spectator"],
                value: "adventure"
            },
            {
                name: "Teams",
                type: "list",
                options: [
                    {
                        name: "ID",
                        type: "string",
                        value: ""
                    },
                    {
                        name: "Name",
                        type: "string",
                        value: ""
                    },
                    {
                        name: "Color",
                        type: "select",
                        options: ["white", "orange", "magenta", "light blue", "yellow", "green", "pink", "dark gray", "gray", "cyan", "purple", "blue", "brown", "dark green", "red", "black"],
                        value: "white"
                    },
                    {
                        name: "Friendly fire",
                        type: "boolean",
                        value: true
                    },
                    {
                        name: "Friendly invisibles visible",
                        type: "boolean",
                        value: false
                    },
                    {
                        name: "Name-tag visibility",
                        type: "select",
                        options: ["always", "never", "same team only", "other teams only"],
                        value: "always"
                    },
                    {
                        name: "Death message visibility",
                        type: "select",
                        options: ["always", "never", "same team only", "other teams only"],
                        value: "always"
                    }
                ],
                values: []
            }
        ];
        $scope.addNested = function(setting){
            setting.values.push(JSON.parse(JSON.stringify(setting.options)));
        };
        $scope.deleteValue = function(setting, value){
            var idx = setting.values.indexOf(value);
            if(idx >= 0){
                setting.values.splice(idx, 1);
            }
        };
        $scope.save = function(){
            console.log($scope.settings);
        };
    }])
;
