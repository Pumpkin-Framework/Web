
module.exports = function(wss, env){

    env.gameserver.onlinePlayers = [];

    wss.on("connection", function(ws) {
        console.log("Connection opened");

        ws.on("message", function(msg){
            var packet = JSON.parse(msg);
            if(!packet.type){
                console.log("Packet does not have 'type' element: " + packet);
                return;
            }
            switch(packet.type){
                case "init":
                    env.gameserver.onlinePlayers = packet.online.map(function(e){
                        return {profile: e};
                    });
                    break;
                case "player-join":
                    env.gameserver.onlinePlayers.push({profile: packet.player});
                    env.emit("gs-player-join", {profile: {id: packet.player.id, name: packet.player.name}});
                    break;
                case "player-leave":
                    var idx = -1;
                    for(var i = 0; i < env.gameserver.onlinePlayers.length; i++){
                        var pl = env.gameserver.onlinePlayers[i];
                        if(pl.profile.id == packet.player.id){
                            idx = i;
                        }
                    }
                    if(idx != -1){
                        env.gameserver.onlinePlayers.splice(idx, 1);
                        env.emit("gs-player-leave", {profile: {id: packet.player.id, name: packet.player.name}});
                    }
                    break;
                default:
                    console.log("Unknown packet:");
                    console.log(packet);
                    break;
            }
        })
    });
};
