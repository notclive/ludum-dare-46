import Sprite = Phaser.GameObjects.Sprite;
import {Player} from './player';
import GameObject = Phaser.GameObjects.GameObject;

export type InteractionType = 'PUMP' | 'HOLD' | 'PRESS';

export class InteractionManager {

    private readonly cursors = this.player.scene.input.keyboard.createCursorKeys();
    private playerHasInteractedWithThisOrgan = false;
    private spaceBarWasDownOnLastTick = false;
    private interactionHint: GameObject;

    public constructor(
        private organ: Sprite,
        private player: Player,
        private interactionType: InteractionType,
        private notifyParentOfInteraction: () => void
    ) {
        this.player.scene.anims.create({
            key: 'pump-spacebar',
            frames: this.player.scene.anims.generateFrameNumbers('spacebar', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
    }

    public checkForInteraction = () => {
        const playerIsTouchingOrgan = this.player.isTouching(this.organ);
        this.showOrHideInteractionHint(playerIsTouchingOrgan);
        if (playerIsTouchingOrgan) {
            if (this.interactionType === 'PUMP') {
                this.checkForPumpInteraction();
            }
        } else {
            this.destroyInteractionHint();
        }
        this.spaceBarWasDownOnLastTick = this.cursors.space.isDown;
    };

    private showOrHideInteractionHint = (playerIsTouchingOrgan: boolean) => {
        if (playerIsTouchingOrgan && !this.playerHasInteractedWithThisOrgan) {
            this.drawInteractionHint();
        } else {
            this.destroyInteractionHint();
        }
    };

    private drawInteractionHint = () => {
        if (!this.interactionHint) {
            this.interactionHint = this.player.scene.add
                .sprite(this.organ.x, this.organ.y, 'spacebar')
                .anims.play('pump-spacebar', true);
        }
    };

    private destroyInteractionHint = () => {
        if (this.interactionHint) {
            this.interactionHint.destroy();
        }
    };

    private checkForPumpInteraction = () => {
        if (this.cursors.space.isDown) {
            if (!this.spaceBarWasDownOnLastTick) {
                this.handleInteraction();
            }
        }
    };

    private handleInteraction = () => {
        this.playerHasInteractedWithThisOrgan = true;
        this.notifyParentOfInteraction();
    }
}
