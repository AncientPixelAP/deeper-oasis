export default class ScnLoad extends Phaser.Scene {

    constructor() {
        super("ScnLoad");
        this.loadTxt = null;
    }

    preload(){
        this.cameras.main.setBackgroundColor(0x000000);
        this.cameras.main.setScroll(-this.game.config.width * 0.5, -this.game.config.height * 0.5);

        

        this.load.setBaseURL("./assets/");
        //this.load.image('image0', '0.png');
        //this.load.json("story1", "storyjson/story1.json");
        //this.load.text("locDE", "languageData/deutsch.txt");
        //this.load.audio('decisionLeft', 'audio/decision.wav');
        //this.load.atlas("tilesGrass", "sprites/tiles/grassDirt.png", "sprites/tiles/tilesGround_atlas.json");

        this.load.image("sprDesert00", "sprites/sprDesert00.png");
        this.load.image("sprDesert01", "sprites/sprDesert01.png");
        this.load.image("sprSun00", "sprites/sprSun00.png");
        this.load.image("sprTroglodyte00", "sprites/sprTroglodyte00.png");
        this.load.image("sprStoneStack00", "sprites/sprStoneStack00.png");

        this.load.json("modDesertTile", "json/models/desertTile.json");
        this.load.json("modOtherPlayer", "json/models/otherplayer.json");
        this.load.json("modStoneStack", "json/models/stoneStack.json");



        this.loadTxt = this.add.bitmapText(0, (this.game.config.height * 0.5) - 32, "whiteRabbit_16", "LOADING: 0%", 8, 1).setOrigin(0.5);
        this.ancient = this.add.sprite(0, 0, "sprPixelMan").setScale(2);
        this.pixel = this.add.sprite(0, -48, "sprPixelTurn").setScale(2);

        let turnAnim = this.anims.create({
            key: "turning",
            frames: this.anims.generateFrameNumbers("sprPixelTurn"),
            frameRate: 32,
            repeat: -1
        });
        this.pixel.play("turning");
        this.logoDidRepeat = 0;
        this.pixel.on('animationrepeat', function () {
            this.logoDidRepeat += 1;
        }, this);

        this.load.on('progress', this.updateProgressDisplay, this);
    }

    create(){
        this.load.off("progress", this.updateProgressDisplay, this);
        this.cache.bitmapFont.get("whiteRabbit_16").data.lineHeight = 16;
        this.cache.bitmapFont.get("pixelmix").data.lineHeight = 40;
    }

    update(){
        if (this.logoDidRepeat >= 2) {
            this.scene.start("Scn3d");
        }
    }

    updateProgressDisplay(_pct) {
        let txt = "LOADING: " + String(Math.floor(_pct * 100)) + "%\n";
        if(_pct === 1){
            txt += "decoding audio";
        }
        this.loadTxt.setText(txt);
    }
}
