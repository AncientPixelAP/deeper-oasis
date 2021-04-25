let Player = require("./player");

class GameData {
    constructor() {
        this.players = [];
        this.stoneStacks = [];

        this.oasis = {
            radius: 2
        }

        this.states = {
            grow: 0,
            wait: 1,
            ended: 2,
        }

        this.state = this.states.grow;
    }

    update(){
        switch(this.state){
            case this.states.racing:
                this.allFinished = false;
                for (let p of this.players) {
                    if (p.laps <= this.lapsToFinish) {
                    } else {
                        if (this.finishTimer === null) {
                            this.state = this.states.waitToFinish;
                            this.finishTimer = setInterval(() => {
                                this.allFinished = true;
                                this.state = this.states.finished;
                            }, this.players.length > 1 ? p.bestLapTime : 5000);
                        }
                    }
                }
                break;
            case this.states.wait:
                
                break;
            case this.states.ended:
                break;
            default:
                break;
        }

        
    }

    addStoneStack(_id, _data){
        this.stoneStacks.push({
            id: _id,
            data: {
                pos: {
                    x: _data.pos.x,
                    y: _data.pos.y,
                    z: _data.pos.z
                }
            }
        });
    }

    addPlayer(_id, _data){
        this.players.push(new Player(_id, _data));
    }

    removePlayer(_id) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id === _id) {
                this.players.splice(i, 1);
            }
        }
    }
}
module.exports = GameData;