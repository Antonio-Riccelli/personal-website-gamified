import { Scene } from "phaser";
import { Player } from "../classes/Player";
import { SceneFloorMapping } from "../utils/SceneFloorMapping";

export class ProjectsBuilding extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  player: Phaser.Physics.Arcade.Sprite;
  facing: "left" | "right" | "idle" = "idle";
  obstacles: Phaser.Physics.Arcade.StaticGroup;
  selectedCharacter: string;
  floor: string;
  rectangle: Phaser.Geom.Rectangle;
  twCanExitBuilding: Phaser.Tweens.Tween;
  prevScene: string;
  projects: any;
  canInteractStartingState: { [key: string]: boolean } = {
    niftiViewer: false,
    fightForApollo: false,
    cloudResume: false,
  };
  canInteract: { [key: string]: boolean } = {
    ...this.canInteractStartingState,
  };
  niftiViewer: Phaser.Physics.Arcade.Sprite
  brainPulse: Phaser.Tweens.Tween;

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

    this.load.image("wood-floor", "./assets/objects/tiles-3/wood-1.png");
    this.load.image("box-1", "assets/objects/objects/box/1.png");
    this.load.image("box-2", "assets/objects/objects/box/2.png");
    this.load.image("box-3", "assets/objects/objects/box/3.png");
    this.load.image("box-4", "assets/objects/objects/box/4.png");
    this.load.image("box-5", "assets/objects/objects/box/5.png");
    this.load.image("fightForApollo", "assets/objects/objects/projects/boxing-bag.png");
    this.load.image("cloudResume", "assets/objects/objects/projects/cv.png");
    this.load.image("niftiViewer", "assets/objects/objects/projects/brain-nifti.png")
    this.load.image("fightForApollo-selected", "assets/objects/objects/projects/boxing-bag-selected.png");
    this.load.image("cloudResume-selected", "assets/objects/objects/projects/cv-selected.png");
    this.load.image("niftiViewer-selected", "assets/objects/objects/projects/brain-nifti-selected.png")
    this.load.image("rocky", "assets/objects/objects/projects/rocky.png");
    this.load.audio(`walk-${this.floor}`, [`assets/audio/sfx/walk-${this.floor}.mp3`]);
  }

  create() {
    this.cameras.main.fadeIn(2000);
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.physics.world.createDebugGraphic();

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

    // Place boxes
    for (let i = 50; i < 1000; i += 50) {
      const box = Math.ceil(Math.random() * 5);
      this.physics.add.sprite(i, 50, `box-${box ? box : 1}`).setScale(2);
    }


    // Add project sprites
    this.projects = this.physics.add.group({
      immovable: true,
    });
    const fightForApollo = this.physics.add.sprite(this.cameras.main.width / 2 - 400, 550, "fightForApollo").setImmovable(true).setName("fightForApollo").setDepth(2).setBodySize(200, 200);
     const rocky = this.physics.add.sprite(this.cameras.main.width / 2 - 350, 550, "rocky").setImmovable(true).setName("rocky").setScale(0.4)
    
    const cloudResume = this.physics.add.sprite(this.cameras.main.width / 2 +  400, 300, "cloudResume").setScale(0.2).setImmovable(true).setName("cloudResume")
    this.niftiViewer = this.physics.add.sprite(this.cameras.main.width / 2, 200, "niftiViewer").setScale(0.5).setImmovable(true).setName("niftiViewer");
    this.projects.addMultiple([fightForApollo, cloudResume, this.niftiViewer])

    


    // Add player
    this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 96,  this.selectedCharacter, this.floor).setScale(3, 3);
    this.physics.add.collider(this.projects, this.player, (_, obj2) => this.checkCollision(obj2));
    this.physics.add.collider(this.player, rocky)

    // Add rectangle for exit detection
    this.rectangle = new Phaser.Geom.Rectangle(this.cameras.main.width / 2 - 150, this.cameras.main.height - 200, 300, 200)

    // Add tweens
    this.twCanExitBuilding = this.tweens.add({
      targets: this.player,
      tint: {from: 0xFFFFFF, to: 0xFFFFFF},
      duration: 200,
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

    this.brainPulse = this.tweens.add({
      targets: this.niftiViewer,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      persist: true,
      scale: {from: 0.4, to: 0.5},

    })
  }

  update() {
    this.player.update();

    if (this.cursors?.space.isDown) {
      this.scene.transition({
        target: "Game",
        duration: 1500,
        moveBelow: true,
        onStart: () => {
          this.scene.scene.cameras.main.fadeOut(1500, 0, 0, 0)
        },
        data: {
          character: this.selectedCharacter,
          floor: this.floor,
          prevScene: this.scene.key
        }
      });
    }

    const isInRange = this.rectangle.contains(this.player.x, this.player.y);
    if (isInRange) {
    
      if (!this.twCanExitBuilding.isPlaying()) {
        this.twCanExitBuilding.restart();
      }
    } else if (!isInRange) {
    
      this.twCanExitBuilding.pause();
      this.player.clearTint();
    
    }
  }

  checkCollision(
    object:
      | Phaser.Physics.Arcade.Body
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ) {
    if ("name" in object) {
      this.setCanInteract({ [object.name]: true });
    }
  }

  updateSelected(key: string, selected: boolean) {
    this.projects.getMatching("name", key)[0].setTexture(
      `${key}${selected ? '-selected' : ''}`
    )
  }

  setCanInteract(updatedValue: { [key: string]: boolean }) {
    const [key, value] = Object.entries(updatedValue)[0]
    this.canInteract[key] = value
    this.updateSelected(...Object.entries(updatedValue)[0]) 
  }

}
