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
        this.collisionRadius = 16;
        this.spd = {
            normal: 1,
            sprint: 4
        }

        this.gravity = {
            x: 0,
            y: 0.1,
            z: 0,
            grounded: false,
            terminal: 4
        }

        this.mode = PLAYERMODE.LOOK;

        this.reticle = this.scene.add.sprite(0, 0, "sprUiCrosshairDot");
        this.reticle.depth = 9999;
        this.reticle.alpha = 0;
        this.lowerHint = this.scene.add.bitmapText(0, (this.scene.game.config.height * 0.4), "whiteRabbit_16", "click to use/talk", 16, 1).setOrigin(0.5).setLetterSpacing(1);
        this.lowerHint.depth = 9999;
        this.useBox = this.scene.add.graphics({x: 0, y: 0.5});
        this.useBox.depth = 9999;
        this.useBoxAnim = 0;

        this.panel = null;
        this.conversation = null;
    }

    update(){
        if(this.pos.to.jump === true){
            this.pos.x = this.pos.to.x;
            this.pos.y = this.pos.to.y;
            this.pos.z = this.pos.to.z;
            this.pos.to.jump = false;
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

    setHintText(_text){
        this.lowerHint.setText(_text);
    }

    setUseBox(_rect){
        this.useBox.clear();
        let th = 6;

        //draw faint scanlines
        this.useBox.lineStyle(3, 0x00e436, 0.25);
        this.useBox.beginPath();
        for(let y = _rect.p0.y ; y < _rect.p1.y ; y++){
            if ((Math.floor(this.scene.game.config.height + y)) % th === Math.floor(this.useBoxAnim)){
                this.useBox.moveTo(_rect.p0.x, y);
                this.useBox.lineTo(_rect.p1.x, y);
            }
        }
        this.useBox.strokePath();

        //draw box outline
        this.useBox.lineStyle(1, 0x00e436, 1);
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