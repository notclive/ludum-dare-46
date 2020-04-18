import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';

const HEALTH_INCREASE_PER_FOOD = 20;

export class Stomach extends Phaser.Physics.Arcade.Image {
    private health = 100;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'stomach');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    update(increment: number) {
        this.health = this.health - increment;
    }

    feed() {
        const newHealth = this.health + HEALTH_INCREASE_PER_FOOD;
        this.health = newHealth > 100
            ? 100
            : newHealth;
    }

    getHealth() {
        return this.health;
    }

    hasFailed() {
        return this.health <= 0;
    }
}