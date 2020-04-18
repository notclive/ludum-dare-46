import * as Phaser from 'phaser';

export const STAT_BAR_WIDTH = 250;
export const STAT_BAR_HEIGHT = 20;
export const LABEL_WIDTH = 60;

export class StatBar extends Phaser.GameObjects.Graphics {
    constructor(scene: Phaser.Scene, private xPosition: number, private yPosition: number, private label: string) {
        super(scene);
        scene.add.existing(this);
        this.create();
    }

    create() {
        this.setDepth(1);
        var progressBox = this.scene.add.graphics();
        progressBox.fillStyle(0x8B0000, 0.8);
        progressBox.fillRect(this.xPosition + LABEL_WIDTH, this.yPosition, STAT_BAR_WIDTH, STAT_BAR_HEIGHT);
        this.scene.add.text(this.xPosition, this.yPosition, this.label, { fontSize: '20px', fill: '#000' });
    }

    update(value: number) {
        this.clear();
        this.fillStyle(0xDE1738, 1);
        this.fillRect(this.xPosition + LABEL_WIDTH, this.yPosition, STAT_BAR_WIDTH * value / 100, STAT_BAR_HEIGHT);
    }
}