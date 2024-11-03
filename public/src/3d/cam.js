export default class Cam{
    constructor(_scene){
        this.scene = _scene;
        this.pos = {
            x: 0,
            y: -24,
            z: 0
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
        this.zoom = 800;    //original: 800
        this.zOffset = 15;  //original: 15
        this.fov = 2.5;     //original: 2.5
    }

    update(){

    }

    setPositionAndRotation(_pos, _dir){
         this.pos.x = _pos.x;
         this.pos.y = _pos.y;
         this.pos.z = _pos.z;
         this.dir.yaw = _dir.yaw;
         this.dir.pitch = _dir.pitch;
         this.dir.roll = _dir.roll;
    }
}