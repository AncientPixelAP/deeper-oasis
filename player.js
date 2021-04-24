class Player {
    constructor(_id, _data) {
        this.id = _id;
        this.pos = {
            x: 0,
            y: 0,
            z: 0
        }

        this.data = _data;
    }
}
module.exports = Player;