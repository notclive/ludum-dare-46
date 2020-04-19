import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {OrganShaker} from './OrganShaker';
import {GameState, Virus} from '../state/stateManager';

export class Alarm extends Phaser.Physics.Arcade.Sprite {

    private readonly shaker = new OrganShaker(this);

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'alarm');

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

    public update({viruses, whiteBloodCell}: GameState) {
        const urgency = whiteBloodCell.enabled ? 0 : viruses.length * 40;
        this.shaker.shakeIfUrgent(urgency);
    }
}
