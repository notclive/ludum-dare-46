import * as Phaser from 'phaser';
import {BUTTON_BACKGROUND_COLOUR, BUTTON_TEXT_COLOUR, BUTTON_BACKGROUND_COLOR_ON_HOVER, BUTTON_TEXT_COLOUR_ON_HOVER} from './menuConstants';
import {SceneBase} from '../scenes/sceneBase';
import Text = Phaser.GameObjects.Text;
import Rectangle = Phaser.GameObjects.Rectangle;
import Color = Phaser.Display.Color;

export default class MenuButton {

    public constructor(private scene: SceneBase, y: number, label: string, onClick: () => void) {
        const text = new Text(scene, 0, y, label, {fontSize: '30px', color: BUTTON_TEXT_COLOUR});
        scene.centreObjectX(text);

        const background = new Rectangle(
            scene,
            0, y - 10,
            text.displayWidth + 40, text.displayHeight + 20,
            Color.HexStringToColor(BUTTON_BACKGROUND_COLOUR).color
        );
        background.setOrigin(0);
        scene.centreObjectX(background);

        // Add text after background so that it's on top.
        scene.add.existing(background);
        scene.add.existing(text);

        this.makeButtonClickable(background, text, onClick);
    }

    private makeButtonClickable = (background: Rectangle, text: Text, onClick: () => void) => {
        background.setInteractive();

        background.on('pointerover', () => {
            this.scene.game.canvas.style.cursor = 'pointer';
            background.fillColor = Color.HexStringToColor(BUTTON_BACKGROUND_COLOR_ON_HOVER).color;
            text.setColor(BUTTON_TEXT_COLOUR_ON_HOVER);
        });

        background.on('pointerout', () => {
            this.scene.game.canvas.style.cursor = 'default';
            background.fillColor = Color.HexStringToColor(BUTTON_BACKGROUND_COLOUR).color;
            text.setColor(BUTTON_TEXT_COLOUR);
        });

        background.on('pointerdown', () => {
            this.scene.game.canvas.style.cursor = 'default';
            onClick();
        });
    };
}
