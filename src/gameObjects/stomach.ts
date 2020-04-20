import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {Level} from '../scenes/level';

export class Stomach extends Phaser.Physics.Arcade.Sprite {

    public constructor(public scene: Level, x: number, y: number) {
        super(scene, x, y, 'stomach');
        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    public update() {
        this.maybeDropFish();
    }

    private maybeDropFish = () => {
        if (this.scene.player.isTouching(this)) {
            this.dropFish();
        }
    };

    private dropFish() {
        this.scene.stateManager.myPlayer = {
            ...this.scene.stateManager.myPlayer,
            holdingFish: false
        };
        this.scene.stateManager.handleEvent({
            type: 'DIGEST_FOOD'
        });
    }
}
