import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

export class Brain extends Phaser.Physics.Arcade.Image {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'brain');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }
}