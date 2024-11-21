import { Scene } from "phaser";
import { Player } from "../classes/Player";
import { SceneFloorMapping } from "../utils/SceneFloorMapping";

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
  floor: string;

  constructor() {
    super("ProjectsBuilding");
  }

  init (data: {[key: string] : string})
  {
    this.sound.removeByKey("ost");
    console.log('init', data);
    this.selectedCharacter = data.character;
    this.floor = SceneFloorMapping[this.scene.key].floor;
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
    this.load.audio(`walk-${this.floor}`, [`assets/audio/sfx/walk-${this.floor}.mp3`]);
  }

  create() {
    this.cameras.main.fadeIn(2000);
    this.cursors = this.input.keyboard?.createCursorKeys();

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
    this.sound.add(`walk-${this.floor}`, { loop: true });
    // Add player
    this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 96,  this.selectedCharacter, this.floor).setScale(3, 3);
  }

  update() {
    this.player.update();

    if (this.cursors?.space.isDown) {
      this.scene.start("Game", {
        character: this.selectedCharacter,
        floor: this.floor,
      });
    }
  }
}
