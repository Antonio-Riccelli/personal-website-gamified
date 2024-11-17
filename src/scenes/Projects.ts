import { Scene } from "phaser";

export class Projects extends Scene {
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
    this.load.image("tiles", "assets/objects/tiles-1/tileset.png");
  }

  create() {
    
  }

  update() {
 
  }
}
