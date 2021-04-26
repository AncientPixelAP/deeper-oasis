let Player = require("./player");

class GameData {
    constructor() {
        this.players = [];
        
        this.oasis = {
            radius: 3,
            occupied: [],
            nextLetter: 0
        }
        
        this.stoneStacks = [];
        this.trees = [];
        this.scrolls = [];

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

    refreshLetter(){
        this.oasis.nextLetter = Math.floor(Math.random() * 10);
    }

    spawnStoneStack(_id, _data){
        this.stoneStacks.push({
            id: this.stoneStacks.length,
            pos: {
                x: _data.pos.x,
                y: _data.pos.y,
                z: _data.pos.z
            }
        });
    }
    removeStoneStack(_data) {
        lbl: for (let i = this.stoneStacks.length - 1; i >= 0; i--) {
            if (this.stoneStacks[i].id === _data.id) {
                this.stoneStacks.splice(i, 1);
                break lbl;
            }
        }
    }

    checkForScroll(_data){
        let found = false;
        lbl:for(let s of this.scrolls){
            if(Math.floor(s.pos.x) === Math.floor(_data.pos.x) && Math.floor(s.pos.z) === Math.floor(_data.pos.z)){
                found = true;
                break lbl;
            }
        }
        return found;
    }
    spawnScroll(_id, _data) {
        this.scrolls.push({
            id: this.scrolls.length,
            letter: Math.floor(Math.random()*10),
            pos: {
                x: _data.pos.x,
                y: _data.pos.y,
                z: _data.pos.z
            },
            taken: false
        });
    }
    removeScroll(_data){
        lbl: for (let i = this.scrolls.length - 1; i >= 0; i--) {
            if (this.scrolls[i].id === _data.id) {
                //this.scrolls.splice(i, 1);
                this.scrolls[i].taken = true;
                break lbl;
            }
        }
    }

    checkForTree(_data) {
        let found = false;
        lbl: for (let t of this.trees) {
            if (Math.floor(t.pos.x) === Math.floor(_data.pos.x) && Math.floor(t.pos.z) === Math.floor(_data.pos.z)) {
                found = true;
                break lbl;
            }
        }
        return found;
    }
    spawnTree(_id, _data) {
        this.trees.push({
            id: this.trees.length,
            pos: {
                x: _data.pos.x,
                y: _data.pos.y,
                z: _data.pos.z
            }
        });
    }
    removeTree(_data) {
        lbl: for (let i = this.trees.length - 1; i >= 0; i--) {
            if (this.trees[i].id === _data.id) {
                this.trees.splice(i, 1);
                break lbl;
            }
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