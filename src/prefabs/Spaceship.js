// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;         // pixels per frame

        // Set up this object's particle emitter manager and particle emitter
        this.particleManager = scene.add.particles("rocket");
        let circularParticleRegion = new Phaser.Geom.Circle(this.width / 2, this.height / 2, this.height);
        this.particleEmitter = this.particleManager.createEmitter(
            {
                alpha: {start: 0.85, end: 0.0},
                blendMode: "ADD",
                emitZone: {type: "random", source: circularParticleRegion, quantity: 100},
                frequency: -1,
                lifespan: 500,
                // Rotation code adapted from here: https://phaser.discourse.group/t/help-with-particle-emitter-rotation/1696
                rotate: {
                        onEmit: (particle) => {
                            return -180;
                        },
                        onUpdate: (particle) => {
                            return particle.angle + 15;
                        }
                },
                scaleX: 1.25,
                scaleY: 1.25
            }
        )
        // Set emitter to radial mode and set its speed
        this.particleEmitter.setSpeed(100);
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width) {
            this.reset();
        }
        //console.log(this.particleEmitter.x, this.particleEmitter.y);
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }

    playDestroyAnim() {
        this.particleEmitter.x = this.x ;
        this.particleEmitter.y = this.y;
        this.particleEmitter.explode(50, this.particleEmitter.x, this.particleEmitter.y);
    }
}