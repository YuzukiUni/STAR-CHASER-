class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

   
    preload() {
        // load images/tile sprites
        this.load.image('heart', './assets/Heart.png');
        this.load.image('stars', './assets/Star.png');
        this.load.image('bigstar', './assets/BigStar.png');
        this.load.image('starfield', './assets/StarChaser.png');
        this.load.audio('BGM', './assets/BGM.mp3');
        this.load.spritesheet('explosion', './assets/gg.png', {frameWidth:120, frameHeight:86, startFrame: 0, endFrame: 10});
    }

    create() {
        //add bgm
        this.bgm = this.sound.add('BGM', {
            mute:false,
            volume:0.4,
            rate:1,
            loop:true
        });
        this.bgm.play();
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0,1280, 720, 'starfield').setOrigin(0, 0);
        this.Hato =  new Heart(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'heart').setOrigin(0, 0);
        this.star1 = new Star(this, game.config.width + borderUISize*2, borderUISize*2, 'stars', 0, 30).setOrigin(0, 0);
        this.star2 = new Star(this, game.config.width + borderUISize*3, borderUISize*3 + borderPadding*2, 'stars', 0, 20).setOrigin(0,0);
        this.star3 = new Star(this, game.config.width, borderUISize*4 + borderPadding*4, 'bigstar', 0, 10).setOrigin(0,0);
        this.star4 = new Star(this, game.config.width, +borderUISize*6 + borderPadding*5, 'bigstar', 0, 5).setOrigin(0,0);
        


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //Mouse Control
        //reference:https://phaser.discourse.group/t/move-by-mouse/5564, https://www.youtube.com/watch?v=teZavPHW4uQ, and https://phaser.io/examples/v3/view/input/mouse/right-mouse-button
        //locked the fire object by mouse control
		this.input.on('pointerdown', function(pointer){

            this.input.mouse.requestPointerLock();

            if (!this.Hato.isFiring && !this.gameOver && pointer.leftButtonDown()) {

                this.Hato.type = 0;
                this.Hato.isFiring = true;

                this.Hato.sfxRocket.play();

            } 
            else if (!this.Hato.isFiring && !this.gameOver && pointer.rightButtonDown() && this.Hato.rtypeNumber > 0) {

                this.Hato.isFiring = true;
                this.Hato.type = 1;
                this.Hato.setFlipY(true); 
                this.Hato.rtypeNumber--;
                this.Hato.sfxRocket.play();
            }

        }, this);
        //moving the cursors
        this.input.on('pointermove', function (pointer) {

                if (!this.Hato.isFiring && !this.gameOver && this.input.mouse.locked) {

                    this.Hato.x += pointer.movementX;
                    this.Hato.x = Phaser.Math.Wrap(this.Hato.x, 0, game.renderer.width);
                }
            

        }, this);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 10, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score, setting up background message
        let scoreConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '30px',
            color: '#EEF7F3E6',
            align: 'right',
            padding: {
                top: 5,
                bottom: 100,
            },
            fixedWidth: 200
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding, this.p1Score, scoreConfig);

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GG!, You Get '+this.p1Score+' Star Points !', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press R to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

         update() {
             //check game is continue to play
             if(!this.gameOver) {
                this.Hato.update();             
                this.star1.update();          
                this.star2.update();
                this.star3.update();
                this.star4.update();
            }
        //pause bgm when game ends
        if(this.gameOver){
            this.bgm.pause();
        }
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        //if restart, replay BGM
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
			this.bgm.pause();
            this.scene.restart();
        }


        // check collisions
       if(this.checkCollision(this.Hato, this.star4)) {
			this.Hato.reset();
			this.starExplode(this.star4);
       }
        if(this.checkCollision(this.Hato, this.star3)) {
            this.Hato.reset();
            this.starExplode(this.star3);
        }
        if (this.checkCollision(this.Hato, this.star2)) {
            this.Hato.reset();
            this.starExplode(this.star2);
        }
        if (this.checkCollision(this.Hato, this.star1)) {
            this.Hato.reset();
            this.starExplode(this.star1);
        }
    }
        //check collisons for 4 STARS
        checkCollision(heart, star) {
        if (heart.x < star.x + star.width && 
            heart.x + heart.width > star.x && 
            heart.y < star.y + star.height &&
            heart.height + heart.y > star. y) {
                return true;
        } else {
            return false;
        }
    }

        starExplode(star) {
        star.alpha = 0;                         
        // create explosion sprite at star's position
        let boom = this.add.sprite(star.x, star.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            star.reset();                         // reset ship position
            star.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += 0.6*star.points;
        this.scoreLeft.text = this.p1Score; 
        
        this.sound.play('sfx_explosion');
      }
}