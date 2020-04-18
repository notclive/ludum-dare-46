import * as Phaser from 'phaser';

export const WIDTH = 300;
export const HEIGHT = 100;

export class DecisionBox extends Phaser.GameObjects.Graphics {
    constructor(scene: Phaser.Scene, private xPosition: number, private yPosition: number) {
        super(scene);
        scene.add.existing(this);

        this.setDepth(1);
    }

    show() {
        var textBox = this.scene.add.graphics();
        textBox.fillStyle(0x0000008B, 1);
        textBox.fillRect(this.xPosition, this.yPosition, WIDTH, HEIGHT);

        this.scene.add.text(this.xPosition, this.yPosition, 'Do what? \n  A: this\n  B: that', { fontSize: '20px', fill: '#fff' });
    }

    hide() {
        // TODO: this doesn't work yet.
        this.destroy();
    }
}