import { Scene } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    cursors: any;
    player: any;
    facing: 'left' | 'right' | 'idle' = 'idle';

    constructor() {
        super('Game');
    }

    preload() {
        // Adjust frameWidth based on your actual sprite width (looks like each frame is about 32 pixels)
        this.load.spritesheet('dude', 'assets/Man_walk.png', { 
            frameWidth: 48,  // Adjust this if needed to match your exact sprite width
            frameHeight: 48,
            spacing: 0      // Add this if there's any spacing between frames
        });
    }

    create() {
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.camera = this.cameras.main;

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });

        this.player = this.physics.add.sprite(100, 450, 'dude');
        
        // Create walking animations using all 6 frames
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dude', { 
                start: 0,
                end: 5    // Using all 6 frames from the spritesheet
            }),
            frameRate: 12,
            repeat: -1
        });

        // Idle animation using just the first frame
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'dude', frame: 0 }],
            frameRate: 10
        });
    }

    update(): void {
        // Reset velocity
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.setFlipX(true);
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('walk', true);
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.setFlipX(false);
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('walk', true);
            }
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('walk', true);
            }
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('walk', true);
            }
        }
        else {
            this.player.setVelocity(0);
            this.player.anims.play('idle', true);
        }
    }
}