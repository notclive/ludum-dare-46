import * as Phaser from 'phaser';

export const WIDTH = 250;
export const HEIGHT = 50;

export class DecisionBox extends Phaser.GameObjects.Graphics {
    constructor(scene: Phaser.Scene, private xPosition: number, private yPosition: number) {
        super(scene);
        scene.add.existing(this);
        
        this.setDepth(1);
    }

    create() {
        var textBox = this.scene.add.graphics();
        textBox.fillStyle(0x0000008B, 1);
        textBox.fillRect(this.xPosition, this.yPosition, WIDTH, HEIGHT);

        this.scene.add.text(this.xPosition, this.yPosition, 'Decide: do this or that?', { fontSize: '20px', fill: '#fff' });
    }

    show() {
        this.create();
    }
}