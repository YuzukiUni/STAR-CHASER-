class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/megu.mp3');
        this.load.audio('sfx_explosion', './assets/kira.mp3');
        this.load.audio('sfx_rocket', './assets/chu.wav');
        this.load.image('Opening', './assets/Opening.png');
        this.load.audio('OpenBGM', './assets/Ringo.mp3');


    }
    

    create() {
     
      //add bgm

      this.bgm = this.sound.add('OpenBGM', {
        mute:false,
        volume:0.4,
        rate:1,
        loop:true,
        

     });

    this.bgm.play();
      this.open = this.add.tileSprite(0, 0,1280, 720, 'Opening').setOrigin(0, 0);
      
      // menu text configuration
      let menuConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '40px',
            color: '#cccccc',
            align: 'right',
            padding: {
                top: 20,
                bottom: 100,
            },
            fixedWidth: 0
        }
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/3 , 'Star Chaser !', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, '(Use ←→ arrows , or mouse click, to move & (F) to fire', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.5 , 'Press N for Normal or H for Hard)', menuConfig).setOrigin(0.5);

        // define keys
        keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyN)) {
          //Normal Mode
          game.settings = {
            BigStarSpeed: 4,
            gameTimer: 60000    ,
          }
          this.sound.play('sfx_select');
          this.bgm.pause('OpenBGM')  ;
          this.scene.start("playScene");  
        }
        if (Phaser.Input.Keyboard.JustDown(keyH)) {
          //Hard Mode
          game.settings = {
            BigStarSpeed: 8,
            gameTimer: 60000    ,
          }
          this.sound.play('sfx_select');
          this.bgm.pause('OpenBGM');
          this.scene.start("playScene");    
        }
      }
}