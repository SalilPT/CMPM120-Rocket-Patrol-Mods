// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(params) {
      super(params.scene, params.x, params.y, params.texture, params.frame);

    // add object to existing scene
    params.scene.add.existing(this);   // add to existing, displayList, updateList
    this.isFiring = false;      // track rocket's firing status
    this.moveSpeed = 2;         // pixels per frame

    this.sfxRocket = params.scene.sound.add('sfx_rocket'); // add rocket sfx

    this.airControlled = params.airControlled;

    // Initialize controls
    this.moveRightKey = params.scene.input.keyboard.addKey(params.moveRightKey || keyRIGHT);
    this.moveLeftKey = params.scene.input.keyboard.addKey(params.moveLeftKey || keyLEFT);
    this.fireKey = params.scene.input.keyboard.addKey(params.fireKey || keyUP);
    }

    update() {
        // left/right movement
        // If this.airControlled is false and this.isFiring is true, then the rocket can't move left/right.
        if (this.airControlled || !this.isFiring) {
            let leftBoundsCheckPassed = this.x >= borderUISize + this.width;
            let rightBoundsCheckPassed = this.x <= game.config.width - borderUISize - this.width;
            if (this.moveLeftKey.isDown && leftBoundsCheckPassed && !this.moveRightKey.isDown) {
                this.x -= this.moveSpeed;
                //console.log("?")
            }
            else if (this.moveRightKey.isDown && rightBoundsCheckPassed && !this.moveLeftKey.isDown) {
                this.x += this.moveSpeed;
            }
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(this.fireKey) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}