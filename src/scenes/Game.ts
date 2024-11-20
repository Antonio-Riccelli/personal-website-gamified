import { Scene } from "phaser";
import { Player } from "../classes/Player";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  player: Phaser.Physics.Arcade.Sprite;
  buildings: Phaser.Physics.Arcade.Group;
  projectsBuilding: Phaser.Physics.Arcade.Sprite;
  aboutBuilding: Phaser.Physics.Arcade.Sprite;
  facing: "left" | "right" | "idle" = "idle";
  selectedCharacter: string;
  character: Player;
  canEnterStartingState: { [key: string]: boolean } = {
    projectsBuilding: false,
    aboutBuilding: false,
  };
  canEnter: { [key: string]: boolean } = {
    ...this.canEnterStartingState,
  };

  constructor() {
    super("Game");
  }

  init(data: { [key: string]: string }) {
    this.sound.removeByKey("soundtrack");
    console.log("init", data);
    this.selectedCharacter = data.character;
  }

  preload(): void {
    this.load.spritesheet(
      `${this.selectedCharacter}_walk`,
      `assets/villagers/${this.selectedCharacter}/${this.selectedCharacter}_walk.png`,
      {
        frameWidth: 32,
        frameHeight: 48,
        spacing: 16,
        margin: 0,
      }
    );

    this.load.image("projectsBuilding", "assets/objects/objects/house/4.png");
    this.load.image(
      "projectsBuilding-selected",
      "assets/objects/objects/house/4-selected.png"
    );
    this.load.image("tiles", "assets/objects/tiles-1/tileset.png");

    this.load.audio("ost", ["assets/phaser.mp3"]);
    this.load.audio("walk-grass", ["assets/audio/sfx/walk-grass.mp3"]);
  }

  create(): void {
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
    map.createLayer("layer", tiles, 0, 0);

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

    this.projectsBuilding = this.physics.add.sprite(
      250,
      450,
      "projectsBuilding"
    );
    this.projectsBuilding.setImmovable(true);
    this.projectsBuilding.setSize(150, 150);
    this.projectsBuilding.setName("projectsBuilding");

    /******************
     ********* Buildings
     ******************/

    this.buildings = this.physics.add.group({
      immovable: true,
    });
    this.buildings.add(this.projectsBuilding);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.camera = this.cameras.main;

    this.player = new Player(this, 100, 450,  this.selectedCharacter);

    this.physics.add.collider(
      this.player,
      this.buildings,
      (player, building) => this.checkCollision(player, building),
      undefined,
      this
    );

    // Create walking animations using all 6 frames
    // this.anims.create({
    //   key: "walk",
    //   frames: this.anims.generateFrameNumbers("character", {
    //     start: 0,
    //     end: 5, // Using all 6 frames from the spritesheet
    //   }),
    //   frameRate: 12,
    //   repeat: -1,
    // });

    // Idle animation using just the first frame
    // this.anims.create({
    //   key: "idle",
    //   frames: [{ key: "character", frame: 0 }],
    //   frameRate: 10,
    // });

    // TEXT
    this.add.text(
      this.projectsBuilding.x - this.projectsBuilding.width / 2,
      this.projectsBuilding.y - (this.projectsBuilding.height / 100) * 66,
      "Projects",
      {
        fontFamily: "Arial Black",
        fontSize: "2rem",
        color: "#000000",
        stroke: "#000000",
        strokeThickness: 1,
      }
    );

    this.add.text(100, 150, "About", {
      fontFamily: "Arial Black",
      fontSize: "32px",
      color: "#000000",
      stroke: "#000000",
      strokeThickness: 1,
    });

    this.cursors?.space.on("down", () => {
      if (this.canEnter.projectsBuilding) {
        
        this.scene.transition({
          target: "Projects",
          duration: 1000,
          moveBelow: true,
          data: {
            character: this.selectedCharacter,
          },
          onStart: () => {
            this.scene.scene.cameras.main.fadeOut(1000, 0, 0, 0, () => {
              console.log("Fading out...");
            });
          },
        });

      }
    });
  }

  update(): void {
    this.player.update();

    // this.animateWalk();
    // this.addSoundToWalk();
    this.checkDistance();

    if (this.cursors?.space.isDown) {
      this.enterBuilding();
    }
  } // end of update ()

  // animateWalk() {
  //   if (this.cursors!.left.isDown) {
  //     this.player.setVelocityX(-160);
  //     this.player.setFlipX(true);
  //     if (!this.player.anims.isPlaying) {
  //       this.player.anims.play("walk", true);
  //     }
  //   } else if (this.cursors!.right.isDown) {
  //     this.player.setVelocityX(160);
  //     this.player.setFlipX(false);
  //     if (!this.player.anims.isPlaying) {
  //       this.player.anims.play("walk", true);
  //     }
  //   } else if (this.cursors!.up.isDown) {
  //     this.player.setVelocityY(-160);
  //     if (!this.player.anims.isPlaying) {
  //       this.player.anims.play("walk", true);
  //     }
  //   } else if (this.cursors!.down.isDown) {
  //     this.player.setVelocityY(160);
  //     if (!this.player.anims.isPlaying) {
  //       this.player.anims.play("walk", true);
  //     }
  //   } else {
  //     this.player.setVelocity(0);
  //     this.player.anims.play("idle", true);
  //   }
  // }

  // addSoundToWalk() {
  //   if (
  //     this.cursors!.down.isDown ||
  //     this.cursors!.up.isDown ||
  //     this.cursors!.left.isDown ||
  //     this.cursors!.right.isDown
  //   ) {
  //     if (!this.game.sound.isPlaying("walk-grass")) {
  //       this.sound.play("walk-grass");
  //     }
  //   }

  //   if (
  //     this.cursors!.down.isUp ||
  //     this.cursors!.up.isUp ||
  //     this.cursors!.left.isUp ||
  //     this.cursors!.right.isUp
  //   ) {
  //     if (!this.game.sound.isPlaying("walk-grass")) {
  //       this.sound.removeByKey("walk-grass");
  //     }
  //   }
  // }

  checkCollision(
    player:
      | Phaser.Physics.Arcade.Body
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    object:
      | Phaser.Physics.Arcade.Body
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ) {
    console.log(
      "Collision between",
      "name" in player ? player.name : "player",
      "and",
      "name" in object ? object.name : "object"
    );

    if ("name" in object) {
      this.setCanEnter({ [object.name]: true });
    }
  }

  updateSelected(key: string, selected: boolean) {
    this.buildings.getMatching("name", key)[0].setTexture(
      `${key}${selected ? '-selected' : ''}`
    )
  }

  setCanEnter(updatedValue: { [key: string]: boolean }) {
    this.canEnter = {
      ...this.canEnterStartingState,
      ...updatedValue,
    };
    console.log(
      "Updated canEnter with new value:",
      updatedValue,
      "\nCurrent canEnter:",
      this.canEnter
    );

    this.updateSelected(...Object.entries(updatedValue)[0]) 
  }

  checkDistance() {
    const objects = [...this.buildings.getChildren()];

    objects.forEach((object: Phaser.GameObjects.GameObject) => {
      const circle = new Phaser.Geom.Circle(
        "x" in object && typeof object.x === "number" ? object.x : 0,
        "y" in object && typeof object.y === "number" ? object.y : 0,
        150
      );

      const isInRange = Phaser.Geom.Circle.Contains(
        circle,
        this.player.x,
        this.player.y
      );

      if (!isInRange) {
        this.setCanEnter({
          ["name" in object && typeof object.name === "string"
            ? object.name
            : ""]: false,
        });
      }
    });
  }

  enterBuilding() {
    console.log("Entering building...");

    // This should be a safe approach as only one building should be true at any given time
    Object.entries(this.canEnter).find(([key, value]) => {
      if (value) {
        this.scene.start(key, { character: this.selectedCharacter });
      }
    });
  }
}
