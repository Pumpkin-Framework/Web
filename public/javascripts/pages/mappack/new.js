module.exports = angular.module("pumpkin.mappack.new", ["ur.file"])
    .controller("NewMappackController", ["$scope", "$http", "$location", function($scope, $http, $location){
        $scope.mappack = {
            name: "",
            world: {
                generator: "overworld",
                upload: false,
                uploadFile: {},
                flatOptions: "3;minecraft:bedrock,2*minecraft:dirt,minecraft:grass;1;village"
            }
        };
        $scope.create = function(){
            $http.post("/api/mappack", {name: $scope.mappack.name}).success(function(data){
                $location.path("/mappack/" + data.mappack.id + "/settings");
            });

            /*var xhr = new XMLHttpRequest();
            var formData = new FormData();
            xhr.open("POST", "/api/upload");
            formData.append("file", $scope.mappack.world.upload);
            xhr.send(formData);*/
        };
    }])
;
