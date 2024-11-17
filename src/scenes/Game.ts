import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  player: Phaser.Physics.Arcade.Sprite;
  house: Phaser.Physics.Arcade.Sprite;
  facing: "left" | "right" | "idle" = "idle";
  obstacles: Phaser.Physics.Arcade.StaticGroup;
  selectedCharacter: string;
  canEnter: boolean = false;

  constructor() {
    super("Game");
  }

  init (data: {[key: string] : string})
  {
    this.sound.removeByKey("soundtrack");
    console.log('init', data);
    this.selectedCharacter = data.character;
  }

  preload() {
    this.load.spritesheet("character", `assets/villagers/${this.selectedCharacter}/${this.selectedCharacter}_walk.png`, {
      frameWidth: 32,
      frameHeight: 48,
      spacing: 16,
      margin: 0,
    });

    this.load.image("thing", "assets/house.png");
    this.load.image("tiles", "assets/objects/tiles-1/tileset.png");

    this.load.audio("ost", ["assets/phaser.mp3"]);
    this.load.audio("walk-grass", ["assets/audio/sfx/walk-grass.mp3"]);
  }

  create() {
    
    // Fade in
    this.cameras.main.fadeIn(1000);

    this.physics.world.setBounds(0, 0, 1024, 768);

    const level = Array(24)
      .fill(null)
      .map(() => Array(32).fill(0));

    const map = this.make.tilemap({
      data: level,
      tileWidth: 32,
      tileHeight: 32,
    });

    const tiles: any = map.addTilesetImage("tiles");
    const layer = map.createLayer("layer", tiles, 0, 0);
    console.log("Layer", layer);
    console.log("Map", map)
    console.log("Tiles", tiles);

    // AUDIO
    const ost = this.sound.add("ost", {
        loop: true,
        volume: 0.2,
    });
    if (!this.game.sound.isPlaying("ost")) {
      ost.play();
              }

    this.sound.add("walk-grass", { loop: true });

    // BUILDINGS

    this.house = this.physics.add.sprite(250, 450, "thing");
    this.house.setImmovable(true);
    this.house.setSize(150, 150);

        /******************
    ********* OBSTACLES
    ******************/

    const buildings = this.add.group();
    buildings.add(this.house);



    this.cursors = this.input.keyboard?.createCursorKeys();
    this.camera = this.cameras.main;

    // this.input.once('pointerdown', () => {
    //     this.scene.start('MainMenu');
    // });

    this.player = this.physics.add.sprite(100, 450, "character");
    this.player.setDisplaySize(60, 60);
    this.player.setCollideWorldBounds(true);

    console.log("obstacles", buildings.getChildren())
    this.physics.add.collider(this.player, buildings, () => {

      console.log("COLLISION");
      this.canEnter = true;
    ;console.log("canEnter", this.canEnter);

    }, undefined, this);
    

    // Create walking animations using all 6 frames
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("character", {
        start: 0,
        end: 5, // Using all 6 frames from the spritesheet
      }),
      frameRate: 12,
      repeat: -1,
    });

    // Idle animation using just the first frame
    this.anims.create({
      key: "idle",
      frames: [{ key: "character", frame: 0 }],
      frameRate: 10,
    });

    // TEXT
    this.add.text(this.house.x - this.house.width/2, this.house.y - (this.house.height/100 * 66), "Projects", {
      fontFamily: "Arial Black",
      fontSize: "2rem",
      color: "#000000",
      stroke: "#000000",
      strokeThickness: 1,
    });

    this.add.text(100, 150, "About", {
      fontFamily: "Arial Black",
      fontSize: "32px",
      color: "#000000",
      stroke: "#000000",
      strokeThickness: 1,
    });



    this.cursors?.space.on("down", () => {
      if (this.canEnter) {
        this.scene.start("Projects", { character: this.selectedCharacter });
      }
    });
  }

  update(): void {
    // Reset velocity
    this.player.setVelocity(0);

    if (
      this.cursors!.down.isDown ||
      this.cursors!.up.isDown ||
      this.cursors!.left.isDown ||
      this.cursors!.right.isDown
    ) {
      if (!this.game.sound.isPlaying("walk-grass")) {
        this.sound.play("walk-grass");
      }
    }

    if (
      this.cursors!.down.isUp ||
      this.cursors!.up.isUp ||
      this.cursors!.left.isUp ||
      this.cursors!.right.isUp
    ) {
      if (!this.game.sound.isPlaying("walk-grass")) {
        this.sound.removeByKey("walk-grass");
      }
    }

    if (this.cursors!.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.setFlipX(true);
      if (!this.player.anims.isPlaying) {
        this.player.anims.play("walk", true);
      }
    } else if (this.cursors!.right.isDown) {
      this.player.setVelocityX(160);
      this.player.setFlipX(false);
      if (!this.player.anims.isPlaying) {
        this.player.anims.play("walk", true);
      }
    } else if (this.cursors!.up.isDown) {
      this.player.setVelocityY(-160);
      if (!this.player.anims.isPlaying) {
        this.player.anims.play("walk", true);
      }
    } else if (this.cursors!.down.isDown) {
      this.player.setVelocityY(160);
      if (!this.player.anims.isPlaying) {
        this.player.anims.play("walk", true);
      }
    } else {
      this.player.setVelocity(0);
      this.player.anims.play("idle", true);
    }

    // this.physics.world.collide(this.house, this.player, () => {
    //     // this.house.setVelocity(0);
    //     // this.player.setVelocity(0);
    //     console.log("Collision!")
    // })

    // const isColliding = Phaser.Geom.Intersects.RectangleToRectangle(
    //   this.player.getBounds(),
    //   this.house.getBounds()
    // );
    // if (!isColliding) {
    //   this.canEnter = false;
      
    // }

    if (this.cursors?.space.isDown && this.canEnter) {
      this.enterHouse();
    }
  }

  checkProximity(player : Phaser.Physics.Arcade.Sprite, house: Phaser.Physics.Arcade.Sprite) {
    const distance = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      house.x,
      house.y
    );
    if (distance > 50) {
      this.canEnter = true;
    } else {
      this.canEnter = false;
    }
    
  }

  enterHouse() {
    console.log("Entering house...")
    if (this.canEnter) {
      this.scene.start("Projects", { character: this.selectedCharacter });
    }
  }
}
