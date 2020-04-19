import * as Phaser from 'phaser';
import {SceneBase} from './sceneBase';

export class MultiplayerSetup extends SceneBase {

    private readonly adjectives = ['fat', 'angry', 'proud', 'lazy', 'fluffy', 'playful', 'wild', 'cute'];
    private readonly colours = ['white', 'black', 'ginger', 'grey', 'cream', 'brown', 'cinnamon'];
    private readonly names = ['cat', 'feline', 'puss', 'tabby', 'kitty'];

    // Colours are darker shades of the palette colour #484d6d.
    private readonly defaultTextColour: string = '#3b405a';
    private readonly hoverTextColour: string = '#282a3c';

    private gameIdInput;

    private gameId: string;

    create() {
        this.gameId = this.randomlyGenerateGameId();
        this.add.image(640, 512, 'background');

        const title = this.add.text(0, 150, 'multiplayer setup', {fontSize: '50px', color: this.defaultTextColour});
        this.centreObjectX(title);

        this.drawGameIdMessage();
        this.drawGameIdInput();

        const join = this.add.text(745, 585, 'join', {fontSize: '30px', color: this.defaultTextColour, align: 'center'});
        this.makeTextClickable(join, this.startMultiplayerGame);
    }

    private drawGameIdMessage() {
        const gameIdMessage = this.add.text(
            0, 400,
            `your game id is \'${this.gameId}\'\n share it with a friend`,
            {fontSize: '30px', color: this.defaultTextColour, align: 'center'}
        );
        gameIdMessage.setLineSpacing(35);
        this.centreObjectX(gameIdMessage);
    }

    private drawGameIdInput() {
        this.gameIdInput = document.createElement('input');
        this.gameIdInput.placeholder = 'your friend\'s game id';
        this.gameIdInput.style.width = '325px';
        this.gameIdInput.style.padding = '3px';
        this.gameIdInput.style.fontSize = '25px';
        // Roughly matches Phaser font.
        this.gameIdInput.style.fontFamily = 'monospace';
        this.add.dom(560, 600, this.gameIdInput);
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

        text.on('pointerdown', () => {
            this.game.canvas.style.cursor = 'default';
            onClick();
        });
    };

    private startMultiplayerGame = () => {
        console.log(this.gameIdInput.value);
        // this.scene.start('Level');
    };

    private randomlyGenerateGameId = () => {
        const adjective = this.randomlySelectFromList(this.adjectives);
        const colour = this.randomlySelectFromList(this.colours);
        const name = this.randomlySelectFromList(this.names);
        return `${adjective}-${colour}-${name}`;
    };

    private randomlySelectFromList = <T>(list: T[]) => {
        return list[Math.floor(Math.random() * list.length)];
    }
}
