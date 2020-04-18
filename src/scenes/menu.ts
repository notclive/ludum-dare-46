import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';

export class Menu extends SceneBase {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private text: Phaser.GameObjects.Text;

    create() {
        this.cameras.main.backgroundColor = Phaser.Display.Color.ValueToColor(0x808080);

        // red circle
        let circle = this.add.graphics();
        circle.fillStyle(0xff0000);
        circle.fillCircle(this.gameWidth / 2, this.gameHeight / 2, 50);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.text = this.add.text(0, (this.gameHeight / 2) + 75, 'Press "space" to start', { fontSize: '32px', fill: '#000' });
        this.centreObjectX(this.text);

        // Skip menu so we can develop quicker.
        this.startGame();
    }

    update() {
        if (this.cursors.space.isDown) {
            this.startGame();
        }
    }

    private startGame() {
        console.log('Starting game...');
        this.scene.start('Level');
    }
}
