import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';

export class Menu extends SceneBase {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    create() {
        this.cameras.main.backgroundColor = Phaser.Display.Color.ValueToColor(0x808080);

        // focus on 0, 0
        this.setView();

        // red circle
        let circle = this.add.graphics();
        circle.fillStyle(0xff0000);
        circle.fillCircle(0, 0, 50);
        
        this.cursors = this.input.keyboard.createCursorKeys();
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