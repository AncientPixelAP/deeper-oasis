export default function() {

    // Preloader scene
    return new Phaser.Class({
        Extends: Phaser.Scene,
        initialize: function Preloader() {
            Phaser.Scene.call(this, { key: "Preloader" })
        },

        preload: function() {
            this.load.plugin("rexperlinplugin", "./lib/rexperlinplugin.min.js", true);

            this.load.bitmapFont("pixelmix", "./assets/fonts/pixelmix.png", "./assets/fonts/pixelmix.xml");
            this.load.bitmapFont("whiteRabbit_16", "./assets/fonts/phoeniz_16.png", "./assets/fonts/whiteRabbit_16.xml");

            this.load.image("sprPixelMan", "./assets/sprites/splashscreen/sprPixelMan.png");
            this.load.spritesheet("sprPixelTurn", "./assets/sprites/splashscreen/sprPixelTurn.png", {frameWidth: 32, frameHeight: 32});
        },

        create: function() {
            this.cameras.main.setBackgroundColor(0x000000);
            this.load.off("progress", this.update_progress_display, this);

            this.cache.bitmapFont.get("whiteRabbit_16").data.lineHeight = 20;
            this.cache.bitmapFont.get("pixelmix").data.lineHeight = 40;
            this.scene.start("ScnLoad");
        }
    })

}