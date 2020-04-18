import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

export class Water extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene, x: number, private maxY: number, private minY: number) {
        super(scene, x, maxY, 'water');

        this.setAlpha(0.5);
        this.setDepth(1);
        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    update(waterLevel: number) {
        // This keeps the water within the bounds of the cat
        const waterLevelY = this.minY + ((this.maxY - this.minY) * (100 - waterLevel) / 100);
        this.y = waterLevelY + (this.displayHeight / 2);
    }

    YOfTheWaterLevel = () => this.y - (this.displayHeight / 2);
}