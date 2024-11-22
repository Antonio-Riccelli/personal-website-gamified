import { Scene } from "phaser";
import { Player } from "../classes/Player";
import { SceneFloorMapping } from "../utils/SceneFloorMapping";

export class AboutBuilding extends Scene {
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
  rectangle: Phaser.Geom.Rectangle;
  twCanExitBuilding: Phaser.Tweens.Tween

  constructor() {
    super("AboutBuilding");
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

    this.load.image("about-building-floor", "./assets/objects/tiles-3/wood-2.png");
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

    const tiles = map.addTilesetImage("about-building-floor", "about-building-floor");
    map.createLayer("layer", tiles!, 0, 0)
    this.sound.add(`walk-${this.floor}`, { loop: true });
    // Add player
    this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 96,  this.selectedCharacter, this.floor).setScale(3, 3);
  
    this.rectangle = new Phaser.Geom.Rectangle(this.cameras.main.width / 2 - 150, this.cameras.main.height - 200, 300, 200)

    this.twCanExitBuilding = this.tweens.add({
      targets: this.player,
      // tint: 0xFFFFFF,
      tint: {from: 0xFFFFFF, to: 0xFFFFFF},
      // tintFill: true,
      // alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: -1,
      paused: true,
      persist: true,
      onStart: () => {
        this.player.setTintFill(0xFFFFFF);
      },
      onRepeat: () => {
        this.player.setTintFill(0xFFFFFF);
      },
      onYoyo: () => {
        this.player.clearTint();
      }
    });
  }

  update() {
    this.player.update();

    if (this.cursors?.space.isDown) {
      this.scene.start("Game", {
        character: this.selectedCharacter,
        floor: this.floor,
      });
    }

    const isInRange = this.rectangle.contains(this.player.x, this.player.y);
    if (isInRange) {
      // console.log("Attempting playing tween in range...")
      if (!this.twCanExitBuilding.isPlaying()) {
        this.twCanExitBuilding.restart();
      }
    } else if (!isInRange) {
      // console.log("No longer in range...")
      this.twCanExitBuilding.pause();
      this.player.clearTint();
      // this.player.setAlpha(1);
    }
  }
}
