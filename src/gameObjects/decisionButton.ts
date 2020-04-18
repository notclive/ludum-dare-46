import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';
import { Level } from '../scenes/level';

export class DecisionButton extends Phaser.Physics.Arcade.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, private imageKey: string) {
        super(scene, x, y, imageKey);
        this.setVisible(false);
        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    show() {
        this.setVisible(true);
    }

    hide() {
        this.setVisible(false);
    }
}
