export class Player extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  scene: Phaser.Scene;
  character: string;
  sceneFloor: string;

  constructor(scene: Phaser.Scene, x: number, y: number, character: string, sceneFloor: string) {
    super(scene, x, y, `${character}_walk`);
    this.scene = scene;
    this.sceneFloor = sceneFloor;

    // Add sprite to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics
    this.setDisplaySize(60, 60);
    this.setName("player");
    this.setCollideWorldBounds(true);

    // Cursor keys
    this.cursors = scene.input.keyboard!.createCursorKeys();

    // Animations
    this.createAnimations(character);
  }

  update(): void {
    this.setVelocity(0);

    if (this.cursors!.left.isDown) {
        this.setVelocityX(-160);
        this.setFlipX(true);
        if (!this.anims.isPlaying) {
          this.anims.play("walk", true);
        }
      } else if (this.cursors!.right.isDown) {
        this.setVelocityX(160);
        this.setFlipX(false);
        if (!this.anims.isPlaying) {
          this.anims.play("walk", true);
        }
      } else if (this.cursors!.up.isDown) {
        this.setVelocityY(-160);
        if (!this.anims.isPlaying) {
          this.anims.play("walk", true);
        }
      } else if (this.cursors!.down.isDown) {
        this.setVelocityY(160);
        if (!this.anims.isPlaying) {
          this.anims.play("walk", true);
        }
      } else if (this.cursors.down.isUp || this.cursors.left.isUp || this.cursors.right.isUp || this.cursors.up.isUp) {
        this.setVelocity(0);
        this.anims.stop();
        this.setFrame(0)
      }

      this.handleWalkSound();
    
  }

  private createAnimations(characterName: string): void {
    if (!this.scene.anims.exists("walk")) {
      this.scene.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers(`${characterName}_walk`, {
          start: 0,
          end: 5, // Using all 6 frames from the spritesheet
        }),
        frameRate: 12,
        repeat: -1,
      });
    }
  }


  private handleWalkSound(): void {
    const walkSound = `walk-${this.sceneFloor}`;
  
    if (
      this.cursors!.down.isDown ||
      this.cursors!.up.isDown ||
      this.cursors!.left.isDown ||
      this.cursors!.right.isDown
    ) {
      if (!this.scene.game.sound.isPlaying(walkSound)) {
        this.scene.sound.play(walkSound);
      }
    }

    if (
      this.cursors!.down.isUp ||
      this.cursors!.up.isUp ||
      this.cursors!.left.isUp ||
      this.cursors!.right.isUp
    ) {
      if (!this.scene.game.sound.isPlaying(walkSound)) {
        this.scene.sound.removeByKey(walkSound);
      }
    }
  }
}
