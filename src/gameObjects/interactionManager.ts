import Sprite = Phaser.GameObjects.Sprite;
import GameObject = Phaser.GameObjects.GameObject;
import {Player} from './player';

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
        this.player.scene.anims.create({
            key: 'hold-spacebar',
            frames: this.player.scene.anims.generateFrameNumbers('spacebar', { frames: [2, 3, 3, 3, 3, 3, 3, 3, 3] }),
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
            if (this.interactionType === 'HOLD') {
                this.checkForHoldInteraction();
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
                .anims.play(this.getHintAnimation(), true);
        }
    };

    private getHintAnimation = () => {
        if (this.interactionType === 'PUMP') {
            return 'pump-spacebar';
        }
        if (this.interactionType === 'HOLD') {
            return 'hold-spacebar';
        }
        return 'press-spacebar';
    };

    private destroyInteractionHint = () => {
        if (this.interactionHint) {
            this.interactionHint.destroy();
            this.interactionHint = null;
        }
    };

    private checkForPumpInteraction = () => {
        if (this.cursors.space.isDown) {
            if (!this.spaceBarWasDownOnLastTick) {
                this.handleInteraction();
            }
        }
    };

    private checkForHoldInteraction() {
        if (this.cursors.space.getDuration() > 200) {
            this.handleInteraction();
        }
    }

    private handleInteraction = () => {
        this.playerHasInteractedWithThisOrgan = true;
        this.notifyParentOfInteraction();
    };
}
