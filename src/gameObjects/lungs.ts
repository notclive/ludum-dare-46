import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

export class Lungs extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'lungs');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.scene.anims.create({
            key: 'lungs-slowPulse',
            frames: this.scene.anims.generateFrameNumbers('lungs', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.play('lungs-slowPulse', true);
    }
}
