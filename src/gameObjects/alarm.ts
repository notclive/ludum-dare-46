import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {OrganShaker} from './organShaker';
import {GameState, Virus} from '../state/stateManager';
import {InteractionManager} from './interactionManager';
import {Level} from '../scenes/level';

export class Alarm extends Phaser.Physics.Arcade.Sprite {

    private readonly shaker = new OrganShaker(this);
    private readonly interactionManager = new InteractionManager(
        this,
        this.scene.player,
        'PRESS',
        () => {
            this.scene.stateManager.handleEvent({
                type: 'RING_ALARM'
            });
        }
    );

    constructor(public scene: Level, x: number, y: number) {
        super(scene, x, y, 'lymph');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.scene.anims.create({
            key: 'lymph-slowPulse',
            frames: this.scene.anims.generateFrameNumbers('lymph', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.play('lymph-slowPulse', true);
    }

    public update(state: GameState) {
        const urgency = state.whiteBloodCell.enabled ? 0 : state.viruses.length * 40;
        this.shaker.shakeIfUrgent(urgency);
        this.interactionManager.update(state)
    }
}
