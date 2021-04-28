import Button from "./button.js";
import Hand from "./hand.js";


export default class ScnMain extends Phaser.Scene {

    constructor() {
        super("ScnMain");
    }

    init(_data) {
        
    }

    create() {
        //console.log(this);
        this.cameras.main.setScroll(-this.game.config.width * 0.5, -this.game.config.height * 0.5);
        this.cameras.main.setBackgroundColor(0x000000);

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
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            end: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.END),
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
            plus: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD),
            minus: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBSTRACT),
        }
        
        this.hand = new Hand(this);

        /*this.keys.q.on("down", (_key, _event) => {
            _event.stopPropagation();
            console.log(navigator.getGamepads()[Math.max(0, gamepadsConnected - 1)]);
        }, this);*/

        /*this.noise = this.plugins.get("rexperlinplugin").add(0);
        //random noise value
        let x,y,z = 0;
        let rn = this.noise.simplex3(x, y ,z);*/

        this.btnTxt = this.add.bitmapText(0, -64, "whiteRabbit_16", "", 16, 1).setOrigin(0.5, 0);

        this.loadTxt = this.add.bitmapText(0, this.bottom - 16, "whiteRabbit_16", "a ld48 game by\nSebastian Merkl\ntwitter: @AncientPixel_AP", 16, 1).setOrigin(0.5, 1);

        /*this.tests = [];
        for(let i = 0 ; i < 100 ; i++){
            rn = this.noise.simplex3(i, 0, 0);
            this.tests.push(this.add.sprite(i*32, rn * 32, "sprDesert00"));
        }*/

        this.btnPlay = new Button(this, { x: -36, y: 0 }, "sprLetter0", "", false, () => {
            this.startGame();
        });
        this.btnPlay.sprite.setScale(4);

        this.btnSound = new Button(this, { x: 36, y: 0 }, "sprLetter9", "", true, () => {
            //this.toggleSound();
            OPTIONS.sfx = 0;
            this.musFlute.volume = 0;
            this.btnSound.sprite.setTexture("sprLetter6");
        });
        this.btnSound.toggleOffFunc = () => {
            OPTIONS.sfx = 1;
            this.musFlute.volume = 1;
            this.btnSound.sprite.setTexture("sprLetter9");
            this.sndTest.play();
        }
        this.btnSound.sprite.setScale(4);



        this.btnFullscreen = new Button(this, { x: this.right - 32, y: this.bottom - 32 }, "sprFullscreen", "", false, () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });


        this.sndTest = this.sound.add("sndThump", { volume: 1 });
        this.musFlute = this.sound.add("musFlute", { volume: 1, loop: true });
        this.musFlute.play();
    }

    update(_time, _delta){
        /*this.delta.current += _delta;
        while (this.delta.current >= this.delta.treshold){
            this.delta.current -= this.delta.treshold;
        }*/
        this.hand.update();
        this.btnPlay.update();
        this.btnSound.update();
        this.btnFullscreen.update();

        if (this.btnPlay.state === this.btnPlay.states.over){
            this.btnTxt.setText("Start");
        } else if (this.btnSound.state === this.btnSound.states.over || this.btnSound.state === this.btnSound.states.on) {
            this.btnTxt.setText("Sound " + (OPTIONS.sfx === 1 ? "enabled" : "disabled"));
        }else{
            this.btnTxt.setText("");
        }

        this.hand.lateUpdate();
    }

    startGame(){
        this.musFlute.stop();
        this.sndTest.stop();

        this.scene.start("Scn3d");
    }

    toggleSound(){
        if(OPTIONS.sfx === 0){
            OPTIONS.sfx = 1;
            this.btnSound.sprite.setTexture("sprLetter9");
            this.sndTest.play();
        }else{
            OPTIONS.sfx = 0;
            this.btnSound.sprite.setTexture("sprLetter6");
        }
    }
}