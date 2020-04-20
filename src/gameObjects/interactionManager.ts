import Sprite = Phaser.GameObjects.Sprite;
import GameObject = Phaser.GameObjects.GameObject;
import {Player} from './player';
import {GameState} from '../state/stateManager';

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
        private notifyParentOfInteraction: () => void,
        private interactionAnimationConfiguration?: InteractionAnimationConfiguration
    ) {
        this.player.scene.anims.create({
            key: 'pump-spacebar',
            frames: this.player.scene.anims.generateFrameNumbers('spacebar', {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1
        });
        this.player.scene.anims.create({
            key: 'hold-spacebar',
            frames: this.player.scene.anims.generateFrameNumbers('spacebar', {frames: [2, 3, 3, 3, 3, 3, 3, 3, 3]}),
            frameRate: 3,
            repeat: -1
        });
        this.player.scene.anims.create({
            key: 'press-spacebar',
            frames: this.player.scene.anims.generateFrameNumbers('spacebar', {frames: [4, 5, 5, 5, 5]}),
            frameRate: 3,
            repeat: -1
        });
    }

    public update = (state: GameState) => {
        const playerIsTouchingOrgan = this.player.isTouching(this.organ);
        this.showOrHideInteractionHint(playerIsTouchingOrgan);
        this.pickOrganAnimation(state);
        if (playerIsTouchingOrgan) {
            this.checkForInteraction();
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

    private pickOrganAnimation = ({organInteractionTimes, gameTime}: GameState) => {
        if (this.interactionAnimationConfiguration) {
            const lastInteractionTime = this.interactionAnimationConfiguration.pickInteractionTime(organInteractionTimes);
            // I don't know how reliably a multiplayer peer will call update for every game state.
            // A buffer of 10 ticks makes it very likely a peer will notice that the plug was used.
            const interactionIsCurrentlyHappening = lastInteractionTime && lastInteractionTime > gameTime - 10;
            const animation = interactionIsCurrentlyHappening
                ? this.interactionAnimationConfiguration.interactionAnimation
                : this.interactionAnimationConfiguration.normalAnimation;
            this.organ.anims.play(animation, true);
        }
    };

    private checkForInteraction = () => {
        // Pump and press are the same, they only differ in the hint.
        if (this.interactionType === 'PUMP' || this.interactionType === 'PRESS') {
            this.checkForPumpInteraction();
        }
        if (this.interactionType === 'HOLD') {
            this.checkForHoldInteraction();
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

interface InteractionAnimationConfiguration {
    pickInteractionTime: (OrganInteractionTimes) => number;
    normalAnimation: string;
    interactionAnimation: string;
}
