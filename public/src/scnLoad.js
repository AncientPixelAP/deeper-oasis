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

        //editor debug
        this.load.image("sprDebugTexture", "sprites/sprDebugTexture.png");
        this.load.image("sprDebugQuadPoint0", "sprites/sprDebugQuadPoint0.png");
        this.load.image("sprDebugQuadPoint1", "sprites/sprDebugQuadPoint1.png");
        this.load.image("sprDebugQuadPoint2", "sprites/sprDebugQuadPoint2.png");
        this.load.image("sprDebugQuadPoint3", "sprites/sprDebugQuadPoint3.png");
        this.load.image("sprDebugQuadPoint4", "sprites/sprDebugQuadPoint4.png");

        this.load.image("sprHelpSheet", "sprites/sprHelpSheet.png");

        this.load.image("sprHandsHolditem", "sprites/sprHandsHolditem.png");
        this.load.image("sprHelp", "sprites/sprHelpSmall.png");
        this.load.image("sprFullscreen", "sprites/sprFullscreenSmall.png");

        this.load.image("sprDesert00", "sprites/sprDesert00.png");
        this.load.image("sprDesert01", "sprites/sprDesert01.png");
        this.load.image("sprWater00", "sprites/sprWater00.png");
        this.load.image("sprOasis00", "sprites/sprOasis00.png");

        this.load.image("sprMarble00", "sprites/sprMarble00.png");

        this.load.image("sprSun00", "sprites/sprSun00.png");

        this.load.image("sprTroglodyte00", "sprites/sprTroglodyte00.png");
        this.load.image("sprTroglodyte01", "sprites/sprTroglodyte01.png");
        this.load.image("sprTroglodyte02", "sprites/sprTroglodyte02.png");

        this.load.image("sprStoneStack00", "sprites/sprStoneStack00.png");
        this.load.image("sprScroll", "sprites/sprScroll.png");

        this.load.image("sprNothing", "sprites/sprNothing.png");

        this.load.image("sprSeed00", "sprites/sprSeed00.png");
        this.load.image("sprSeedSymbol00", "sprites/sprSeedSymbol00.png");

        this.load.image("sprLetter0", "sprites/sprLetterAleph.png");
        this.load.image("sprLetter1", "sprites/sprLetterBeth.png");
        this.load.image("sprLetter2", "sprites/sprLetterGimmel.png");
        this.load.image("sprLetter3", "sprites/sprLetterDaleth.png");
        this.load.image("sprLetter4", "sprites/sprLetterHe.png");
        this.load.image("sprLetter5", "sprites/sprLetterWaw.png");
        this.load.image("sprLetter6", "sprites/sprLetterTeth.png");
        this.load.image("sprLetter7", "sprites/sprLetterSamekh.png");
        this.load.image("sprLetter8", "sprites/sprLetterPe.png");
        this.load.image("sprLetter9", "sprites/sprLetterQoph.png");

        this.load.image("sprTree00", "sprites/sprTree00_00.png");
        this.load.image("sprTree01", "sprites/sprTree00_01.png");
        this.load.image("sprTree02", "sprites/sprTree01_00.png");
        this.load.image("sprTree03", "sprites/sprTree01_01.png");

        this.load.json("modDesertTile", "json/models/desertTile.json");
        this.load.json("modOtherPlayer", "json/models/otherPlayer.json");
        this.load.json("modStoneStack", "json/models/stoneStack.json");
        this.load.json("modTree", "json/models/tree.json");
        this.load.json("modNextLetter", "json/models/nextLetter.json");
        this.load.json("modScroll", "json/models/scrollPoint.json");


        this.load.audio("sndPlayerStep", "audio/oasisDesertStep01.mp3");

        this.load.audio("sndDrone", "audio/oasisDrone01.mp3");
        this.load.audio("sndThump", "audio/oasisThump01.mp3");
        this.load.audio("sndDudel", "audio/oasisDudel01.mp3");
        this.load.audio("sndPing", "audio/oasisPing01.mp3");

        this.load.audio("musBeat", "audio/oasisMusicBeat00.mp3");
        this.load.audio("musFlute", "audio/oasisMusicFlute00.mp3");
        this.load.audio("musPlateau", "audio/oasisMusicPlateau00.mp3");



        this.loadTxt = this.add.bitmapText(0, (this.game.config.height * 0.5) - 32, "whiteRabbit_16", "LOADING: 0%", 16, 1).setOrigin(0.5);
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
        //this.cache.bitmapFont.get("whiteRabbit_16").data.lineHeight = 20;
        //this.cache.bitmapFont.get("pixelmix").data.lineHeight = 40;
    }

    update(){
        if (this.logoDidRepeat >= 2) {
            this.scene.start("ScnMain");//Scn3d
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
