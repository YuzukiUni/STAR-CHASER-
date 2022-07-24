let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables for playing
let keyF, keyR, keyN, keyH,keyLEFT,keyRIGHT;