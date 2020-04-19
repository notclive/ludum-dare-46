import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {OrganShaker} from './OrganShaker';
import {GameState, OrganInteractionTimes} from '../state/stateManager';

export class Plug extends Phaser.Physics.Arcade.Sprite {

    private readonly shaker = new OrganShaker(this);

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

        // Organ shaker rotates around this point.
        this.setOrigin(0.31, 0.81);
    }

    public update({waterLevel, organInteractionTimes, gameTime}: GameState) {
        // A water level of 50% is pretty problematic.
        this.shaker.shakeIfUrgent(waterLevel * 2);
        this.setAnimation(organInteractionTimes, gameTime);
    }

    private setAnimation = ({plugUsed}: OrganInteractionTimes, gameTime: number) => {
        // I don't know how reliably a multiplayer peer will call update for every game state.
        // A buffer of 10 ticks makes it very likely a peer will notice that the plug was used.
        if (plugUsed && plugUsed > gameTime - 10) {
            this.anims.play('plug-unplugged', true);
        } else {
            this.anims.play('plug-plugged', true);
        }
    };
}
