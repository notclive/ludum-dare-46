import * as Phaser from 'phaser';
import { Decision } from './decision';

export const WIDTH = 300;
export const HEIGHT = 100;

export class DecisionBox extends Phaser.GameObjects.Graphics {
    private background: any;
    private text: any;

    constructor(scene: Phaser.Scene, private xPosition: number, private yPosition: number, decision: Decision) {
        super(scene);
        scene.add.existing(this);

        this.setDepth(1);

        this.background = this.scene.add.graphics();
        this.text = this.scene.add.text(this.xPosition, this.yPosition, `Do what? \n  A: ${decision.optionA.label}\n  B: ${decision.optionB.label}`, { fontSize: '20px', fill: '#fff' });

        this.background.setVisible(false);
        this.text.setVisible(false);

        this.background.fillStyle(0x0000008B, 1);
        this.background.fillRect(this.xPosition, this.yPosition, WIDTH, HEIGHT);
    }

    show() {
        this.background.setVisible(true);
        this.text.setVisible(true);
    }

    hide() {
        this.background.setVisible(false);
        this.text.setVisible(false);
    }
}