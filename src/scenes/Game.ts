import { Scene } from "phaser";
import { Player } from "../classes/Player";
import { SceneFloorMapping } from "../utils/SceneFloorMapping";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  floor: string;
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
  canTalk: boolean;
  prevScene: string;
  antonio: Phaser.Physics.Arcade.Sprite;
  antonioCircle: Phaser.Geom.Circle

  constructor() {
    super("Game");
  }

  init(data: { [key: string]: string }) {
    this.sound.removeByKey("soundtrack");
    console.log("init", data);
    this.selectedCharacter = data.character;
    this.floor = SceneFloorMapping[this.scene.key].floor;
    this.prevScene = data.prevScene;
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

    this.load.spritesheet(
      "antonio-walk",
      "assets/villagers/old-man/old_man_walk.png",
      {
        frameWidth: 32,
        frameHeight: 48,
        spacing: 16,
        margin: 0
      }
    )

    this.load.spritesheet(
      "antonio-idle",
      "assets/villagers/old-man/old_man_idle.png",
      {
        frameWidth: 32,
        frameHeight: 48,
        spacing: 16,
        margin: 0
      }
    )

    this.load.image("antonio-select", "assets/villagers/old-man/old_man-select.png");

    this.load.image("projectsBuilding", "assets/objects/objects/house/4.png");
    this.load.image(
      "projectsBuilding-selected",
      "assets/objects/objects/house/4-selected.png"
    );
    this.load.image("aboutBuilding", "assets/objects/objects/house/2.png");
    this.load.image(
      "aboutBuilding-selected",
      "assets/objects/objects/house/2-selected.png"
    );
    this.load.image("tiles", "assets/objects/tiles-1/tileset.png");


    this.load.audio("ost", ["assets/phaser.mp3"]);
    this.load.audio(`walk-${this.floor}`, [`assets/audio/sfx/walk-${this.floor}.mp3`]);
  }

  create(): void {
    // Fade in
    this.cameras.main.fadeIn(2000);

    this.physics.world.setBounds(0, 0, 1024, 768);

    const level = Array(24)
      .fill(null)
      .map(() => Array(32).fill(37));

      for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
          const randNum = Math.random();
          if (randNum < 0.2) {
            level[y][x] = 37;
          } else if (randNum < 0.4) {
            level[y][x] = 20;
          } else if (randNum < 0.6) {
            level[y][x] = 18;
          } else if (randNum < 0.8) {
            level[y][x] = 25;
          } else {
            level[y][x] = 37;
          }
        }
      }

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

    this.sound.add(`walk-${this.floor}`, { loop: true });

    // BUILDINGS

    this.projectsBuilding = this.physics.add.sprite(
      250,
      450,
      "projectsBuilding"
    );
    this.projectsBuilding.setImmovable(true);
    this.projectsBuilding.setSize(150, 150);
    this.projectsBuilding.setName("projectsBuilding");

    this.aboutBuilding = this.physics.add.sprite(
      640,
      200,
      "aboutBuilding"
    );
    this.aboutBuilding.setImmovable(true);
    this.aboutBuilding.setSize(150, 150);
    this.aboutBuilding.setName("aboutBuilding");

    /******************
     ********* Buildings
     ******************/

    this.buildings = this.physics.add.group({
      immovable: true,
    });
  
    this.buildings.addMultiple([this.projectsBuilding, this.aboutBuilding]);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.camera = this.cameras.main;

// PLAYER

    const playerStartingCoords = {
      x: this.prevScene === "ChooseCharacter" ? this.cameras.main.width / 2 : (this as any)[`${this.prevScene[0].toLowerCase()}${this.prevScene.slice(1)}`]?.x + this.player.width / 2 ?? 50,
      y: this.prevScene === "ChooseCharacter" ? this.cameras.main.height - 96 : (this as any)[`${this.prevScene[0].toLowerCase()}${this.prevScene.slice(1)}`]?.y + this.player.height + 50 ?? 50,
    } 

    this.player = new Player(this, playerStartingCoords.x, playerStartingCoords.y,  this.selectedCharacter, this.floor);

    // ANTONIO
    this.antonio = this.physics.add.sprite(900, 500, "antonio-idle")
    this.antonio.setDisplaySize(60, 60);
    // this.antonio.setSize(60, 60)
    this.antonio.setOffset(-16, 0); 
    this.antonio.setName("antonio")
    this.antonio.setCollideWorldBounds(true)
    this.antonio.setImmovable(true)
   
    // this.antonio.setSize(60, 60)
    this.antonioCircle = new Phaser.Geom.Circle(this.antonio.x, this.antonio.y, 150);
    this.physics.world.createDebugGraphic();

    this.physics.add.collider(
      this.player,
      this.antonio,
      () => {
        this.canTalk = true;
        this.antonio.setTexture("antonio-select")
      },
      (player : any, antonio: any) => {
        console.log('Collision velocities:', player.body.velocity.x, antonio.body.velocity.x);
        return true;
      },
      this
    )

    this.physics.add.collider(
      this.player,
      this.buildings,
      (_, building) => this.checkCollision(building),
      undefined,
      this
    );

    // TEXT
    const pjBuilding_rectangleForText = this.add.rectangle(
      this.projectsBuilding.x ,
      this.projectsBuilding.y - (this.projectsBuilding.height / 100) * 66,
      this.projectsBuilding.width,
      this.projectsBuilding.height / 100 * 33,
      0x000000,
      0.2
    );
    const pjBuilding_text = this.add.text(
      0, 0,
      "Projects",
      {
        fontFamily: "pixelFont",
        fontSize: "2rem",
        color: "#000000",
        stroke: "#000000",
        strokeThickness: 1,
        align: "center"
      },
    );
    Phaser.Display.Align.In.Center(pjBuilding_text, pjBuilding_rectangleForText);

    const abBuilding_rectangleForText = this.add.rectangle(
      this.aboutBuilding.x ,
      this.aboutBuilding.y - (this.aboutBuilding.height / 100) * 66,
      this.aboutBuilding.width,
      this.aboutBuilding.height / 100 * 33,
      0x000000,
      0.2
    );
    const abBuilding_text = this.add.text(
    0, 0,
    "About", {
      fontFamily: "pixelFont",
      fontSize: "2rem",
      color: "#000000",
      stroke: "#000000",
      strokeThickness: 1,
      align: "center"
    });

    Phaser.Display.Align.In.Center(abBuilding_text, abBuilding_rectangleForText);

    this.cursors?.space.on("down", () => {
      console.log("Trying to enter...")
      this.enterBuilding();
    });
  }

  update(): void {
    this.player.update();
    this.checkDistance();



  } // end of update ()

  checkCollision(
    object:
      | Phaser.Physics.Arcade.Body
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ) {
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
    const [key, value] = Object.entries(updatedValue)[0]
    this.canEnter[key] = value
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


      const isBuildingInRange = Phaser.Geom.Circle.Contains(
        circle,
        this.player.x,
        this.player.y
      );

      if (!isBuildingInRange) {
        this.setCanEnter({
          ["name" in object && typeof object.name === "string"
            ? object.name
            : ""]: false,
        });
      }

      const isAntonioInRange = this.antonioCircle.contains(
        this.player.x,
        this.player.y
      )

      if (!isAntonioInRange) {
        this.antonio.setTexture("antonio-idle")
      }
    });
  }

  enterBuilding() {
    
    // This should be a safe approach as only one building should be true at any given time
    Object.entries(this.canEnter).find(([key, value]) => {
      if (value) {
        console.log("Entering building...", key, value);
        this.scene.transition({
          target: `${key[0].toUpperCase()}${key.slice(1)}`,
          duration: 1000,
          moveBelow: true,
          data: {
            character: this.selectedCharacter,
          },
          onStart: () => {
            this.scene.scene.cameras.main.fadeOut(1000, 0, 0, 0);
          }
        })
      }
    });
  }
}
