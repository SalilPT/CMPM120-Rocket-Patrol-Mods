/*
POINTS BREAKDOWN

Track a high score that persists across scenes and display it in the UI (5)
Implement the 'FIRE' UI text from the original game (5)
Implement the speed increase that happens after 30 seconds in the original game (5)
Allow the player to control the Rocket after it's fired (5)

Display the time remaining (in seconds) on the screen (10)

Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)

Implement a simultaneous two-player mode (30)

Total: 100
*/
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