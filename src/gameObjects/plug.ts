import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';
import { Water } from './water';

export class Plug extends Phaser.Physics.Arcade.Image {

    private isPlugged = true;

    constructor(scene: Phaser.Scene, x: number, y: number, private water: Water) {
        super(scene, x, y, 'plug');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    unplug = () => {
        this.isPlugged = false;
        this.setAngle(90);
    };

    plug = () => {
        this.isPlugged = true;
        this.setAngle(0);
    };

    update = (waterLevel: number) => {
        this.water.update(waterLevel);
    };

    getIsPlugged = () => this.isPlugged;
}
