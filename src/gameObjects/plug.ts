import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {OrganShaker} from './organShaker';
import {GameState, OrganInteractionTimes} from '../state/stateManager';
import {InteractionManager} from './interactionManager';
import {Level} from '../scenes/level';

export class Plug extends Phaser.Physics.Arcade.Sprite {

    private readonly shaker = new OrganShaker(this);
    private readonly interactionManager = new InteractionManager(
        this,
        this.scene.player,
        'HOLD',
        () => {
            this.scene.stateManager.handleEvent({
                type: 'DRAIN_PLUG'
            });
        }, {
            pickInteractionTime: (organInteractionTimes: OrganInteractionTimes) => organInteractionTimes.plugUsed,
            normalAnimation: 'plug-plugged',
            interactionAnimation: 'plug-unplugged',
            interactionSound: 'water',
        }
    );

    constructor(public scene: Level, x: number, y: number) {
        super(scene, x, y, 'plug');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.scene.anims.create({
            key: 'plug-plugged',
            frames: this.scene.anims.generateFrameNumbers('plug', {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'plug-unplugged',
            frames: this.scene.anims.generateFrameNumbers('plug', {start: 2, end: 4}),
            frameRate: 15,
            repeat: -1
        });

        // Organ shaker rotates around this point.
        this.setOrigin(0.31, 0.81);
    }

    public update(state: GameState) {
        // A water level of 50% is pretty problematic.
        this.shaker.shakeIfUrgent(state.waterLevel * 2);
        this.interactionManager.update(state);
    }

    public stopSounds() {
        this.interactionManager.stopSounds();
    }
}
