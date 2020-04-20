import * as Phaser from 'phaser';
import { Decision } from './decision';

export const WIDTH = 300;
export const HEIGHT = 100;

export class DecisionBox extends Phaser.GameObjects.Sprite {
    private text: any;

    constructor(scene: Phaser.Scene, private xPosition: number, private yPosition: number, decision: Decision) {
        super(scene, xPosition, yPosition, 'decision-box');
        scene.add.existing(this);

        this.setDepth(1);

        this.text = this.scene.add.text(this.xPosition + 60, this.yPosition - 80, `Do what? \n  A: ${decision.optionA.label}\n  B: ${decision.optionB.label}`, { fontSize: '20px', fill: '#fff' });
        this.text.setDepth(1);

        this.setVisible(false);
        this.text.setVisible(false);
    }

    show() {
        this.setVisible(true);
        this.text.setVisible(true);
    }

    hide() {
        this.setVisible(false);
        this.text.setVisible(false);
    }
}