import Button from "../button.js";

export class Player3d{
    constructor(_scene) {
        this.scene = _scene;
        this.pos = {
            x: 0,
            y: 0,
            z: 0,
            to: {
                jump: false,
                x: 0,
                y: 0,
                z: 0,
            },
            last: {
                x: 0,
                y: 0,
                z: 0
            }
        }
        this.dir = {
            yaw: 0,
            pitch: 0,
            roll: 0,
            spd: {
                yaw: 0.04,
                pitch: 0.04,
                roll: 0.04
            }
        }
        this.vel = {
            x: 0,
            y: 0,
            z: 0
        }
        this.eyeHeight = 24;
        this.stepHeight = 9;
        this.collisionRadius = 15;
        this.spd = {
            normal: 2,
            sprint: 3
        }

        this.gravity = {
            x: 0,
            y: 0.1,
            z: 0,
            grounded: false,
            terminal: 4
        }

        this.mode = PLAYERMODE.LOOK;
        this.asset = "sprTroglodyte00";

        this.reticle = this.scene.add.sprite(0, 0, "sprNothing");
        this.reticle.depth = 9999;
        this.reticle.alpha = 0;
        this.lowerHint = this.scene.add.bitmapText(0, (this.scene.game.config.height * 0.4), "whiteRabbit_16", "interact", 16, 1).setOrigin(0.5).setLetterSpacing(1);
        this.lowerHint.depth = 9999;
        this.useBox = this.scene.add.graphics({x: 0, y: 0.5});
        this.useBox.depth = 9999;
        this.useBoxAnim = 0;

        this.lowerHintPic = this.scene.add.sprite(0, 0, "sprNothing");
        this.lowerHintPic.depth = 9999;
        this.lowerHintPic.alpha = 0;
        this.lowerHintPic.setScale(3,3);

        this.heldItem = this.scene.add.sprite(0, this.scene.bottom - 64, "sprNothing");
        this.heldItem.depth = 9999;
        this.heldItem.alpha = 0;
        this.heldItemData = {
            text: "",
            itemType: "none",
            hintPic: "sprNothing"
        };

        this.hands = this.scene.add.sprite(-8, this.scene.bottom, "sprHandsHolditem");
        this.hands.depth = 9990;
        this.hands.alpha = 0;

        this.panel = null;
        this.conversation = null;
        this.travelLength = 0;

        this.btnFullscreen = new Button(this.scene, { x: this.scene.right - 32, y: this.scene.bottom - 32 }, "sprFullscreen", "", false, () => {
            if (this.scene.scale.isFullscreen) {
                this.scene.scale.stopFullscreen();
            } else {
                this.scene.scale.startFullscreen();
            }
        });

        /*this.btnHelp = new Button(this.scene, { x: this.scene.left + 32, y: this.scene.top + 64 }, "sprHelp", "", false, () => {
            
        });*/

        this.sndStep = this.scene.sound.add("sndPlayerStep", { volume: OPTIONS.sfx });
    }

    update(){
        this.btnFullscreen.update();
        //this.btnHelp.update();

        if(this.pos.to.jump === true){
            this.pos.x = this.pos.to.x;
            this.pos.y = this.pos.to.y;
            this.pos.z = this.pos.to.z;
            this.pos.to.jump = false;
        }

        if (eud.distance([this.pos.x, this.pos.y, this.pos.z], [this.pos.last.x, this.pos.last.y, this.pos.last.z]) > 48){
            this.travelLength += 48;
            this.pos.last.x = this.pos.x;
            this.pos.last.y = this.pos.y;
            this.pos.last.z = this.pos.z;
            //if (this.gravity.grounded === true){
            if(Math.abs(this.vel.y) < 1){
                this.sndStep.volume = (0.5 + (Math.random() * 0.5)) * OPTIONS.sfx;
                this.sndStep.play();
            }
        }

        if(this.panel !== null){
            this.panel.update();
        }

        if (this.conversation !== null) {
            this.conversation.update();
        }
    }

    jumpToPosition(_pos){
        //use this to set a neew position even if the collision checks have moved the position around differently
        //eg if a collision in x resolves in a trigger jumping the player, but collision resolve in z afterwards would reset that
        this.pos.to.jump = true;
        this.pos.to.x = _pos.x;
        this.pos.to.y = _pos.y;
        this.pos.to.z = _pos.z;
    }

    setMode(_mode){
        this.mode = _mode;
        switch(_mode){
            case PLAYERMODE.LOOK:

            break;
            case PLAYERMODE.INTERACT:
                this.scene.hand.setMouseLock(false);
            break;
            default:
            break;
        }
    }

    setHeldItem(_texture, _data){
        this.heldItem.setTexture(_texture);
        this.heldItem.alpha = 1;
        this.heldItemData = _data;

        this.hands.setTexture("sprHandsHolditem");
        this.hands.alpha = 1;
        this.hands.setOrigin(0.5, 1);
        this.hands.x = -8;
        this.hands.y = this.scene.bottom;

        if (_data.itemType === "none"){
            this.hands.y = this.scene.height;
        }
    }

    useHeldItem(){

    }

    placeHeldItem(){
        switch (this.heldItemData.itemType) {
            case "letter":
                socket.emit("spawnScroll", {
                    pos: {
                        x: this.pos.x,
                        y: this.pos.y,
                        z: this.pos.z
                    }
                });
                break;
            default:
                break;
        }
    }

    setHintText(_text){
        this.lowerHint.setText(_text);
    }

    setHintPic(_texture, _alpha) {
        this.lowerHintPic.setTexture(_texture);
        this.lowerHintPic.alpha = _alpha;
    }

    setUseBox(_rect){
        this.useBox.clear();
        let th = 6;

        //draw faint scanlines
        this.useBox.lineStyle(3, 0xfff1e8, 0.25);
        /*this.useBox.beginPath();
        for(let y = _rect.p0.y ; y < _rect.p1.y ; y++){
            if ((Math.floor(this.scene.game.config.height + y)) % th === Math.floor(this.useBoxAnim)){
                this.useBox.moveTo(_rect.p0.x, y);
                this.useBox.lineTo(_rect.p1.x, y);
            }
        }
        this.useBox.strokePath();*/

        //draw box outline
        this.useBox.lineStyle(3, 0xfff1e8, 1);
        this.useBox.beginPath();
        this.useBox.moveTo(_rect.p0.x, _rect.p0.y);
        this.useBox.lineTo(_rect.p1.x, _rect.p0.y);
        this.useBox.moveTo(_rect.p1.x, _rect.p0.y);
        this.useBox.lineTo(_rect.p1.x, _rect.p1.y);
        this.useBox.moveTo(_rect.p1.x, _rect.p1.y);
        this.useBox.lineTo(_rect.p0.x, _rect.p1.y);
        this.useBox.moveTo(_rect.p0.x, _rect.p1.y);
        this.useBox.lineTo(_rect.p0.x, _rect.p0.y);
        this.useBox.strokePath();

        //advance useBoxAnim to let the scanlines roll
        this.useBoxAnim += 0.5;
        if(this.useBoxAnim >= th){
            this.useBoxAnim = 0;
        }
    }

    clearUseBox(){
        this.useBox.clear();
    }
}