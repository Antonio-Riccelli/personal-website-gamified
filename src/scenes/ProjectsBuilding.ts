import { Scene } from "phaser";
import { Player } from "../classes/Player";

export class ProjectsBuilding extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  player: Phaser.Physics.Arcade.Sprite;
  house: Phaser.Physics.Arcade.Sprite;
  facing: "left" | "right" | "idle" = "idle";
  obstacles: Phaser.Physics.Arcade.StaticGroup;
  selectedCharacter: string;

  constructor() {
    super("Projects");
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
    this.load.image("wood-floor", "./assets/objects/tiles-3/wood-1.png");
  }

  create() {
    this.cameras.main.fadeIn(2000);

    const levelData = Array(96)
    .fill(null)
    .map(() => Array(256).fill(0))

    const map = this.make.tilemap({
      data: levelData,
      tileWidth: 128,
      tileHeight: 128,
    })

    const tiles = map.addTilesetImage("wood-floor", "wood-floor");
    map.createLayer("layer", tiles!, 0, 0)

    // Add player
    // this.player = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 96, "character");
    this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 96,  this.selectedCharacter).setScale(3, 3);




  }

  update() {
    this.player.update();
  }
}
