export class Storyteller{
    constructor(_scene){
        this.scene = _scene;

        this.txt = this.scene.add.bitmapText(0, this.scene.top + 16, "whiteRabbit_16", "", 16, 1).setOrigin(0.5, 0);
        this.txt.depth = 9999;

        this.fade = 0;
        this.fader = setTimeout(() => { }, 10000);
        //setTimeout(()=>{}, 10000);
        //clearTimeout(this.fader);
        this.bit = 0;
        this.oase = [
            "I awakened next to a small pond,\nringed with strange trees.\nChepre wants something from me.\nChepre talks to me.",
            "Chepre wants to grow. Chepre needs space.",
            "You give to me, I give to you."
        ];

        this.advance = 0;
        this.story = [
            "I try and shake off my confusion...",
            "The vastness of this desert draws me in.",
            "Deeper and deeper,\nwhere my ancestors walked.",
            "Sometimes...\nI feel like I am being watched.",
            "Sometimes I watch symbols,\nfloating in the air.",
            "I can pick them up.",
            "I can use them to\nplace a stone.",
            "The thing guides the soul\non its path through the duat.",
            "The oasis speaks to me.",
            "It calls me back.",
            "Chepre wants me to\nto bring a symbol.",
            "The dunes speak to me.",
            "I dont know if I can trust anyone.",
            "There used to be an ocean here.",
            "Now no boat can plow through\nthe thick desert sand.",
            "I remember.",
            "When I was young, my parents\ngave me a boat.",
            "It was made out of folded paper.",
            "Proudly I set sails in a puddle.",
            "We lived in a small hut\nnext to a river.",
            "A short distance from home\nthere was a small island in the river.",
            "It was densly overgrown\nbut I spotted something.",
            "There was a tower on the island.",
            "I knew I had to get there.",
            "One day I would take my paper boat\nand cross this river.",
            "But however much I tried\nI couldnt reach the island.",
            "It was as if there was a current\nkeeping me from getting there.",
            "My boat was soaked.\nBut with my last remaining strength\nI made it to shore.",
            "Too late I noticed\nI was at the wrong one.",
            "How could I return to my family?",
            "How could I return to my friends?",
            "With no boat left\nI saw no other possibility than\nto go on and leave my family behind.",
            "I ventured out,\ndeeper into the desert.",
            "I dont know, for how long it didnt rain.",
            "I was thirsty.",
            "On my 20th day I saw them.",
            "They stared at me from afar.",
            "They kept their distance to me.",
            "Only when I looked behind me\nI saw them standing on another dune.",
            "I didnt feel threatened.",
            "Strangely enough,\nI felt welcomed.",
            "Sometimes, at night,\nI could hear their distant chatter.",
            "Like whistling, their words\ncrossed over the desert.",
            "The next day i woke up,\nI saw some footprints around\nthe spot where I slept.",
            "I wandered for how many years?",
            "Is this oasis the only source of water?",
            "Strangely I am not thirsty.",
            "I look at my feet.",
            "The sand is coarse,\nbut it doesn´t hurt.",
            "My feet are weirdly shaped,\nmuch akin to a goat",
            "I am one of them.",
            "A warden of the oasis, a Troglodyte.",
            "When I awoke,\nI fled from the strangest dream.",
            "It was the year 1736.\nWe worked hard to eradicate the temple.",
            "Stone after stone,\nwe took it down",
            "There were people who hated us\nfor bringing it down.",
            "The temple did no good.",
            "It let people blame all\nproblems on the gods.",
            "When in reality they were their owns.",
            "No one wanted to accept\nthe fate of this world.",
            "No one wanted to change\nthe fate of this world.",
            "The ones who did, got thrown down\nfrom the top of the temple.",
            "Their family was publically shamed\nand they got cast out\ninto the desert.",
            "As one particular family searched\nfor water, I awoke from my dream.",
            "My face must have been hitting\nthe water in my sleep.",
            "I dont know when Ive\nslept that long before.",
            "There are so many trees to plant.",
            "Chepre wants this oasis to grow.",
            "I dont know what I want.",
            "I wanted to do so much more...",
            "Ludum Dare 48\nDeeper and deeper",
            "a game by Sebastian Merkl\n@ancientpixel.bsky.social",
            "thank you for playing",
            "stay as long as you want",
            "feel free to search for other players",
            "show them the ways around the dunes",
        ]

        //this.setText("Deeper and deeper...");
        this.triggerNextBit();
    }

    update(){
        if(this.fade > 0){
            this.txt.alpha = this.fade/60;
            this.fade -= 1;
        }
    }

    setText(_txt){
        this.txt.setText(_txt);
        this.txt.alpha = 1;
        clearTimeout(this.fader);
        this.fader = setTimeout(() => {this.fade = 60}, 10000);
    }

    triggerNextBit(){
        if(this.bit < this.oase.length){
            this.setText(this.oase[this.bit]);
            this.bit += 1;
        }
    }

    triggerNextStory() {
        if (this.advance < this.story.length) {
            this.setText(this.story[this.advance]);
            this.advance += 1;
        }
    }
}