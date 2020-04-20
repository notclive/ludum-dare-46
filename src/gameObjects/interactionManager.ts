import Sprite = Phaser.GameObjects.Sprite;
import {Player} from './player';

export type InteractionType = 'PUMP' | 'HOLD' | 'PRESS';

export class InteractionManager {

    private readonly cursors = this.player.scene.input.keyboard.createCursorKeys();
    private spaceBarWasDownOnLastTick = false;

    public constructor(
        private organ: Sprite,
        private player: Player,
        private interactionType: InteractionType,
        private onInteraction: () => void
    ) {
    }

    public checkForInteraction = () => {
        if (this.interactionType === 'PUMP') {
            this.checkForPumpInteraction();
        }
        this.spaceBarWasDownOnLastTick = this.cursors.space.isDown;
    };

    private checkForPumpInteraction() {
        if (this.cursors.space.isDown) {
            if (!this.spaceBarWasDownOnLastTick) {
                if (this.player.isTouching(this.organ)) {
                    this.onInteraction();
                }
            }
        }
    }
}
