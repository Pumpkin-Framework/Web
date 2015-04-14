module.exports = angular.module("pumpkin.mappack.new", ["ur.file"])
    .controller("NewMappackController", ["$scope", "$http", function($scope, $http){
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
            //TODO: input validation
            $http.post("/api/mappack", {mappack: {
                name: $scope.mappack.name,
                world: {
                    type: $scope.mappack.world.type,
                    generator: $scope.mappack.world.type == "generated" ? $scope.mappack.world.generator : undefined
                }
            }}).success(function(data){
                //TODO
            });

            /*var xhr = new XMLHttpRequest();
            var formData = new FormData();
            xhr.open("POST", "/api/upload");
            formData.append("file", $scope.mappack.world.upload);
            xhr.send(formData);*/
        };
    }])
;
