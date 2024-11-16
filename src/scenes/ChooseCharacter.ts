import { Scene } from "phaser";

export class ChooseCharacter extends Scene {
  background: Phaser.GameObjects.Image;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  tween: Phaser.Tweens.Tween;
  man: Phaser.GameObjects.Image;
  woman: Phaser.GameObjects.Image;
  selectSound: Phaser.Sound.BaseSound;
  characterSelected: boolean | string = false;
  music: Phaser.Sound.BaseSound;

  constructor() {
    super("ChooseCharacter");
  }

  preload() {
    this.load.image("bg", "assets/bg/1/5.png");
    this.load.image("man", "assets/villagers/man/man.png");
    this.load.image("man-select", "assets/villagers/man/man-select.png");
    this.load.image("woman", "assets/villagers/woman/woman.png");
    this.load.image("woman-select", "assets/villagers/woman/woman-select.png");
    this.load.audio("select", ["assets/audio/sfx/select.mp3"]);
    this.load.audio("selectCharacter", ["assets/audio/music/character-select.mp3"]);
  }

  create() {
    // Create keyboard input
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Create audio
    this.selectSound = this.sound.add("select").setVolume(0.2);
    const ost =  this.sound.add("selectCharacter", {
        loop: true,
        volume: 0.2,
      });
      ost.play();
    

    // Set background image and stretch it to fit the screen
    this.background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "bg"
    );
    const scaleX = this.cameras.main.width / this.background.width;
    const scaleY = this.cameras.main.height / this.background.height;
    this.background.setScale(scaleX, scaleY);

    // Create the character images
    this.man = this.add
      .sprite(
        this.cameras.main.width / 3 + 16,
        this.cameras.main.height / 2 + 200,
        "man"
      )
      .setScale(3.5);

    this.woman = this.add
      .sprite(
        (this.cameras.main.width / 3) * 2 + 32,
        this.cameras.main.height / 2 + 200,
        "woman"
      )
      .setScale(3.5);

    // Add tweening effect to the character images
    // this.tween = this.tweens.add({
    //     targets: this.man,
    //     texture: ["man", "man-select"],
    //     repeat: -1,
    //     duration: 1000,
    //     yoyo: true,
    //     loop: -1,
    //     onStart: () => {
    //         this.man.setTexture("man-select");
    //         console.log("Selecting man...")
    //     }
    // })
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors!.left)) {
      this.selectSound.play();

      if (!this.characterSelected) {
        this.characterSelected = "man";
        this.man.setTexture("man-select");
      } else if (this.characterSelected === "man") {
        this.characterSelected = "woman";
        this.woman.setTexture("woman-select");

        if (this.man.texture.key === "man-select") {
          this.man.setTexture("man");
        }
      } else {
        this.characterSelected = "man";
        this.man.setTexture("man-select");

        if (this.woman.texture.key === "woman-select") {
          this.woman.setTexture("woman");
        }
      }

      this.getSelectedCharacter;
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors!.right)) {
      this.selectSound.play();
      if (!this.characterSelected) {
        this.characterSelected = "woman";
        this.woman.setTexture("woman-select");
       
      } else if (this.characterSelected === "man") {
        this.characterSelected = "woman";
        this.woman.setTexture("woman-select");
   
        if (this.man.texture.key === "man-select") {
          this.man.setTexture("man");
        }

      } else {
        this.characterSelected = "man";
        this.man.setTexture("man-select");

        if (this.woman.texture.key === "woman-select") {
          this.woman.setTexture("woman");
        }

        this.getSelectedCharacter;
      }
    }
  }

  get getSelectedCharacter() {
    console.log("Selected Character:", this.characterSelected);
    return this.characterSelected;
  }
}
