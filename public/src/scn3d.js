import Hand from "./hand.js";
import Cam from "./3d/cam.js";
import GeometryController from "./3d/geometryController.js";
import Editor from "./3d/editor.js";
import { Player3d } from "./3d/player.js";
import LevelDesert00 from "./3d/levels/lvlDesert00.js";

export default class Scn3d extends Phaser.Scene {

    constructor() {
        super("Scn3d");
    }

    create() {
        console.log(this);
        this.cameras.main.setScroll(-this.game.config.width * 0.5, -this.game.config.height * 0.5);
        this.cameras.main.setBackgroundColor(0xb2e2ff);

        this.cameras.main.fadeFrom(500, 0, 0, 0, false, (_cam, _pct) => {

        }, this);

        this.left = this.game.config.width * -0.5;
        this.right = this.game.config.width * 0.5;
        this.top = this.game.config.height * -0.5;
        this.bottom = this.game.config.height * 0.5;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            q: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            g: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
            n: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N),
            m: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
            t: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T),
            c: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
            v: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
            z: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            ctrl: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL),
            shift: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
            alt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT),
            end: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.END),
            del: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE),
            one: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
            two: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
            three: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
            four: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
            five: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
            six: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
            seven: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN),
            eight: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT),
            nine: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE),
            zero: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO),
            tab: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB),
            enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
            escape: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE),
            backspace: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE),
        }
        this.numkeys = {
            plus: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD),
            minus: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT),
            one: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE),
            two: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO),
            three: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE),
            four: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR),
            five: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE),
            six: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX),
            seven: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN),
            eight: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT),
            nine: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE),
            zero: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
        }

        this.hand = new Hand(this);
        this.hand.setMouseLock(true);

        this.player = new Player3d(this);
        let a = Math.random() * (Math.PI * 2);
        this.player.pos.x = Math.sin(a) * 32;
        this.player.pos.y = -32;
        this.player.pos.z = Math.cos(a) * 32;

        this.editor = new Editor(this);

        this.cam = new Cam(this);
        this.geometryController = new GeometryController(this);

        this.level = null;
        this.loadLevel("desert");

        this.modelName = "";
        //this.debugTxt = this.add.bitmapText((this.game.config.width * -0.5) + 16, (this.game.config.height * -0.5) + 16, "whiteRabbit_16", "TEST Test test 00 gbqrSX5s", 16, 1).setOrigin(0).setLetterSpacing(1);
    
        //socket stuff!!
        //console.log(socket);
        this.you = null;
        this.playersData = null;
        this.objectsData = null;
        this.otherPlayers = [];

        socket.on("pongTest", (_data) => {
            pongTest
            console.log(_data);
        });

        socket.on("spawnStoneStack", (_data) => {
            this.level.addStoneStack(_data, true);
        });
        socket.on("removeStoneStack", (_data) => {
            this.level.removeStoneStack(_data.id);
        });

        socket.on("spawnTree", (_data) => {
            this.level.addTree(_data, true);
        });
        socket.on("removeTree", (_data) => {
            this.level.removeTree(_data.id);
        });

        socket.on("spawnScroll", (_data) => {
            if(_data.taken === false){
                this.level.addScroll(_data, true);
            }
        });
        socket.on("removeScroll", (_data) => {
            this.level.removeScroll(_data.id);
        });

        socket.on("giveSeed", (_data) => {
            this.player.setHeldItem("sprSeed00", {
                text: "",
                itemType: "seed",
                hintPic: "sprSeedSymbol00"
            })
        });

        socket.on("getPlayers", (_data) => {
            console.log(_data);
            this.you = _data.you;
            this.playersData = _data.playersData;
            this.objectsData = _data.objectsData;
            for(let s of this.objectsData.stoneStacks){
                this.level.addStoneStack(s, false);
            }
            for (let t of this.objectsData.trees) {
                this.level.addTree(t, false);
            }
            for (let s of this.objectsData.scrolls) {
                this.level.addScroll(s, false);
            }
            this.synchronize();
        });

        socket.on("synchUpdate", (_data) => {
            //console.log(_data);
            this.playersData = _data.playersData;
            this.level.oasis.radius = _data.oasisData.radius;
            if(this.level.oasis.nextLetter !== _data.oasisData.nextLetter){
                this.level.oasis.nextLetter = _data.oasisData.nextLetter;
                this.level.oasis.nextLetterModel.quadData[0].setTexture("sprLetter" + String(this.level.oasis.nextLetter));
            }

            this.synchronize();
        });

        socket.on("kickPlayer", (_data) => {
            for (let i = this.otherPlayers.length - 1; i >= 0; i--) {
                if (this.otherPlayers[i].id === _data.id) {
                    this.level.removeOtherPlayer(this.otherPlayers[i].id);
                    this.otherPlayers.splice(i, 1);
                }
            }
        });

        socket.emit("joinPlayer", {
            pos: {
                x: this.player.pos.x,
                y: this.player.pos.y,
                z: this.player.pos.z
            },
            dir: {
                pitch: this.player.dir.pitch,
                yaw: this.player.dir.yaw,
                roll: this.player.dir.roll
            }
        });

        /*this.numkeys.plus.on("up", (_key, _event) => {
            this.level.storyteller.triggerNextStory();
        }, this);*/
    }

    update(){
        this.fillInputs();
        this.hand.update();
        /*
        this.btnBack.update();
        */

        if(this.editor.enabled === true){
            this.editorControls();
            this.editor.update();
        }else{

            if(this.player.mode === PLAYERMODE.LOOK){

                this.gameControls();

                //look for models to interact with at center of screen if player click the mouse
                let hits = [];
                //hits = this.geometryController.getQuadsFromScreenspaceAt(this.input.activePointer.worldX, this.input.activePointer.worldY, false);
                hits = this.geometryController.getQuadsFromScreenspaceAt(0, 0, false);
                if (hits.length > 0) {
                    hits = hits.sort((a, b) => a.depth - b.depth);
                    this.modelName = hits[hits.length - 1].modelId;
                    //this.debugTxt.setText(this.modelName);

                    let model = this.geometryController.getModelById(this.modelName = hits[hits.length - 1].modelId);
                    if (model.interactable === true){
                        if (eud.distance([this.player.pos.x, this.player.pos.y, this.player.pos.z], [model.pos.x, model.pos.y, model.pos.z]) < 48){
                            //this.player.setHintText(model.data.text !== undefined ? model.data.text : "bla");
                            if(model.data.hintPic !== undefined){
                                this.player.setHintPic(model.data.hintPic, 1);
                            }else{
                                this.player.setHintPic("sprDebugTexture", 0);
                            }
                            //this.player.setUseBox(model.getScreenBounds());

                            if (this.hand.justReleased || INPUTS.btnA.justReleased) {
                                model.interact();
                            }
                        }else{
                            this.player.setHintPic("sprDebugTexture", 0);
                        }
                    }else{
                        this.player.setHintPic("sprDebugTexture", 0);
                        this.player.setHintText("");
                        //this.player.clearUseBox();
                    }
                }

                if (this.hand.justReleased) {
                    if(this.input.mouse.locked === false){
                        this.hand.setMouseLock(true);
                    }
                    //log the playre  position as a helper for manual object positioning in level files
                    /*if(this.keys.q.isDown){
                        console.log(this.player.pos);
                    }*/
                }
            }

        }

        this.cam.setPositionAndRotation({ x: this.player.pos.x, y: this.player.pos.y - this.player.eyeHeight, z: this.player.pos.z}, this.player.dir);

        this.player.update();
        this.level.update();

        this.geometryController.draw(this.cam.pos, this.cam.dir);

        for(let op of this.otherPlayers){
            op.model.quadData[0].depth += 1;
        }

        this.hand.lateUpdate();

        if (this.playersData !== null) {
            socket.emit("updatePlayer", {
                id: this.you.id,
                pos: this.player.pos,
                dir: this.player.dir,
                asset: this.player.asset,
                heldItemData: this.player.heldItemData
            });
        }
    }

    editorControls(){
        if(this.hand.justReleased){
            let hits = [];
            hits = this.geometryController.getQuadsFromScreenspaceAt(this.input.activePointer.worldX, this.input.activePointer.worldY, this.editor.editCollisions);
            if(hits.length > 0){
                hits = hits.sort((a, b) => a.depth - b.depth);
                this.editor.quad = hits[hits.length-1];

                this.editor.model = this.geometryController.getModelById(this.editor.quad.modelId);
                //console.log(this.editor.model);
            }
        }

        //camera controls
        this.keyboardLook();

        if (this.keys.a.isDown) {
            this.player.pos.z -= Math.cos(this.player.dir.yaw - HALFPI) * 2;//all move was spd 1
            this.player.pos.x += Math.sin(this.player.dir.yaw - HALFPI) * 2;
        }
        if (this.keys.d.isDown) {
            this.player.pos.z -= Math.cos(this.player.dir.yaw + HALFPI) * 2;
            this.player.pos.x += Math.sin(this.player.dir.yaw + HALFPI) * 2;
        }
        if (this.keys.s.isDown) {
            this.player.pos.z -= Math.cos(this.player.dir.yaw) * 3;
            this.player.pos.x += Math.sin(this.player.dir.yaw) * 3;
        }
        if (this.keys.w.isDown) {
            this.player.pos.z += Math.cos(this.player.dir.yaw) * 3;
            this.player.pos.x -= Math.sin(this.player.dir.yaw) * 3;
        }

        if (this.keys.space.isDown) {
            this.player.pos.y -= 1;
        }
        if (this.keys.c.isDown) {
            this.player.pos.y += 1;
        }
    }

    gameControls(){
        let isMoving = false;

        this.keyboardLook();
        if(this.player.mode === PLAYERMODE.LOOK){
            if(this.hand.mouselock === false){
                this.hand.setMouseLock(true);
            }
            this.mouseLook();
        }

        this.player.dir.pitch = Math.max(-HALFPI, Math.min(HALFPI ,this.player.dir.pitch));

        let toPos = {
            x: this.player.pos.x,
            y: this.player.pos.y,
            z: this.player.pos.z
        }

        if (Math.abs(INPUTS.stickLeft.horizontal) > 0.1) {
            toPos.z -= (Math.cos(this.player.dir.yaw + HALFPI) * INPUTS.stickLeft.horizontal) * this.player.spd.normal;
            toPos.x += (Math.sin(this.player.dir.yaw + HALFPI) * INPUTS.stickLeft.horizontal) * this.player.spd.normal;
            isMoving = true;
        }
        if (Math.abs(INPUTS.stickLeft.vertical) > 0.1) {
            toPos.z -= (Math.cos(this.player.dir.yaw) * INPUTS.stickLeft.vertical) * (INPUTS.btnTriggerLeft.pressed ? this.player.spd.sprint : this.player.spd.normal);
            toPos.x += (Math.sin(this.player.dir.yaw) * INPUTS.stickLeft.vertical) * (INPUTS.btnTriggerLeft.pressed ? this.player.spd.sprint : this.player.spd.normal);
            isMoving = true;
        }

        if(isMoving === true){
            this.player.asset = "sprTroglodyte00";
        }else{
            this.player.asset = "sprTroglodyte01";
        }
        if (Math.abs(this.player.vel.y) > 1) {
        //if (this.player.gravity.grounded === false){
            this.player.asset = "sprTroglodyte02";
        }

        //JUMP
        if (INPUTS.btnShoulderRight.pressed) {
            //this.player.pos.y -= 1;
            if (this.player.vel.y === 0){
                this.player.vel.y = -2;
                this.player.pos.y += this.player.vel.y;
            }
        }
        if (INPUTS.btnShoulderLeft.pressed) {
            //this.player.pos.y += 1;
        }

        if(INPUTS.btnB.justReleased === true){
            this.level.tryRemoveStoneStack({
                x: this.player.pos.x + Math.sin(this.player.dir.yaw) * -16,
                y: this.player.pos.y + this.player.eyeHeight,
                z: this.player.pos.z - Math.cos(this.player.dir.yaw) * -16
            });
        }

        let returnColl = [];
        let checkColl = [
            {//check ground at player position
                pos: {
                    x: this.player.pos.x,
                    y: this.player.pos.y + this.player.eyeHeight,
                    z: this.player.pos.z
                },
                dir: {
                    x: 0,
                    y: 1,
                    z: 0
                },
                hit: []
            }, {//check wall colllision global x axis
                pos: {
                    x: toPos.x,
                    y: toPos.y - this.player.stepHeight,
                    z: toPos.z
                },
                dir: {
                    x: 1,
                    y: 0,
                    z: 0
                },
                hit: []
            }, {//check wall colllision global z axis
                pos: {
                    x: toPos.x,
                    y: toPos.y - this.player.stepHeight,
                    z: toPos.z
                },
                dir: {
                    x: 0,
                    y: 0,
                    z: 1
                },
                hit: []
            }
        ]

        //try to find stoeckchen position
        if (INPUTS.btnA.justReleased || this.input.mouse.locked === true ? this.hand.justReleased : false) {
            //if (this.player.heldItemData.itemType === "letter" || this.player.heldItemData.itemType === "seed"){
                checkColl.push({
                    pos: {
                        x: this.player.pos.x + Math.sin(this.player.dir.yaw) * -16,
                        y: this.player.pos.y + this.player.eyeHeight,
                        z: this.player.pos.z - Math.cos(this.player.dir.yaw) * -16
                    },
                    dir: {
                        x: 0,
                        y: 1,
                        z: 0
                    },
                    hit: []
                });
            //}
        }

        returnColl = this.geometryController.update(checkColl);
        
        //really place stoeckchen now
        if (INPUTS.btnA.justReleased || this.input.mouse.locked === true ? this.hand.justReleased : false) {
            if (this.player.heldItemData.itemType === "letter") {
                //commit letter to server if right
                if (Phaser.Math.Distance.Between(0, 0, this.player.pos.x, this.player.pos.z) < 64) {
                    if (this.player.heldItemData.letter === this.level.oasis.nextLetter) {
                        socket.emit("commitLetter", {});
                        this.level.sndDudel.play();
                        this.level.storyteller.triggerNextBit();
                    }else{
                        this.level.sndPing.play();
                    }
                } else {
                    //place a orientational stone stack
                    if (returnColl[3].hit.length > 0) {
                        socket.emit("spawnStoneStack", {
                            pos: {
                                x: returnColl[3].hit[0].pt[0],
                                y: returnColl[3].hit[0].pt[1],
                                z: returnColl[3].hit[0].pt[2]
                            }
                        });
                    }
                    this.player.setHeldItem("sprNothing", { itemType:"none", text: "", hintPic: "sprNothing"});
                    //this.level.sndPing.play();
                }
            } else if (this.player.heldItemData.itemType === "seed"){
                //planting a seed on near player position
                //todo check if tree is near an eligable position
                if (returnColl[3].hit.length > 0) {
                    socket.emit("spawnTree", {
                        pos: {
                            x: returnColl[3].hit[0].pt[0],
                            y: returnColl[3].hit[0].pt[1],
                            z: returnColl[3].hit[0].pt[2]
                        }
                    });
                }
                this.player.setHeldItem("sprNothing", { itemType: "none", text: "", hintPic: "sprNothing" });
                //this.level.sndThump.play();
            }
        }

        //resolve collision with ground
        if (returnColl[0].hit.length > 0) {
            //filter relevant = nearest hit
            let dist = 9999;
            let nearestHit = returnColl[0].hit[0];
            for (let [i, n] of returnColl[0].hit.entries()) {
                let d = Phaser.Math.Distance.Between(0, this.player.pos.y - this.player.stepHeight, 0, returnColl[0].hit[i].pt[1]);
                if (d < dist) {
                    dist = d;
                    nearestHit = returnColl[0].hit[i];
                }
            }
            //returnColl[input point and direction].hit[nearest = 0].pt[coord x,y,z]
            //teleport to ground
            if(nearestHit.model.trigger.isTrigger === false){
                if(dist <= this.player.stepHeight){
                    this.player.vel.y = 0;
                    this.player.pos.y = nearestHit.pt[1];
                    this.player.gravity.grounded = true;
                    //this.player.asset = "sprTroglodyte00";
                }else{
                    if (this.player.vel.y < this.player.gravity.terminal) {
                        this.player.vel.y += this.player.gravity.y;
                    }
                    this.player.pos.y += this.player.vel.y;
                    this.player.gravity.grounded = false;
                    //this.player.asset = "sprTroglodyte02";
                }
            }else{
                nearestHit.model.updateTrigger();
            }
        }

        //resolve hit in global x axis
        if(returnColl[1].hit.length > 0){
            //filter relevant = nearest hit
            let dist = 9999;
            let nearestHit = returnColl[1].hit[0];
            for(let [i, n] of returnColl[1].hit.entries()){
                let d = Phaser.Math.Distance.Between(this.player.pos.x, this.player.pos.z, returnColl[1].hit[i].pt[0], returnColl[1].hit[i].pt[2]);
                if(d < dist){
                    dist = d;
                    nearestHit = returnColl[1].hit[i];
                }
            }
            if(dist < this.player.collisionRadius){
                //only move if you move away from the wall
                if ((toPos.x < this.player.pos.x && this.player.pos.x < nearestHit.pt[0]) || (toPos.x > this.player.pos.x && this.player.pos.x > nearestHit.pt[0]) || nearestHit.model.trigger.isTrigger === true){
                    this.player.pos.x = toPos.x;
                    if (nearestHit.model.trigger.isTrigger === true){
                        nearestHit.model.updateTrigger();
                    }
                }
            }else{
                //be free to move cause yoou are far away from wall
                this.player.pos.x = toPos.x;
            }
        }else{
            //move because there is nothing out there
            this.player.pos.x = toPos.x;
        }

        if (returnColl[2].hit.length > 0) {
            //filter relevant = nearest hit
            let dist = 9999;
            let nearestHit = returnColl[2].hit[0];
            for (let [i, n] of returnColl[2].hit.entries()) {
                let d = Phaser.Math.Distance.Between(this.player.pos.x, this.player.pos.z, returnColl[2].hit[i].pt[0], returnColl[2].hit[i].pt[2]);
                if (d < dist) {
                    dist = d;
                    nearestHit = returnColl[2].hit[i];
                }
            }
            if (dist < this.player.collisionRadius) {
                //only move if you move away from the wall
                if ((toPos.z < this.player.pos.z && this.player.pos.z < nearestHit.pt[2]) || (toPos.z > this.player.pos.z && this.player.pos.z > nearestHit.pt[2]) || nearestHit.model.trigger.isTrigger === true) {
                    this.player.pos.z = toPos.z;
                    if (nearestHit.model.trigger.isTrigger === true) {
                        nearestHit.model.updateTrigger();
                    }
                }
            }else{
                //be free to move cause yoou are far away from wall
                this.player.pos.z = toPos.z;
            }
        }else{
            //move because there is nothing out there
            this.player.pos.z = toPos.z;
        }
    }

    keyboardLook(){
        if (this.cursors.up.isDown) {
            this.player.dir.pitch += this.player.dir.spd.pitch;
        }
        if (this.cursors.down.isDown) {
            this.player.dir.pitch -= this.player.dir.spd.pitch;
        }
        if (this.cursors.right.isDown) {
            if(this.keys.q.isDown){
                this.player.dir.roll -= this.player.dir.spd.roll;
            }else{
                this.player.dir.yaw -= this.player.dir.spd.yaw;
            }
        }
        if (this.cursors.left.isDown) {
            if (this.keys.q.isDown) {
                this.player.dir.roll += this.player.dir.spd.roll;
            } else {
                this.player.dir.yaw += this.player.dir.spd.yaw;
            }
        }
    }

    mouseLook(){
        if(this.hand.vel.x !== 0){
            //this.player.dir.yaw = prevCamDir.yaw;
            this.player.dir.yaw -= ((this.hand.vel.x * 0.4) * this.player.dir.spd.yaw);
        }
        if(this.hand.vel.y !== 0){
            //this.player.dir.pitch = prevCamDir.pitch;
            this.player.dir.pitch += ((this.hand.vel.y * 0.4) * this.player.dir.spd.pitch);
        }
    }

    loadLevel(_name){
        this.unloadLevel();
        switch(_name){
            case "modelBuilder":
                this.level = new LevelModelbuilder(this);
            break;
            case "desert":
                this.level = new LevelDesert00(this);
            break;
            default:
            break;
        }
    }

    unloadLevel(){
        if(this.level !== null){
            this.geometryController.destroyModels();
            this.level.destroy();
            this.level = null;
        }
    }

    gotoMenu(){
        socket.emit("leavePlayer", {
            id: this.you.id
        });

        socket.off("pongTest");
        socket.off("getPlayers");
        socket.off("synchUpdate");
        socket.off("kickPlayer");
        socket.off("spawnTree");
        socket.off("removeTree");
        socket.off("spawnStoneStack");
        socket.off("removeStoneStack");
        socket.off("spawnScroll");
        socket.off("removeScroll");
        socket.off("giveSeed");

        this.scene.start("ScnMain");
    }

    synchronize(){
        for(let d of this.playersData){
            if(d.id !== this.you.id){
                let found = false;
                for(let op of this.otherPlayers){
                    if(op.id === d.id){
                        found = true;
                        op.data = d.data;
                        op.model.jumpToPosition(d.data.pos);
                        op.model.quadData[0].setTexture(d.data.asset);
                        op.model.data = {
                            text: d.data.heldItemData.text,
                            itemType: d.data.heldItemData.itemType,
                            hintPic: d.data.heldItemData.hintPic
                        }
                    }
                }

                // create new other player instance
                if(found === false){
                    this.otherPlayers.push({
                        id: d.id,
                        data: d.data,
                        model: this.level.addOtherPlayer(d.id, d.data)
                    });
                }
            }
        }
    }

    fillInputs(){
        let gamepad = null;
        gamepad = navigator.getGamepads()[Math.max(0, gamepadsConnected - 1)];
        if(gamepad === undefined){
            gamepad = null;
        }

        //FORWARDS-BACKWARDDS
        INPUTS.stickLeft.vertical = 0;
        INPUTS.stickLeft.horizontal = 0;
        if (this.keys.w.isDown) {// || this.hand.pressed === true) {
            INPUTS.stickLeft.vertical = -1;
        } else if (this.keys.s.isDown) {
            INPUTS.stickLeft.vertical = 1;
        } else {
            if (gamepad !== null) {
                INPUTS.stickLeft.vertical = gamepad.axes[1];
            }
        }
        //STRAFE
        if (this.keys.a.isDown) {
            INPUTS.stickLeft.horizontal = -1;
        } else if (this.keys.d.isDown) {
            INPUTS.stickLeft.horizontal = 1;
        } else {
            if (gamepad !== null) {
                INPUTS.stickLeft.horizontal = gamepad.axes[0];
            }
        }
        //LOOK UP-DOWN
        INPUTS.stickRight.vertical = 0;
        INPUTS.stickRight.horizontal = 0;
        if (this.cursors.up.isDown) {
            INPUTS.stickRight.vertical = -1;
        } else if (this.cursors.down.isDown) {
            INPUTS.stickRight.vertical = 1;
        } else {
            if (gamepad !== null) {
                INPUTS.stickRight.vertical = gamepad.axes[3];
            }
        }
        //LOOK LEFT-RIGHT
        if (this.cursors.left.isDown) {
            INPUTS.stickRight.horizontal = -1;
        } else if (this.cursors.right.isDown) {
            INPUTS.stickRight.horizontal = 1;
        } else {
            if (gamepad !== null) {
                INPUTS.stickRight.horizontal = gamepad.axes[2];
            }
        }
        //CROUCH
        if (this.keys.tab.isDown || (gamepad !== null ? gamepad.buttons[4].pressed : false)) {
            if (INPUTS.btnShoulderLeft.pressed === false) {
                INPUTS.btnShoulderLeft.justPressed = true;
                INPUTS.btnShoulderLeft.pressed = true;
                INPUTS.btnShoulderLeft.justReleased = false;
            } else {
                INPUTS.btnShoulderLeft.justPressed = false;
            }
        } else {
            if (INPUTS.btnShoulderLeft.pressed === true) {
                INPUTS.btnShoulderLeft.pressed = false;
                INPUTS.btnShoulderLeft.justReleased = true;
                INPUTS.btnShoulderLeft.justPressed = false;
            } else {
                INPUTS.btnShoulderLeft.justReleased = false;
            }
        }
        //JUMP
        if (this.keys.space.isDown || (gamepad !== null ? gamepad.buttons[5].pressed : false)) {
            if (INPUTS.btnShoulderRight.pressed === false) {
                INPUTS.btnShoulderRight.justPressed = true;
                INPUTS.btnShoulderRight.pressed = true;
                INPUTS.btnShoulderRight.justReleased = false;
            } else {
                INPUTS.btnShoulderRight.justPressed = false;
            }
        } else {
            if (INPUTS.btnShoulderRight.pressed === true) {
                INPUTS.btnShoulderRight.pressed = false;
                INPUTS.btnShoulderRight.justReleased = true;
                INPUTS.btnShoulderRight.justPressed = false;
            } else {
                INPUTS.btnShoulderRight.justReleased = false;
            }
        }
        //SPRINT
        if (this.keys.shift.isDown || (gamepad !== null ? gamepad.buttons[6].pressed : false)) {
            if (INPUTS.btnTriggerLeft.pressed === false) {
                INPUTS.btnTriggerLeft.justPressed = true;
                INPUTS.btnTriggerLeft.pressed = true;
                INPUTS.btnTriggerLeft.justReleased = false;
            } else {
                INPUTS.btnTriggerLeft.justPressed = false;
            }
        } else {
            if (INPUTS.btnTriggerLeft.pressed === true) {
                INPUTS.btnTriggerLeft.pressed = false;
                INPUTS.btnTriggerLeft.justReleased = true;
                INPUTS.btnTriggerLeft.justPressed = false;
            } else {
                INPUTS.btnTriggerLeft.justReleased = false;
            }
        }
        //A
        if (this.keys.enter.isDown || (gamepad !== null ? gamepad.buttons[0].pressed : false)) {
            if (INPUTS.btnA.pressed === false) {
                INPUTS.btnA.justPressed = true;
                INPUTS.btnA.pressed = true;
                INPUTS.btnA.justReleased = false;
            } else {
                INPUTS.btnA.justPressed = false;
            }
        } else {
            if (INPUTS.btnA.pressed === true) {
                INPUTS.btnA.pressed = false;
                INPUTS.btnA.justReleased = true;
                INPUTS.btnA.justPressed = false;
            } else {
                INPUTS.btnA.justReleased = false;
            }
        }
        //B
        if (this.keys.backspace.isDown || (gamepad !== null ? gamepad.buttons[1].pressed : false)) {
            if (INPUTS.btnB.pressed === false) {
                INPUTS.btnB.justPressed = true;
                INPUTS.btnB.pressed = true;
                INPUTS.btnB.justReleased = false;
            } else {
                INPUTS.btnB.justPressed = false;
            }
        } else {
            if (INPUTS.btnB.pressed === true) {
                INPUTS.btnB.pressed = false;
                INPUTS.btnB.justReleased = true;
                INPUTS.btnB.justPressed = false;
            } else {
                INPUTS.btnB.justReleased = false;
            }
        }
    }

}
