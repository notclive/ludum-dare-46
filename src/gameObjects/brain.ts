import { Player } from './player';
import { DecisionBox } from './decisionBox';
import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';
import { DecisionButton } from './decisionButton';
import Distance = Phaser.Math.Distance;

export class Brain extends Phaser.Physics.Arcade.Image {
    private decisionBox: DecisionBox;
    private buttonA: DecisionButton;
    private buttonB: DecisionButton;

    //TODO: For now, getting to make a decision is a one-time-only event!
    private decisionHasBeenShown: boolean;

    playerIsOverlapping: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, private player: Player) {
        super(scene, x, y, 'brain');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.decisionBox = new DecisionBox(scene, x, 20);
        this.buttonA = new DecisionButton(scene, x - 40, y, 'buttonA');
        this.buttonB = new DecisionButton(scene, x + 40, y, 'buttonB');
    }

    tryPressButton = () => {
        if (!this.decisionHasBeenShown) {
            return;
        }
        const distanceToButtonA = Distance.Between(this.buttonA.x, this.buttonB.y, this.player.x, this.player.y);
        const distanceToButtonB = Distance.Between(this.buttonB.x, this.buttonB.y, this.player.x, this.player.y);

        if (distanceToButtonA < 30) {
            console.log('near A')
            this.hideDecision();
        }
        else if (distanceToButtonB < 30) {
            console.log('near B')
            this.hideDecision();
        }
    };

    showDecision() {
        if (!this.decisionHasBeenShown) {
            this.decisionBox.show();
            this.buttonA.show();
            this.buttonB.show();

            this.decisionHasBeenShown = true;
        }
    }

    hideDecision() {
        if (this.decisionHasBeenShown) {
            this.decisionBox.hide();
            this.buttonA.hide();
            this.buttonB.hide();
        }
    }
}