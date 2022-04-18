class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
      }

    create() {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width/2,game.config.height/4 - borderUISize - borderPadding, 'ROCKET PATROL (Modded)', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/4, 'Use ←→ arrows to move & ↑ to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        let singleplayerText = this.add.text(game.config.width/2, game.config.height/4 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        
        let simul2PText = this.add.text(game.config.width/2, singleplayerText.y + borderUISize + borderPadding, 'Press ↓ for Simultaneous 2P', menuConfig).setOrigin(0.5);
        let simul2PControlsText = this.add.text(game.config.width/2, simul2PText.y + borderUISize + borderPadding, 'P2: A and D to move, W to fire', menuConfig).setOrigin(0.5);
        
        let highScoresTitle = this.add.text(game.config.width/2, simul2PControlsText.y + 2 * (borderUISize + borderPadding), 'HIGH SCORES', menuConfig).setOrigin(0.5);
        let highScoresInnerText = "Novice: " + globalHighScores.singleplayerNovice + "\nExpert: " + globalHighScores.singleplayerExpert + "\nSimul 2P: " + globalHighScores.twoPlayerSimul;
        this.add.text(game.config.width/2, highScoresTitle.y + highScoresTitle.height/2, highScoresInnerText, menuConfig).setOrigin(0.5, 0.0);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000,
            mode: "singleplayerNovice"
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000,
            mode: "singleplayerExpert"
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
          // Simultaneous 2P
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000,
            mode: "twoPlayerSimul"
          }
          this.sound.play('sfx_select');
          this.scene.start('simul2PScene');    
        }
    }
}