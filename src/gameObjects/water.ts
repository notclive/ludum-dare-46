import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

export class Water extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene, x: number, private initialY: number, private minY: number) {
        super(scene, x, initialY, 'water');

        this.setAlpha(0.5);
        this.setDepth(1);
        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    update(waterLevel: number) {
        // This keeps the water within the bounds of the cat
        this.y = this.minY + ((this.initialY - this.minY) * (100 - waterLevel) / 100);
    }

    YOfTheWaterLevel = () => this.y - (this.displayHeight / 2);
}