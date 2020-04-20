import { OrganInteractionTimes } from './../state/stateManager';
import * as Phaser from 'phaser';
import { PHASER_STATIC_BODY } from '../consts';
import {OrganShaker} from './organShaker';
import {InteractionManager} from './interactionManager';
import {Level} from '../scenes/level';
import {GameState} from '../state/stateManager';
import OrganBase from './organBase';

export class Lungs extends OrganBase {

    private readonly shaker = new OrganShaker(this);
    private readonly interactionManager = new InteractionManager(
        this,
        this.scene.player,
        'HOLD',
        () => {
            this.scene.stateManager.handleEvent({
                type: 'BREATHE_LUNGS'
            });
        },
        {
            pickInteractionTime: (times: OrganInteractionTimes) => times.lungsUsed,
            holdSound: 'lungs',
        }
    );

    constructor(public scene: Level, x: number, y: number) {
        super(scene, x, y, 'lungs');
        // Influences where interaction hint appears and rotation point of organ shaking.
        this.setOrigin(0.65, 0.55);

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.scene.anims.create({
            key: 'lungs-slowPulse',
            frames: this.scene.anims.generateFrameNumbers('lungs', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.play('lungs-slowPulse', true);
    }

    public update(state: GameState) {
        this.shaker.shakeIfUrgent(100 - state.lungs);
        this.interactionManager.update(state);
    }
}
