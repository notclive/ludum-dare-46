import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {Level} from '../scenes/level';
import {OrganShaker} from './organShaker';
import {GameState} from '../state/stateManager';

export class Stomach extends Phaser.Physics.Arcade.Sprite {

    private readonly shaker = new OrganShaker(this);

    public constructor(public scene: Level, x: number, y: number) {
        super(scene, x, y, 'stomach');
        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
        this.reduceHitbox();
    }

    private reduceHitbox = () => {
        this.body.setSize(125, 145);
        this.body.setOffset(55, 35);
    };

    public update(state: GameState) {
        this.shaker.shakeIfUrgent(this.calculateUrgency(state));
        this.maybeDropFish();
    }

    private calculateUrgency = ({fullness}: GameState) => {
        return this.scene.stateManager.myPlayer.holdingFish
            ? 100 - fullness
            : 0;
    };

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
