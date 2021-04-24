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
            gridSize: 64
        }
        this.desert = [];
        for(let yy = -32 ; yy < 32 ; yy++){
            for (let xx = -32; xx < 32; xx++){
                if(Phaser.Math.Distance.Between(0, 0, xx, yy) < 24){
                    this.desert.push(this.scene.geometryController.loadModel("desertTile", "modDesertTile", {
                        x: xx * this.desertParams.gridSize,
                        y: 0,
                        z: yy * this.desertParams.gridSize
                    }));
                }
            }
        }

        this.calculateDesert();

        this.sun = this.scene.add.sprite(0, 0, "sprSun00");
        this.sun.depth = -10000;

        this.troglodytes = [];
        this.stoneStacks = [];
    }

    update(){
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

        this.calculateSun({x: 0, y: 0, z: 0}, this.scene.player.dir);
    }

    addStoneStack(_data){
        this.stoneStacks.push(this.scene.geometryController.loadModel("stoneStack_" + String(this.stoneStacks.length), "modStoneStack", {
                x: _data.pos.x,
                y: _data.pos.y,
                z: _data.pos.z
            })
        );
        this.stoneStacks[this.stoneStacks.length - 1].setDrawMode(DRAWMODE.BILLBOARD);
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
        /*this.troglodytes[this.troglodytes.length - 1].interactable = true;
        this.troglodytes[this.troglodytes.length - 1].interact = () => {
            //this.scene.player.setMode(PLAYERMODE.INTERACT);
            //this.scene.player.panel = new Panel(this.scene);
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
        for (let d of this.desert) {
            let tex = "sprDesert00";
            let xx, yy, zz, rn, hh = 0;
            for (let [i,p] of d.quadData[0].points.entries()) {
                xx = p.x + d.pos.x
                yy = 0 + d.pos.y
                zz = p.z + d.pos.z
                
                rn = this.noise.simplex3(xx * this.desertParams.resolution.x, yy * this.desertParams.resolution.y, zz * this.desertParams.resolution.z);
                hh = this.noise.simplex3(xx * 0.001, yy * 0.001, zz * 0.001);

                //rare spikes
                if (this.noise.simplex3(xx * 0.1, yy * 0.1, zz * 0.1) > 0.95){
                    rn = -5;
                    hh = 0;
                    tex = "sprDesert01";
                }

                //rare plateus
                if (this.noise.simplex3(xx * 0.0005, yy * 0.0005, zz * 0.0005) > 0.6) {
                    rn = -1;
                    hh = 0;
                    tex = "sprDesert01";
                }

                p.y = ((rn + (hh * hh)) * this.desertParams.duneFactor) * 64;
                d.collisionData[0].points[i].y = p.y;
            }
            d.quadData[0].setTexture(tex);
        }
    }

    calculateSun(_from, _dir) {
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

        let zoom = 400;
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

        for(let d of this.desert){
            d.destroy();
        }

        this.sun.destroy();
    }
}