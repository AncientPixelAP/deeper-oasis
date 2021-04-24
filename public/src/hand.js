export default class Hand{
    constructor(_scene){
        this.scene = _scene;

        this.justPressed = false;
        this.pressed = false;
        this.justReleased = false;

        this.mouselock = false;

        this.pos = {
            x: 0,
            y: 0
        }

        this.start = {
            x: 0,
            y: 0
        }

        this.vel = {
            x: 0,
            y: 0
        }
        this.prev = {
            x: 0,
            y: 0
        }

        this.scene.input.activePointer.smoothFactor = 0.2;
    }

    update(){
        this.pos.x = this.scene.input.activePointer.worldX;
        this.pos.y = this.scene.input.activePointer.worldY;

        if (this.scene.input.mouse.locked === true) {
            if (this.scene.input.activePointer.moveTime+60 >= this.scene.data.systems.time.now) {
                this.vel.x = Math.max(-10, Math.min(10, this.scene.input.activePointer.movementX));
                this.vel.y = Math.max(-10, Math.min(10, this.scene.input.activePointer.movementY));
            }else{
                if (gamepadsConnected > 0) {
                    this.vel.x = Math.abs(INPUTS.stickRight.horizontal) > 0.1 ? INPUTS.stickRight.horizontal : 0;
                    this.vel.y = Math.abs(INPUTS.stickRight.vertical) > 0.1 ? INPUTS.stickRight.vertical : 0;
                }
            }
        }

        if (this.scene.input.activePointer.isDown || INPUTS.btnA.pressed){
            if(this.pressed === false){
                this.justPressed = true;
                this.pressed = true;
                this.justReleased = false;
                //console.log("mouse just pressed")

                this.start.x = this.pos.x;
                this.start.y = this.pos.y;
            }else{
                this.justPressed = false;
                //console.log("mouse pressed")
            }
        }else{
            if(this.pressed === true){
                this.pressed = false;
                this.justReleased = true;
                this.justPressed = false;

                //console.log("mouse released")

                this.start.x = this.pos.x;
                this.start.y = this.pos.y;
            }else{
                this.justReleased = false;
            }
        }
    }

    lateUpdate(){
        this.vel.x = 0;
        this.vel.y = 0;
        this.prev.x = this.scene.input.activePointer.worldX;
        this.prev.y = this.scene.input.activePointer.worldY;
    }

    setMouseLock(_bool){
        this.mouselock = _bool;
        if(this.mouselock === true){
            this.scene.input.mouse.requestPointerLock();
        }else{
            if (this.scene.input.mouse.locked){
                this.scene.input.mouse.releasePointerLock();
            }
        }
    }
}