import * as Phaser from 'phaser';
import {SceneBase} from './sceneBase';

export class Menu extends SceneBase {

    // Colours are darker shades of the palette colour #484d6d.
    private readonly defaultTextColour: string = '#3b405a';
    private readonly hoverTextColour: string = '#282a3c';

    create() {
        this.add.image(640, 512, 'background');

        const title = this.add.text(0, 150, 'ginger\'s day in', {fontSize: '50px', color: this.defaultTextColour});
        this.centreObjectX(title);

        const singleplayer = this.add.text(0, 460, 'singleplayer', {fontSize: '30px', color: this.defaultTextColour});
        this.centreObjectX(singleplayer);
        this.makeTextClickable(singleplayer, this.startSingleplayerGame);

        const multiplayer = this.add.text(0, 545, 'multiplayer', {fontSize: '30px', color: this.defaultTextColour});
        this.centreObjectX(multiplayer);
        this.makeTextClickable(multiplayer, this.startMultiplayerGame);
    }

    private makeTextClickable = (text: Phaser.GameObjects.Text, onClick: () => void) => {
        text.setInteractive();

        text.on('pointerover', () => {
            text.setColor(this.hoverTextColour);
            this.game.canvas.style.cursor = 'pointer';
        });

        text.on('pointerout', () => {
            text.setColor(this.defaultTextColour);
            this.game.canvas.style.cursor = 'default';
        });

        text.on('pointerdown', onClick);
    };

    private startSingleplayerGame = () => {
        console.log('Starting game...');
        this.scene.start('Level');
    };

    private startMultiplayerGame = () => {
        console.log('Starting game...');
        this.scene.start('Level');
    };
}
