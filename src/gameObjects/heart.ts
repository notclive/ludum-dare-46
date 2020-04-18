import * as Phaser from 'phaser';

const STATIC_BODY = 1;

export class Heart extends Phaser.Physics.Arcade.Image {
    private health = 100;
    constructor(scene: Phaser.Scene, x: number, y: number, width: number) {
        super(scene, x, y, 'heart');

        scene.physics.world.enable(this, STATIC_BODY);
        scene.add.existing(this);
    }

    update() {
        this.health = this.health - 0.05;
    }

    pump() {
        this.health = 100;
    }

    getHealth() {
        return this.health;
    }
}