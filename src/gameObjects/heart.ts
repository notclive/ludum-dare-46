import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';
import {OrganShaker} from './organShaker';
import {InteractionManager} from './interactionManager';
import {Level} from '../scenes/level';
import {GameState} from '../state/stateManager';

export class Heart extends Phaser.Physics.Arcade.Sprite {

    private readonly shaker = new OrganShaker(this);
    private readonly interactionManager = new InteractionManager(
        this,
        this.scene.player,
        'PUMP',
        () => {
            this.scene.stateManager.handleEvent({
                type: 'PUMP_HEART'
            });
        },
        null,
        'heartbeat'
    );

    constructor(public scene: Level, x: number, y: number) {
        super(scene, x, y, 'heart');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.scene.anims.create({
            key: 'heart-slowPulse',
            frames: this.scene.anims.generateFrameNumbers('heart', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.play('heart-slowPulse', true);
    }

    public update(state: GameState) {
        this.shaker.shakeIfUrgent(100 - state.heart);
        this.interactionManager.update(state);
    }
}
