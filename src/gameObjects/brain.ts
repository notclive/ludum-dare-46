import { DecisionBox } from './decisionBox';
import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';
import { DecisionButton } from './decisionButton';

export class Brain extends Phaser.Physics.Arcade.Image {
    private decisionBox: DecisionBox;
    private buttonA: DecisionButton;
    private buttonB: DecisionButton;
    private decisionIsVisible: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'brain');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.decisionBox = new DecisionBox(scene, x, 20);
        this.buttonA = new DecisionButton(scene, x - 40, y, 'buttonA');
        this.buttonB = new DecisionButton(scene, x + 40, y, 'buttonB');
    }

    showDecision() {
        if (!this.decisionIsVisible) {
            this.decisionBox.show();
            this.buttonA.show();
            this.buttonB.show();

            this.decisionIsVisible = true;
        }
    }

    hideDecision() {
        if (this.decisionIsVisible) {
            this.decisionBox.hide();
            this.buttonA.hide();
            this.buttonB.hide();

            this.decisionIsVisible = false;
        }
    }
}