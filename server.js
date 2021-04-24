var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
let server = app.listen(port, () => {
    console.log("running on port " + String(port));
});

app.use(express.static(__dirname  + "/public"));

let socket = require("socket.io");
let io = socket(server);

let GameData = require("./gameData");
let gameData = new GameData();

let tick = setInterval(() => { 
    gameData.update();

    if (gameData.state === gameData.states.ended) {
        console.log("game ended")
    }

    for(let p of gameData.players){
        if (gameData.state === gameData.states.ended){
            io.to(p.id).emit("gameover", {
                
            });
        }

        io.to(p.id).emit("synchUpdate", {
            playersData: gameData.players,
        });
    }
}, 100);

io.on("connection", socket => {
    console.log(socket.id);
    let id = socket.id;

    //TEST
    socket.on("pingTest", (_data) => {
        console.log("ping!");
        io.emit("pongTest", _data);
    });
    socket.on("foo", () => {
        console.log("foobar!");
        io.emit("bar", {text: "bar"});
    });


    //PLAYERS
    socket.on("joinPlayer", (_data) => {
        gameData.addPlayer(id, _data);
        io.to(id).emit("getPlayers", {
            you: gameData.players[gameData.players.length-1],
            playersData: gameData.players,
            objectsData: {
                stoneStacks: gameData.stoneStacks
            }
        });
    });

    socket.on("leavePlayer", () => {
        gameData.removePlayer(id);
        io.emit("kickPlayer", {
            id: id
        })
    });

    socket.on("updatePlayer", (_data) => {
        let p = getPlayerById(_data.id);
        if(p !== null){
            p.pos.x = _data.pos.x;
            p.pos.y = _data.pos.y;
            p.pos.z = _data.pos.z;
            p.data = _data;
        }
    })

    socket.on("quickMessage", (_data) => {
        for(let p of gameData.players){
            if(p.locationId === _data.locationId){
                io.to(p.id).emit("quickMessage", {
                    txt: _data.txt
                });
            }
        }
    });

    //ORDERS
    /*socket.on("forceSwitchTrack", (_data) => {
        gameData.switchToTrack(_data.track);

        for (let p of gameData.players) {
            io.to(p.id).emit("switchTrack", {
                track: gameData.currentTrack
            });
        }
    });*/
    socket.on("spawnStoneStack", (_data) => {
        gameData.addStoneStack(id, _data);
        for (let p of gameData.players) {
            io.to(p.id).emit("spawnStoneStack", _data);
        }
    });

    //DISCONNECT
    socket.on("disconnect", () => {
        console.log("disconnected a client "+ id);

        gameData.removePlayer(id);
        io.emit("kickPlayer", {
            id: id
        })
    })
});


function getPlayerById(_id){
    let arr = gameData.players.filter((p) => {return p.id === _id});
    if(arr.length > 0){
        return arr[0];
    }else{
        return null;
    }
}