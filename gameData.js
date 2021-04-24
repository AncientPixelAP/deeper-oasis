let Player = require("./player");

class GameData {
    constructor() {
        this.players = [];

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