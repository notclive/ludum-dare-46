import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {OrganShaker} from './OrganShaker';

export class Plug extends Phaser.Physics.Arcade.Sprite {

    private readonly shaker = new OrganShaker(this);
    private isPlugged = true;

    constructor(scene: Phaser.Scene, x: number, y: number) {
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

        // Organ shaker rotates around this point.
        this.setOrigin(0.31, 0.81);
    }

    public update(waterLevel: number) {
        // A water level of 50% is pretty problematic.
        this.shaker.shakeIfUrgent(waterLevel * 2);
    }

    unplug = () => {
        this.isPlugged = false;
        this.anims.play('plug-unplugged', true);
    };

    plug = () => {
        this.isPlugged = true;
        this.anims.play('plug-plugged', true);
    };

    getIsPlugged = () => this.isPlugged;
}
