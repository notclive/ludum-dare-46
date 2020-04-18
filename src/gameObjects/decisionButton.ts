import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

export class DecisionButton extends Phaser.Physics.Arcade.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, private imageKey: string) {
        super(scene, x, y, imageKey);
    }

    show() {
        this.scene.physics.world.enable(this, PHASER_STATIC_BODY);
        this.scene.add.existing(this);
    }

    hide() {
        this.destroy();
    }
}
