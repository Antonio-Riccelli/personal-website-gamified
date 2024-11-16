import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.game.sound.stopAll();
        this.background = this.add.image(512, 384, 'background');

        this.title = this.add.text(512, 460, 'Thanks for visiting my portfolio.\n Click anywhere to start by choosing your character.', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
            wordWrap: { width: 800 }
        }).setOrigin(0.5, 0.75);

        this.input.once('pointerdown', () => {

            this.scene.start('ChooseCharacter');
            // this.scene.start('Game');

        });

      
    }}
