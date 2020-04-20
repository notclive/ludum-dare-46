import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {OrganShaker} from './organShaker';
import {GameState} from '../state/stateManager';
import {Level} from '../scenes/level';

export class Mouth extends Phaser.Physics.Arcade.Sprite {

    private readonly shaker = new OrganShaker(this);

    public constructor(public scene: Level, x: number, y: number) {
        super(scene, x, y, 'mouth');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    public update(state: GameState) {
        // It's a lot easier to shake the mouth rather than the fish, as it's a single object.
        this.shaker.shakeIfUrgent(this.calculateUrgency(state));
    }

    private calculateUrgency = (state: GameState) => {
        const playerShouldCollectFish = !this.scene.stateManager.myPlayer.holdingFish
            && state.fishes.numberOfFishInPile > 0;
        return playerShouldCollectFish
            ? 100 - state.fullness
            : 0;
    };
}
