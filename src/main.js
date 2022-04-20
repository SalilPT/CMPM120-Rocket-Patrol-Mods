
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play, PlaySimul2P]
}
let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN;
let keyW, keyA, keyD;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let globalHighScores = {
    singleplayerNovice: 0,
    singleplayerExpert: 0,
    twoPlayerSimul: 0
}