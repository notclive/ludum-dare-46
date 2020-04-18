import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';
import { Water } from './water';

export class Plug extends Phaser.Physics.Arcade.Sprite {
    private isPlugged = true;

    constructor(scene: Phaser.Scene, x: number, y: number, private water: Water) {
        super(scene, x, y, 'plug');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.scene.anims.create({
            key: 'plug-plugged',
            frames: this.scene.anims.generateFrameNumbers('plug', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'plug-unplugged',
            frames: this.scene.anims.generateFrameNumbers('plug', { start: 2, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.play('plug-plugged', true);
    }

    unplug = () => {
        this.isPlugged = false;
        this.anims.play('plug-unplugged', true);
    };

    plug = () => {
        this.isPlugged = true;
        this.anims.play('plug-plugged', true);
    };

    update = (waterLevel: number) => {
        this.water.update(waterLevel);
    };

    getIsPlugged = () => this.isPlugged;
}
