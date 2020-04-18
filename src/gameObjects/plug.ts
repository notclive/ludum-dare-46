import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

const WATER_DECREASE_PER_FRAME = 0.8;

export class Plug extends Phaser.Physics.Arcade.Image {
    private waterLevel = 0;
    private isPlugged = true;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'plug');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    unplug = () => {
        this.isPlugged = false;
        this.setAngle(90);
    }

    plug = () => {
        this.isPlugged = true;
        this.setAngle(0);
    }

    update(increment: number) {
        this.waterLevel = this.waterLevel + increment;
    }

    drain() {
        const newLevel = this.waterLevel - WATER_DECREASE_PER_FRAME;
        this.waterLevel = newLevel < 0
            ? 0
            : newLevel;
    }

    getWaterLevelPercentage = () => this.waterLevel;

    getIsPlugged = () => this.isPlugged;
}