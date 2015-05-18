
module.exports = angular.module("pumpkin.index", ["ui.bootstrap"])
    .controller("HomeController", ["$scope", "$http", "socket", function($scope, $http, socket){
        $scope.onlinePlayers = [];
        $http.get("/api/online-players").success(function(data){
            $scope.onlinePlayers = data.onlinePlayers;
            console.log($scope.onlinePlayers);
        });

        socket.on("player-join", function(player){
            console.log(player, "joined");
            $scope.$apply(function(){
                $scope.onlinePlayers.push(player);
            });
        });

        socket.on("player-leave", function(player){
            console.log(player, "left");
            $scope.$apply(function(){
                for(var i = 0; i < $scope.onlinePlayers.length; i++){
                    if($scope.onlinePlayers[i].profile.id == player.profile.id){
                        $scope.onlinePlayers.splice(i, 1);
                        return;
                    }
                }
            });
        });
    }])
;
