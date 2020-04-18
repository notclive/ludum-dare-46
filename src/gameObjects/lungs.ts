import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

export class Lungs extends Phaser.Physics.Arcade.Image {
    private health = 100;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'lungs');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    update(increment: number) {
        this.health = this.health - increment;
    }

    breathe() {
        this.health = 100;
    }

    getHealth() {
        return this.health;
    }

    haveFailed() {
        return this.health <= 0;
    }
}