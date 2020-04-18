import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

export class Heart extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'heart');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.scene.anims.create({
            key: 'heart-slowPulse',
            frames: this.scene.anims.generateFrameNumbers('heart', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.play('heart-slowPulse', true);
    }
}