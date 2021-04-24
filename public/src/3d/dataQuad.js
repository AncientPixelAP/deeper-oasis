export default class DataQuad{
    constructor(_scene, _modelId, _runNo, _type, _pos, _points, _texture, _frame){
        this.scene = _scene;
        this.modelId = _modelId;
        this.runNo = _runNo;
        this.type = _type;
        this.pos = _pos;
        this.d2dPos = {
            x: 0,
            y: 0,
            z: 0
        }
        this.points = _points; //array of 4 xyz coords
        this.texture = _texture;
        this.frame = _frame;
        this.quads = [];// to be filled by a phaser quad if it should be rendered
        this.mipmapped = false;
        this.depth = 0;
        this.shade = 0;
        this.scale = {
            x: 1,
            y: 1,
        }
        this.zDepth = 0;

        this.screenCoords = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ];

        //additional helperScreencoords
        this.sc01 = {
            x: 0,
            y: 0
        }
        this.sc03 = {
            x: 0,
            y: 0
        }
        this.sc12 = {
            x: 0,
            y: 0
        }
        this.sc32 = {
            x: 0,
            y: 0
        }
        this.scM = {
            x: 0,
            y: 0
        }
    }

    update(){

    }

    draw(){
        if(this.quads.length > 0){
            if(this.mipmapped === false){
                this.quads[0].setTopLeft(this.screenCoords[0].x, this.screenCoords[0].y);
                this.quads[0].setTopRight(this.screenCoords[1].x, this.screenCoords[1].y);
                this.quads[0].setBottomRight(this.screenCoords[2].x, this.screenCoords[2].y);
                this.quads[0].setBottomLeft(this.screenCoords[3].x, this.screenCoords[3].y);
                this.quads[0].depth = this.depth;
                /*let c = Phaser.Display.Color.GetColor(this.shade, this.shade, this.shade);
                this.quads[0].topLeftColor = c;
                this.quads[0].topRightColor = c;
                this.quads[0].bottomLeftColor = c;
                this.quads[0].bottomRightColor = c;*/
            }else{
                this.quads[0].setTopLeft(this.screenCoords[0].x, this.screenCoords[0].y);
                this.quads[0].setTopRight(this.sc01.x, this.sc01.y);
                this.quads[0].setBottomRight(this.scM.x, this.scM.y);
                this.quads[0].setBottomLeft(this.sc03.x, this.sc03.y);
                this.quads[0].depth = this.depth;

                this.quads[1].setTopLeft(this.sc01.x, this.sc01.y);
                this.quads[1].setTopRight(this.screenCoords[1].x, this.screenCoords[1].y);
                this.quads[1].setBottomRight(this.sc12.x, this.sc12.y);
                this.quads[1].setBottomLeft(this.scM.x, this.scM.y);
                this.quads[1].depth = this.depth;

                this.quads[2].setTopLeft(this.scM.x, this.scM.y);
                this.quads[2].setTopRight(this.sc12.x, this.sc12.y);
                this.quads[2].setBottomRight(this.screenCoords[2].x, this.screenCoords[2].y);
                this.quads[2].setBottomLeft(this.sc32.x, this.sc32.y);
                this.quads[2].depth = this.depth;

                this.quads[3].setTopLeft(this.sc03.x, this.sc03.y);
                this.quads[3].setTopRight(this.scM.x, this.scM.y);
                this.quads[3].setBottomRight(this.sc32.x, this.sc32.y);
                this.quads[3].setBottomLeft(this.screenCoords[3].x, this.screenCoords[3].y);
                this.quads[3].depth = this.depth;
            }

            
            let col = Phaser.Display.Color.GetColor(this.shade, this.shade, this.shade);
            for(let q of this.quads){
                //shading
                q.topLeftColor = col;
                q.topRightColor = col;
                q.bottomLeftColor = col;
                q.bottomRightColor = col;
            }
            
        }
    }

    drawNo3d(_from, _dir, _withScale){
        if (this.quads.length > 0) {
            //this.calculateHelpPoints();
            //this.quads[0].x = this.scM.x;
            //this.quads[0].y = this.scM.y;

            //calculate the billboard position of a quad seen from the camera
            let pt = {
                x: this.d2dPos.x + this.pos.x - _from.x,
                y: this.d2dPos.y + this.pos.y - _from.y,
                z: this.d2dPos.z + this.pos.z - _from.z
            }
            let outXZ = rti.rotateY([0, 0, 0], [pt.x, pt.y, pt.z], [0, 0, 0], _dir.yaw);
            let nx = outXZ[0];
            let ny = outXZ[1];
            let nz = outXZ[2];
            let outYZ = rti.rotateX([0, 0, 0], [nx, ny, nz], [0, 0, 0], _dir.pitch);
            nx = outYZ[0];
            ny = outYZ[1];
            nz = outYZ[2];

            let nzMod = nz + 10;
            let zoom = 400;
            this.quads[0].x = (nx / (Math.abs(nzMod) * 1)) * zoom;
            this.quads[0].y = (ny / (Math.abs(nzMod) * 1)) * zoom;

            if(_withScale === true){
                //this.quads[0].setScale(this.zDepth);
                this.quads[0].setScale(256/nz);
            }
            this.quads[0].depth = nz;
        }
    }

    calculate3d(_from, _dir, _mipmap = true) {
        let recZ = -9999;
        let sumZ = 0;

        let outsideScreenSafe = false;

        //calculate the quads point in 3d seen from the camera
        for(let [i, p] of this.points.entries()){
            let pts = {
                x: p.x + this.pos.x - _from.x,
                y: p.y + this.pos.y - _from.y,
                z: p.z + this.pos.z - _from.z
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

            let zoom = 400;//2.5 - 0.01
            this.screenCoords[i].x = (nx / (Math.abs(nzMod) * 1)) * zoom;
            this.screenCoords[i].y = (ny / (Math.abs(nzMod) * 1)) * zoom;
            
            if (outsideScreenSafe === false) {
                outsideScreenSafe = this.screenCoords[i].x <= this.scene.left || this.screenCoords[i].x >= this.scene.right || this.screenCoords[i].y <= this.scene.top || this.screenCoords[i].y >= this.scene.bottom;
            }

            this.zDepth = (1 / Math.abs(nzMod)) * zoom;

            //ortho rendering
            /*this.screenCoords[i].x = nx;
            this.screenCoords[i].y = ny;*/

            //clamp screenCoords
            //this.screenCoords[i].x = Math.max(-this.scene.game.config.width * 20, Math.min(this.scene.game.config.width * 20, this.screenCoords[i].x));
            //this.screenCoords[i].y = Math.max(-this.scene.game.config.height * 20, Math.min(this.scene.game.config.height * 20, this.screenCoords[i].y));)

            if (nz > recZ) {
                recZ = nz;
            }
            sumZ += nz;
        }
        this.depth = sumZ * -0.25;
        //this.depth = recZ*-1;
        this.shade = Math.max(0, 255 - ((recZ + 0) * 0.25));

        if(this.type !== "collisionQuad"){
            if(this.depth >= 0){//near clipping plane could be at -25 for example
                if (this.quads.length > 0) {
                    this.clearQuads();
                }
            }else if(this.depth < 0){
                if (this.quads.length === 0) {
                    this.createQuad();
                }
                //quad so near that mipmapping is required?
                //if (this.depth > -50){
                if(outsideScreenSafe === true){
                    if (_mipmap === true && this.quads.length > 0){
                        this.mipmapQuad();
                    }
                }else{
                    if(this.quads.length > 0){
                        this.unmipmapQuad();
                    }
                }
            }

            if (this.quads.length > null) {
                if (this.depth < -12) {// (recZ > 16) at sumZ * -0.25
                    for(let q of this.quads){
                        q.alphas = [1, 1, 1, 1, 1, 1];
                    }
                } else {
                    for (let q of this.quads) {
                        q.alphas = [0, 0, 0, 0, 0, 0];
                    }
                }
            }
        }
    }

    getIntersect(_x, _y, _z, _toX, _toY, _toZ) {
        // probe first tri of quad
        let tri = [
            [this.points[0].x + this.pos.x, this.points[0].y + this.pos.y, this.points[0].z + this.pos.z], 
            [this.points[1].x + this.pos.x, this.points[1].y + this.pos.y, this.points[1].z + this.pos.z], 
            [this.points[2].x + this.pos.x, this.points[2].y + this.pos.y, this.points[2].z + this.pos.z],
        ];
        let pt = [_x, _y, _z];
        let dir = [_toX, _toY, _toZ];
        let odir = [_toX * -1, _toY * -1, _toZ * -1];
        let hit = rti.intersect([], pt, dir, tri);
        let ohit = rti.intersect([], pt, odir, tri);
        if (hit === null && ohit === null) {
            // probe 2nd tri part of quad
            tri = [
                [this.points[0].x + this.pos.x, this.points[0].y + this.pos.y, this.points[0].z + this.pos.z],
                [this.points[2].x + this.pos.x, this.points[2].y + this.pos.y, this.points[2].z + this.pos.z],
                [this.points[3].x + this.pos.x, this.points[3].y + this.pos.y, this.points[3].z + this.pos.z],
            ];
            hit = rti.intersect([], pt, dir, tri);
            ohit = rti.intersect([], pt, odir, tri);
        }
        if (hit !== null) {
            return hit;
        }
        if (ohit !== null) {//TODO actually never happens bc the first hit covers infinite length in both ways
            return ohit;
        }
        return null;
    }

    clearQuads(){
        this.mipmapped = false;
        for(let i = this.quads.length-1 ; i >= 0 ; i--){
            this.quads[i].destroy();
        }
        this.quads = [];
    }

    createQuad(){
        this.quads.push(this.scene.add.quad(0, 0, this.texture));
        //console.log(this.quads[0].uv);
    }

    mipmapQuad(){
        this.calculateHelpPoints();

        if(this.mipmapped === false){
            this.mipmapped = true;

            this.quads.push(this.scene.add.quad(0, 0, this.texture));
            this.quads.push(this.scene.add.quad(0, 0, this.texture));
            this.quads.push(this.scene.add.quad(0, 0, this.texture));

            this.quads[0].uv = [0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0.5, 0.5, 0.5, 0];
            this.quads[1].uv = [0.5, 0, 0.5, 0.5, 1, 0.5, 0.5, 0, 1, 0.5, 1, 0];
            this.quads[2].uv = [0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5];
            this.quads[3].uv = [0, 0.5, 0, 1, 0.5, 1, 0, 0.5, 0.5, 1, 0.5, 0.5];
        }
    }

    unmipmapQuad(){
        if(this.mipmapped === true){
            this.mipmapped = false;

            this.clearQuads();
            this.createQuad();

            this.quads[0].uv = [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0];
        }
    }

    calculateHelpPoints(){
        this.sc01.x = (this.screenCoords[0].x + this.screenCoords[1].x) * 0.5;
        this.sc01.y = (this.screenCoords[0].y + this.screenCoords[1].y) * 0.5;
        this.sc03.x = (this.screenCoords[0].x + this.screenCoords[3].x) * 0.5;
        this.sc03.y = (this.screenCoords[0].y + this.screenCoords[3].y) * 0.5;
        this.sc12.x = (this.screenCoords[1].x + this.screenCoords[2].x) * 0.5;
        this.sc12.y = (this.screenCoords[1].y + this.screenCoords[2].y) * 0.5;
        this.sc32.x = (this.screenCoords[3].x + this.screenCoords[2].x) * 0.5;
        this.sc32.y = (this.screenCoords[3].y + this.screenCoords[2].y) * 0.5;
        this.scM.x = (this.sc03.x + this.sc12.x) * 0.5;
        this.scM.y = (this.sc03.y + this.sc12.y) * 0.5;
    }

    recalculatePosition(){
        /*
        //TODO rework this - this doesnt calculate the mdipoint of the quad
        this.pos = {
            x: (this.points[0].x + this.points[1].x + this.points[2].x + this.points[3].x) / 4,
            y: (this.points[0].y + this.points[1].y + this.points[2].y + this.points[3].y) / 4,
            z: (this.points[0].z + this.points[1].z + this.points[2].z + this.points[3].z) / 4
        };*/
    }

    cyclePoints(_cw){
        if(_cw === true){
            let help = {
                x: this.points[0].x,
                y: this.points[0].y,
                z: this.points[0].z
            }
            for(let i = 0 ; i < 3 ; i++){
                this.points[i].x = this.points[i + 1].x;
                this.points[i].y = this.points[i + 1].y;
                this.points[i].z = this.points[i + 1].z;
            }
            this.points[3].x = help.x;
            this.points[3].y = help.y;
            this.points[3].z = help.z;
        }else{
            let help = {
                x: this.points[3].x,
                y: this.points[3].y,
                z: this.points[3].z
            }
            for (let i = 3; i > 0; i--) {
                this.points[i].x = this.points[i - 1].x;
                this.points[i].y = this.points[i - 1].y;
                this.points[i].z = this.points[i - 1].z;
            }
            this.points[0].x = help.x;
            this.points[0].y = help.y;
            this.points[0].z = help.z;
        }
    }

    setTexture(_tex){
        this.texture = _tex;
        for(let q of this.quads){
            q.setTexture(this.texture, this.frame);
        }
    }

    destroy(){
        this.clearQuads();
    }
}