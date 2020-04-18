import { Player } from './player';
import { DecisionBox } from './decisionBox';
import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';
import { DecisionButton } from './decisionButton';
import { Level } from '../scenes/level';

export class Brain extends Phaser.Physics.Arcade.Sprite {
    private decisionBox: DecisionBox;
    private buttonA: DecisionButton;
    private buttonB: DecisionButton;

    private decisionIsVisible: boolean;

    playerIsOverlapping: boolean;

    constructor(scene: Level, x: number, y: number, private player: Player) {
        super(scene, x, y, 'brain');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.decisionBox = new DecisionBox(scene, this.x, 20);
        this.buttonA = new DecisionButton(scene, this.x - 40, this.y, 'buttonA');
        this.buttonB = new DecisionButton(scene, this.x + 40, this.y, 'buttonB');

        this.scene.anims.create({
            key: 'brain-slowPulse',
            frames: this.scene.anims.generateFrameNumbers('brain', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.play('brain-slowPulse', true);
    }

    tryPressButton = () => {
        if (!this.decisionIsVisible) {
            return;
        }

        if (this.player.isTouching(this.buttonA)) {
            console.log('near A');
            this.hideDecision();
        }
        else if (this.player.isTouching(this.buttonB)) {
            console.log('near B');
            this.hideDecision();
        }
    };

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