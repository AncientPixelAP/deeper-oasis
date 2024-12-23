import { Storyteller } from "../../storyteller.js";

export default class LevelDesert00{
    constructor(_scene){
        this.scene = _scene;

        /*this.objects = [];
        this.objects.push(this.scene.geometryController.loadModel("ElevatorBase", "modElevatorBase", {
            x: 0,
            y: 0,
            z: 0
        }));*/

        this.noise = this.scene.plugins.get("rexperlinplugin").add(0);
        //random noise value
        //let x, y, z = 0;
        //let rn = this.noise.simplex3(x, y, z);

        this.storyteller = new Storyteller(this.scene);
        this.travelled = 0;

        this.oasis = {
            radius: 3,
            tutStones: [],
            tiles: [],
            nextLetter: 0,
            nextLetterModel: this.scene.geometryController.loadModel("nextLetter", "modNextLetter", {
                x: 0,
                y: 0,
                z: 0
            })
        }
        this.oasis.nextLetterModel.setDrawMode(DRAWMODE.BILLBOARD);

        this.desertPos = {
            x: 0,
            y: 0,
            z: 0
        }
        this.desertParams = {
            duneFactor: 1.1,
            resolution: {
                x: 0.001,
                y: 0.001,
                z: 0.002
            },
            gridSize: 64,
            viewDist: 24
        }
        this.desertMidTileNo = 0;
        this.desert = [];
        for(let yy = -32 ; yy < 32 ; yy++){
            for (let xx = -32; xx < 32; xx++){
                if(Phaser.Math.Distance.Between(0, 0, xx, yy) < this.desertParams.viewDist){
                    this.desert.push(this.scene.geometryController.loadModel("desertTile", "modDesertTile", {
                        x: xx * this.desertParams.gridSize,
                        y: 0,
                        z: yy * this.desertParams.gridSize
                    }));
                    if(Phaser.Math.Distance.Between(0, 0, xx, yy) < 3){
                        this.oasis.tiles.push({
                            x: this.desert[this.desert.length - 1].pos.x,
                            y: 0,
                            z: this.desert[this.desert.length - 1].pos.z
                        })
                    }
                    if(xx === 0 && yy === 0){
                        this.desertMidTileNo = this.desert.length-1;
                        console.log(String(this.desert.length - 1) + " mid");
                    }
                    if(xx === 0 && yy === 1){
                        console.log(this.desert.length - 1);
                    }
                }
            }
        }

        this.sun = this.scene.add.sprite(0, 0, "sprSun00");
        this.sun.depth = -10000;

        

        this.troglodytes = [];
        this.stoneStacks = [];
        this.trees = [];
        this.scrolls = [];

        //music stuuuff
        this.musBeat = this.scene.sound.add("musBeat", { volume: 0, loop: true });
        this.musBeat.play();
        this.musFlute = this.scene.sound.add("musFlute", { volume: 0, loop: true });
        this.musFlute.play();
        this.musPlateau = this.scene.sound.add("musPlateau", { volume: 0, loop: true });
        this.musPlateau.play();
        this.musicVolume = {
            beat: 0,
            flute: 0,
            plateau: 0
        }

        this.sndDrone = this.scene.sound.add("sndDrone", { volume: OPTIONS.sfx });
        this.sndThump = this.scene.sound.add("sndThump", { volume: OPTIONS.sfx });
        this.sndDudel = this.scene.sound.add("sndDudel", { volume: OPTIONS.sfx });
        this.sndPing = this.scene.sound.add("sndPing", { volume: OPTIONS.sfx });

        this.calculateDesert();
        this.spawnTutStones();
        this.spawnFirstTrees();
    }

    update(){
        this.storyteller.update();

        let recalc = false;
        //move with the player to reuse the same desert tiles
        if (this.desertPos.z - this.scene.player.pos.z >= this.desertParams.gridSize){
            this.desertPos.z -= this.desertParams.gridSize;
            for(let d of this.desert){
                d.translateAndRotate({ x: 0, y: 0, z: -this.desertParams.gridSize}, {pitch: 0, yaw: 0, roll: 0});
                recalc = true;
            }
        } else if (this.desertPos.z - this.scene.player.pos.z < -this.desertParams.gridSize) {
            this.desertPos.z += this.desertParams.gridSize;
            for (let d of this.desert) {
                d.translateAndRotate({ x: 0, y: 0, z: this.desertParams.gridSize }, { pitch: 0, yaw: 0, roll: 0 });
                recalc = true;
            }
        }

        if (this.desertPos.x - this.scene.player.pos.x >= this.desertParams.gridSize) {
            this.desertPos.x -= this.desertParams.gridSize;
            for (let d of this.desert) {
                d.translateAndRotate({ x: -this.desertParams.gridSize, y: 0, z: 0 }, { pitch: 0, yaw: 0, roll: 0 });
                recalc = true;
            }
        } else if (this.desertPos.x - this.scene.player.pos.x < -this.desertParams.gridSize) {
            this.desertPos.x += this.desertParams.gridSize;
            for (let d of this.desert) {
                d.translateAndRotate({ x: this.desertParams.gridSize, y: 0, z: 0 }, { pitch: 0, yaw: 0, roll: 0 });
                recalc = true;
            }
        }

        //update desert tile geometry and textures based on position
        if(recalc === true){
            this.calculateDesert();
        }

        this.calculateSun({ x: 0, y: 0, z: 0 }, this.scene.player.dir); 
    }

    tryAddTree(_pos, _rn, _hh){
        let toY = ((_rn + (_hh * _hh)) * this.desertParams.duneFactor) * 64;
        if (this.checkForTree({ x: Math.floor(_pos.x), y: Math.floor(toY), z: Math.floor(_pos.z) }) === false) {
            let nv = this.noise.simplex3(_pos.x, _pos.y, _pos.z);
            let variety = Math.floor(Math.abs(nv) * 4);
            this.addTree({
                pos: {
                    x: Math.floor(_pos.x),
                    y: Math.floor(toY),
                    z: Math.floor(_pos.z)
                },
                texture: "sprTree0" + String(variety)
            })
        };
    }

    checkForTree(_pos){
        let found = false;
        for(let t of this.trees){
            if(t.pos.x === _pos.x){
                if(t.pos.z === _pos.z){
                    found = true;
                    return found;
                }
            }
        }
        return found;
    }
    
    addTree(_data, _sfx){
        let nv = this.noise.simplex3(_data.pos.x, _data.pos.y, _data.pos.z);
        let variety = Math.floor(Math.abs(nv) * 4);
        this.trees.push(this.scene.geometryController.loadModel(_data.id, "modTree", {
                x: _data.pos.x,
                y: _data.pos.y,
                z: _data.pos.z
            })
        );
        this.trees[this.trees.length - 1].setDrawMode(DRAWMODE.BILLBOARD);
        this.trees[this.trees.length - 1].quadData[0].setTexture("sprTree0" + String(variety));

        let goodPosition = false;
        for (let i = this.oasis.tiles.length - 1; i >= 0; i--) {
            let t = this.oasis.tiles[i];
            if (Phaser.Math.Distance.Between(t.x, t.z, _data.pos.x, _data.pos.z) < this.desertParams.gridSize){
                //oasis tile already near tree position
                goodPosition = true;
                for(let d of this.desert){
                    if (Phaser.Math.Distance.Between(_data.pos.x, _data.pos.z, d.pos.x, d.pos.z) < this.desertParams.gridSize * 1.5) {
                        //grwo new desert near tree
                        let arr = this.oasis.tiles.filter((el) => el.x === d.pos.x && el.z === d.pos.z);
                        if(arr.length === 0){
                            this.oasis.tiles.push({
                                x: d.pos.x,
                                y: 0,
                                z: d.pos.z
                            });
                        }
                    }
                }
            }
        }
        if(goodPosition === false){
            //no good for tree, to far away
            socket.emit("removeTree", {id: _data.id});
            console.log("not a good space for tree.. remooving");
        }else{
            if(_sfx === true){
                this.sndThump.play();
            }
            console.log("tree planted");
        }
        //console.log(this.trees.length);
    }
    tryRemoveTree(_pos) {
        for (let s of this.trees) {
            if (Phaser.Math.Distance.Between(_pos.x, _pos.z, s.pos.x, s.pos.z) < 48) {
                socket.emit("removeTree", {
                    id: s.id,
                    pos: {
                        x: s.pos.x,
                        y: s.pos.y,
                        z: s.pos.z
                    }
                });
            }
        }
    }
    removeTree(_id) {
        lbl: for (let i = this.trees.length - 1; i >= 0; i--) {
            if (this.trees[i].id === _id) {
                this.trees[i].destroy();
                this.trees.splice(i, 1);
                break lbl;
            }
        }
    }

    addStoneStack(_data, _sfx){
        this.stoneStacks.push(this.scene.geometryController.loadModel(_data.id, "modStoneStack", {
                x: _data.pos.x,
                y: _data.pos.y,
                z: _data.pos.z
            })
        );
        this.stoneStacks[this.stoneStacks.length - 1].setDrawMode(DRAWMODE.BILLBOARD);
        if(_sfx === true){
            this.sndPing.play();
        }
    }
    tryRemoveStoneStack(_pos){
        for(let s of this.stoneStacks){
            if (Phaser.Math.Distance.Between(_pos.x, _pos.z, s.pos.x, s.pos.z) < 48){
                socket.emit("removeStoneStack", {
                    id: s.id,
                    pos: {
                        x: s.pos.x,
                        y: s.pos.y,
                        z: s.pos.z
                    }
                });
            }
        }
    }
    removeStoneStack(_id){
        lbl:for(let i = this.stoneStacks.length-1 ; i >= 0 ; i--){
            if(this.stoneStacks[i].id === _id){
                this.stoneStacks[i].destroy();
                this.stoneStacks.splice(i, 1);
                break lbl;
            }
        }
    }

    addScroll(_data, _sfx) {
        if(_data.taken === false){
            let _t = this.scrolls.push(this.scene.geometryController.loadModel(_data.id, "modScroll", {
                    x: _data.pos.x,
                    y: _data.pos.y,
                    z: _data.pos.z
                })
            );
            let _this = this.scrolls[_t-1];
            _this.interactable = true;
            _this.data = {
                letter: _data.letter,
                text: "pick up",
                itemType: "letter",
                hintPic: "sprLetter"+String(_data.letter)
            }
            _this.interact = () => {
                this.scene.player.setHeldItem("sprLetter"+String(_data.letter), _this.data)
                this.scene.level.tryRemoveScroll(this.scene.player.pos);
            }
            _this.setDrawMode(DRAWMODE.BILLBOARD);
            //console.log(_this.data);
        }
    }
    tryRemoveScroll(_pos) {
        for (let s of this.scrolls) {
            if (Phaser.Math.Distance.Between(_pos.x, _pos.z, s.pos.x, s.pos.z) < 48) {
                socket.emit("removeScroll", {
                    id: s.id,
                    pos: {
                        x: s.pos.x,
                        y: s.pos.y,
                        z: s.pos.z
                    }
                });
            }
        }
    }
    removeScroll(_id) {
        lbl: for (let i = this.scrolls.length - 1; i >= 0; i--) {
            if (this.scrolls[i].id === _id) {
                this.scrolls[i].destroy();
                this.scrolls.splice(i, 1);
                break lbl;
            }
        }
    }

    addOtherPlayer(_id, _data){
        this.troglodytes.push(
            this.scene.geometryController.loadModel(_id, "modOtherPlayer", {
                x: _data.pos.x,
                y: _data.pos.y,
                z: _data.pos.z
            })
        );
        this.troglodytes[this.troglodytes.length-1].setDrawMode(DRAWMODE.BILLBOARD);
        this.troglodytes[this.troglodytes.length - 1].interactable = true;
        /*this.troglodytes[this.troglodytes.length - 1].interact = () => {
            //this.scene.player.setMode(PLAYERMODE.INTERACT);
            //this.scene.player.panel = new Panel(this.scene);
        }*/
        /*let _this = this.troglodytes[this.troglodytes.length - 1];
        this.troglodytes[this.troglodytes.length - 1].interact = () => {
            //console.log(_this.data)
            this.scene.player.setHeldItem("sprLetter" + String(variety), _this.data)
            this.scene.level.tryRemoveScroll(this.scene.player.pos);
        }*/
        return this.troglodytes[this.troglodytes.length - 1];
    }

    removeOtherPlayer(_id) {
        for (let i = this.troglodytes.length - 1; i >= 0; i--) {
            if (this.troglodytes[i].id === _id) {
                this.troglodytes[i].destroy();
                this.troglodytes.splice(i, 1);
            }
        }
    }

    calculateDesert(){
        //console.log(this.oasis.tiles.length)
        let ground = "desert";

        for (let [j, d] of this.desert.entries()) {
            let tex = "sprDesert00";
            let xx, yy, zz, rn, hh = 0;

            //paint over all oasis tiles
            for(let t of this.oasis.tiles){
                if(Phaser.Math.Distance.Between(t.x, t.z, d.pos.x, d.pos.z) < 1){
                    tex = "sprOasis00";
                    if (j === this.desertMidTileNo) {
                        ground = "oasis";
                    }
                }
            }
            //water pond in the middle
            if (Phaser.Math.Distance.Between(0, 0, d.pos.x, d.pos.z) < 1) {
                tex = "sprWater00";
            }

            for (let [i,p] of d.quadData[0].points.entries()) {
                xx = p.x + d.pos.x
                yy = 0 + d.pos.y
                zz = p.z + d.pos.z

                let homeDist = Phaser.Math.Distance.Between(0, 0, xx, zz);
                let isPlateau = false;
                
                //inital landscape
                rn = this.noise.simplex3(xx * this.desertParams.resolution.x, yy * this.desertParams.resolution.y, zz * this.desertParams.resolution.z);
                hh = this.noise.simplex3(xx * 0.001, yy * 0.001, zz * 0.001);

                if (homeDist >= 22560 && homeDist < 23072) {
                    rn += Math.abs(rn);
                }else if (homeDist >= 23072 && homeDist < 23200){
                    if (this.noise.simplex3(xx * 0.0005, yy * 0.0005, zz * 0.0005) > -0.6) {
                        rn = -2;
                        hh = 0;
                        tex = "sprMarble00";
                    }
                }else{
                    //rare spikes
                    if (this.noise.simplex3(xx * 0.1, yy * 0.1, zz * 0.1) > 0.95) {
                        rn = -5;
                        hh = 0;
                        tex = "sprDesert01";
                        isPlateau = true; //TODO maaybe remove if it hurts the temple generation
                    }

                    //rare plateus
                    if (this.noise.simplex3(xx * 0.0005, yy * 0.0005, zz * 0.0005) > 0.6) {
                        if (j === this.desertMidTileNo) {
                            ground = "plateau";
                        }
                        rn = -1;
                        hh = 0;
                        tex = "sprDesert01";
                        isPlateau = true;
                        if (Math.floor(this.noise.simplex3(zz * 1.1, xx, 0) * 10) >= 8) {
                            //add scroll on floor
                            socket.emit("spawnScroll", {
                                pos: {
                                    x: xx,
                                    y: ((rn + (hh * hh)) * this.desertParams.duneFactor) * 64,
                                    z: zz
                                }
                            });
                        }
                    }
                }

                
                //flatten terrain a bit in start area
                
                if (homeDist <= (16) * this.desertParams.gridSize) {
                    let fac = ((16 * this.desertParams.gridSize) / homeDist);
                    if (isPlateau === false) {
                        rn /= fac;
                        hh /= fac;
                        rn += (fac / this.desertParams.gridSize);
                    }
                }

                p.y = ((rn + (hh * hh)) * this.desertParams.duneFactor) * 64;
                d.collisionData[0].points[i].y = p.y;
            }
            d.quadData[0].setTexture(tex);
        }

        //adapt music tracks volume to ground type
        switch(ground){
            case "desert":
                if (this.musicVolume.beat < 1){
                    this.musicVolume.beat += 0.1;
                }
                if (this.musicVolume.plateau > 0) {
                    this.musicVolume.plateau -= 0.1;
                }
                //this.musBeat.volume = Math.max(0, Math.min(this.musBeat.volume, 1));
                //this.musPlateau.volume = Math.max(0, Math.min(this.musPlateau.volume, 1));
            break;
            case "oasis":
                if (this.musicVolume.beat > 0) {
                    this.musicVolume.beat -= 0.1;
                }
                if (this.musicVolume.plateau > 0) {
                    this.musicVolume.plateau -= 0.1;
                    //console.log(this.musPlateau.volume);
                }
                //this.musBeat.volume = Math.max(0, Math.min(this.musBeat.volume, 1));
                //this.musPlateau.volume = Math.max(0, Math.min(this.musPlateau.volume, 1));
            break;
            case  "plateau":
                if (this.musicVolume.plateau < 1) {
                    this.musicVolume.plateau += 0.1;
                }
                //this.musPlateau.volume = Math.max(0, Math.min(this.musPlateau.volume, 1));
            break;
            default:
            break;
        }
        //adapt music to other players
        let companion = false;
        for(let t of this.troglodytes){
            if (eud.distance([this.scene.player.pos.x, this.scene.player.pos.y, this.scene.player.pos.z], [t.pos.x, t.pos.y, t.pos.z]) < 512){
                companion = true;
            }
        }
        if(companion === true){
            if (this.musicVolume.flute < 1) {
                this.musicVolume.flute += 0.1;
            }
        }else{
            if (this.musicVolume.flute > 0) {
                this.musicVolume.flute -= 0.1;
            }
        }

        this.musBeat.volume = this.musicVolume.beat * OPTIONS.sfx;
        this.musFlute.volume = this.musicVolume.flute * OPTIONS.sfx;
        this.musPlateau.volume = this.musicVolume.plateau * OPTIONS.sfx;

        //story
        if(this.scene.player.travelLength >= this.travelled + 3000){
            this.travelled += 3000;
            this.storyteller.triggerNextStory();
        }
    }

    spawnFirstTrees(){
        let d = this.desert[this.desertMidTileNo - 1];
        let p = d.quadData[0].points[0];
        socket.emit("spawnTree", {
            pos: {
                x: d.pos.x + p.x,
                y: d.pos.y + p.y,
                z: d.pos.z + p.z
            }
        });
        d = this.desert[this.desertMidTileNo + 1];
        p = d.quadData[0].points[2];
        socket.emit("spawnTree", {
            pos: {
                x: d.pos.x + p.x,
                y: d.pos.y + p.y,
                z: d.pos.z + p.z
            }
        });
        d = this.desert[this.desertMidTileNo + 47];
        p = d.quadData[0].points[2];
        socket.emit("spawnTree", {
            pos: {
                x: d.pos.x + p.x,
                y: d.pos.y + p.y,
                z: d.pos.z + p.z
            }
        });
        d = this.desert[this.desertMidTileNo - 47];
        p = d.quadData[0].points[0];
        socket.emit("spawnTree", {
            pos: {
                x: d.pos.x + p.x,
                y: d.pos.y + p.y,
                z: d.pos.z + p.z
            }
        });
    }

    spawnTutStones(){
        for (let [i,p] of this.desert[this.desertMidTileNo].quadData[0].points.entries()){
            this.oasis.tutStones.push(this.scene.geometryController.loadModel("tutStone" + String(i), "modStoneStack", {
                x: p.x,
                y: p.y,
                z: p.z
            }));
            this.oasis.tutStones[i].quadData[0].setTexture("sprTutStone0"+String(i));
            this.oasis.tutStones[i].setDrawMode(DRAWMODE.BILLBOARD);
        }
    }

    calculateSun(_from, _dir) {
        let recZ = -9999;
        let sumZ = 0;

        let outsideScreenSafe = false;
        let cull = false;
        let ptsOoB = 0;

        let pts = {
            x: 0,
            y: -100,
            z: 1000
        }

        let nx = pts.x;
        let ny = pts.y;
        let nz = pts.z;
        let outXZ = rti.rotateY([0, 0, 0], [nx, ny, nz], [0, 0, 0], _dir.yaw);
        nx = outXZ[0];
        ny = outXZ[1];
        nz = outXZ[2];
        let outYZ = rti.rotateX([0, 0, 0], [nx, ny, nz], [0, 0, 0], _dir.pitch);
        nx = outYZ[0];
        ny = outYZ[1];
        nz = outYZ[2];
        let outXY = rti.rotateZ([0, 0, 0], [nx, ny, nz], [0, 0, 0], _dir.roll);
        nx = outXY[0];
        ny = outXY[1];
        nz = outXY[2];

        if (nz <= 10) {
            //cull = true;
            //ptsOoB += 1;
        }
        if (nz < 0) {
            nz *= 0.001;//original 0.001
        }
        nz *= this.scene.cam.fov;//original

        let nzMod = nz + this.scene.cam.zOffset;
        let zoom = this.scene.cam.zoom;
        //this.screenCoords[i].x = (nx / (Math.abs(Math.max(0.1, nzMod)) * 1)) * zoom;//ruckelig bc of abs
        //this.screenCoords[i].y = (ny / (Math.abs(Math.max(0.1, nzMod)) * 1)) * zoom;//ruckelig bc of abs
        this.sun.x = (nx / Math.max(0.1, nzMod) * 1) * zoom;
        this.sun.y = (ny / Math.max(0.1, nzMod) * 1) * zoom;

        if (nz > 0) {
            this.sun.alpha = 1;
        } else {
            this.sun.alpha = 0;
        }
    }

    calculateSunOld(_from, _dir) {
        let pts = {
            x: 0,
            y: -100,
            z: 1000
        }

        let nx = pts.x;
        let ny = pts.y;
        let nz = pts.z;
        let outXZ = rti.rotateY([0, 0, 0], [nx, ny, nz], [0, 0, 0], _dir.yaw);
        nx = outXZ[0];
        ny = outXZ[1];
        nz = outXZ[2];
        let outYZ = rti.rotateX([0, 0, 0], [nx, ny, nz], [0, 0, 0], _dir.pitch);
        nx = outYZ[0];
        ny = outYZ[1];
        nz = outYZ[2];
        let outXY = rti.rotateZ([0, 0, 0], [nx, ny, nz], [0, 0, 0], _dir.roll);
        nx = outXY[0];
        ny = outXY[1];
        nz = outXY[2];
        let nzMod = nz + 10;

        let zoom = 200;
        this.sun.x = (nx / (Math.abs(nzMod) * 1)) * zoom;
        this.sun.y = (ny / (Math.abs(nzMod) * 1)) * zoom;

        if(nz > 0){
            this.sun.alpha = 1;
        }else{
            this.sun.alpha = 0;
        }
    }

    destroy() {
        for(let t of this.troglodytes){
            t.destroy();
        }
        for (let t of this.trees) {
            t.destroy();
        }
        for (let s of this.scrolls) {
            s.destroy();
        }
        for (let s of this.stoneStacks) {
            s.destroy();
        }

        for(let t of this.oasis.tutStones){
            t.destroy();
        }

        for(let d of this.desert){
            d.destroy();
        }

        this.sun.destroy();
    }
}