class PlaySimul2P extends Phaser.Scene {
    constructor() {
        super("simul2PScene");
        
    }

    init() {
        this.NUM_SHIPS = 3;
        this.shipsSpawnData = [
            {x: game.config.width + borderUISize*6, y: borderUISize*4, points: 30},
            {x: game.config.width + borderUISize*3, y: borderUISize*5 + borderPadding*2, points: 20},
            {x: game.config.width, y: borderUISize*6 + borderPadding*4, points: 10},
        ]
        this.shipsArray = [];

        this.gameEndTimerDelay;
        this.timeRegainMultiplier = 1.0;
        this.TIME_REGAIN_MULTIPLIER_MIN = 0.15;
        this.additionalTimeText = "";
        this.additionalTimeTextTimer = new Phaser.Time.TimerEvent();
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    
    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        let rocketArgsP1 = {
            scene: this,
            x: game.config.width * 0.75,
            y: game.config.height - borderUISize - borderPadding,
            texture: 'rocket',
            frame: undefined,
            airControlled: true,
            moveLeftKey: keyLEFT,
            moveRightKey: keyRIGHT,
            fireKey: keyUP
        }
        this.p1Rocket = new Rocket(rocketArgsP1);

        // add rocket (p2)
        let rocketArgsP2 = {
            scene: this,
            x: game.config.width * 0.25,
            y: game.config.height - borderUISize - borderPadding,
            texture: 'rocket',
            frame: undefined,
            airControlled: true,
            moveLeftKey: keyA,
            moveRightKey: keyD,
            fireKey: keyW
        }
        this.p2Rocket = new Rocket(rocketArgsP2);

        // add spaceships (x3)
        for (let i = 0; i < this.NUM_SHIPS; i++) {
            this.shipsArray.push(new Spaceship(this, this.shipsSpawnData[i].x, this.shipsSpawnData[i].y, 'spaceship', 0, this.shipsSpawnData[i].points).setOrigin(0, 0));
        }

        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        // Initialize "FIRE" text
        this.fireText = "FIRE";
        // Config for "FIRE" text
        let fireTextConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        // Initialize time left text
        this.timeLeftText = "Time: " + game.settings.gameTimer / 1000;
        // Config for "FIRE" text
        let timeLeftTextConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        // Initalize high score text
        this.highScoreText = "HI: " + globalHighScores[game.settings.mode];

        // Score textbox
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        // "FIRE" text textbox (hidden until the rocket is fired)
        this.fireTextTextbox = this.add.text(this.scoreLeft.x + this.scoreLeft.width + borderPadding, borderUISize + borderPadding*2, this.fireText, fireTextConfig);
        this.fireTextTextbox.visible = false;
        // Time Left textbox
        this.timeLeftTextbox = this.add.text(this.fireTextTextbox.x + this.fireTextTextbox.width + borderPadding, borderUISize + borderPadding*2, this.timeLeftText, timeLeftTextConfig);

        // High score textbox
        this.highScoreTextbox = this.add.text(0, borderUISize + borderPadding*2, this.highScoreText, timeLeftTextConfig);
        // Right-justify high score textbox
        this.highScoreTextbox.x = game.config.width - borderUISize - borderPadding - this.highScoreTextbox.width;
        
        
        // GAME OVER flag
        this.gameOver = false;
        
        // Timer for the scene
        // Pretty much the same functionally as what N. Altice had, but I like this version more
        scoreConfig.fixedWidth = 0;
        this.gameEndTimerDelay = game.settings.gameTimer;
        this.gameEndTimerConfig = {
            delay: this.gameEndTimerDelay,
            callback: () => {
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
                this.gameOver = true;

                // Update high score
                globalHighScores[game.settings.mode] = Math.max(this.p1Score, globalHighScores[game.settings.mode]);
            },
            args: null,
            callbackScope: this
        }
        this.clock = this.time.addEvent(this.gameEndTimerConfig);
        
        // Speedup after 30 seconds
        // Note: the speed increase only affects the ships
        this.time.addEvent({
            delay: 30000,
            callback: () => {
                for (let ship of this.shipsArray) {
                    ship.moveSpeed *= 1.75;
                }
            }
        })

        this.additionalTimeTextTimerConfig = {
            delay: 500,
            callback: () => {this.additionalTimeText = ""},
            args: null,
            callbackScope: this
        }
    }
    
    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        
        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.p2Rocket.update();

            for (let ship of this.shipsArray) {
                ship.update();
            }
        }

        // check collisions
        for (let ship of this.shipsArray) {
            if (this.checkCollision(this.p1Rocket, ship)) {
                this.p1Rocket.reset();
                this.shipExplode(ship);
                this.addTimeOnHit(ship);
            }
            if (this.checkCollision(this.p2Rocket, ship)) {
                this.p2Rocket.reset();
                this.shipExplode(ship);
                this.addTimeOnHit(ship);
            }
        }
        // Update visibility of fire textbox
        this.fireTextTextbox.visible = this.p1Rocket.isFiring || this.p2Rocket.isFiring;
        // Update the text for time remaining
        this.timeLeftText = "Time: " + Math.ceil((this.gameEndTimerDelay - this.clock.getElapsed()) / 1000);
        this.timeLeftText = this.timeLeftText + this.additionalTimeText;
        this.timeLeftTextbox.text = this.timeLeftText;
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        // The animation will be invisible, but the respawn timing will be maintained
        boom.alpha = 0;
        boom.anims.play('explode');             // play explode animation
        
        // Play animation for ship getting destroyed
        ship.playDestroyAnim();
        
        // Move ship away so only one rocket can hit it at a time
        ship.x = game.config.width * 2;
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('sfx_explosion');
    }

    addTimeOnHit(hitShip) {
    // Add back time to time left
    let timeRemaining = this.gameEndTimerDelay - this.clock.getElapsed();
    // Remove old clock, make a new one with more time
    let millisecondsToAdd = (hitShip.points * 100) * this.timeRegainMultiplier;
    this.gameEndTimerDelay = timeRemaining + millisecondsToAdd;
    // Need to update this.gameEndTimerConfig.delay
    this.gameEndTimerConfig.delay = this.gameEndTimerDelay;
    // Reset this.clock to use the new remaining time
    this.clock.reset(this.gameEndTimerConfig);

    this.timeRegainMultiplier = Math.max((this.timeRegainMultiplier - 0.05).toFixed(2), this.TIME_REGAIN_MULTIPLIER_MIN);
    this.additionalTimeText = "+" + (millisecondsToAdd / 1000).toFixed(2);
    
    // Remove current timer event (if any) for regained time text and then make a new timer event
    this.additionalTimeTextTimer.remove();
    this.additionalTimeTextTimer = this.time.addEvent(this.additionalTimeTextTimerConfig);
    }
}