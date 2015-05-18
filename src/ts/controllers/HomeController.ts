/// <reference path='../_all.ts' />

module pumpkinWeb {

    interface IHomeScope extends ng.IScope {
        onlinePlayers: IPlayer[]
    }
    interface IPlayer {
        profile: IPlayerProfile
    }
    interface IPlayerProfile {
        id: string
    }

    export class HomeController {

        public static $injector = [
            "$scope", "$http", "$socket"
        ];

        constructor(
            private $scope: IHomeScope,
            private $http: ng.IHttpService,
            private socket
        ){
            $scope.onlinePlayers = [];
            $http.get("/api/online-players").success(function(data: any){
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
        }
    }
}
