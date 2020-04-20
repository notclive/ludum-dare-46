import Sprite = Phaser.GameObjects.Sprite;
import GameObject = Phaser.GameObjects.GameObject;
import {Player} from './player';
import {GameState} from '../state/stateManager';
import OrganBase from './organBase';

export type InteractionType = 'PUMP' | 'HOLD' | 'PRESS';

export class InteractionManager {

    private readonly cursors = this.player.scene.input.keyboard.createCursorKeys();
    private interactionXOffset = 0;
    private interactionYOffset = 0;
    private playerHasInteractedWithThisOrgan = false;
    private spaceBarWasDownOnLastTick = false;
    private interactionHint: GameObject;
    private holdSound: Phaser.Sound.WebAudioSound;
    private pumpSound: Phaser.Sound.WebAudioSound;

    public constructor(
        private organ: OrganBase,
        private player: Player,
        private interactionType: InteractionType,
        private notifyParentOfInteraction: () => void,
        private interactionEffectsConfiguration?: InteractionEffectsConfiguration,
        private pumpSoundKey?: string,
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

    public moveInteractionHint = (xOffset: number, yOffset: number) => {
        this.interactionXOffset = xOffset;
        this.interactionYOffset = yOffset;
        return this;
    };

    public update = (state: GameState) => {
        const playerIsTouchingOrgan = this.player.isTouching(this.organ);
        this.showOrHideInteractionHint(playerIsTouchingOrgan, this.organ.interactionIsEnabled);
        this.pickAnimationsAndSounds(state);
        if (playerIsTouchingOrgan) {
            this.checkForInteraction();
        }
        this.spaceBarWasDownOnLastTick = this.cursors.space.isDown;
    };

    public stopSounds = () => {
        this.holdSound?.stop();
    }

    private showOrHideInteractionHint = (playerIsTouchingOrgan: boolean, interactionIsEnabled: boolean) => {
        if (playerIsTouchingOrgan && !this.playerHasInteractedWithThisOrgan && interactionIsEnabled) {
            this.drawInteractionHint();
        } else {
            this.destroyInteractionHint();
        }
    };

    private drawInteractionHint = () => {
        if (!this.interactionHint) {
            this.interactionHint = this.player.scene.add
                .sprite(this.organ.x + this.interactionXOffset, this.organ.y + this.interactionYOffset, 'spacebar')
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

    private pickAnimationsAndSounds = ({organInteractionTimes, gameTime}: GameState) => {
        if (this.interactionEffectsConfiguration) {
            const lastInteractionTime = this.interactionEffectsConfiguration.pickInteractionTime(organInteractionTimes);

            // I don't know how reliably a multiplayer peer will call update for every game state.
            // A buffer of 10 ticks makes it very likely a peer will notice that the plug was used.
            const interactionIsCurrentlyHappening = lastInteractionTime && lastInteractionTime > gameTime - 10;

            if (this.interactionEffectsConfiguration.interactionAnimation) {
                this.pickOrganAnimation(interactionIsCurrentlyHappening);
            }

            if (this.interactionEffectsConfiguration.holdSound) {
                this.playOrPauseOrganSoundEffect(interactionIsCurrentlyHappening);
            }
        }
    };

    private pickOrganAnimation(interactionIsCurrentlyHappening: boolean) {
        const animation = interactionIsCurrentlyHappening
            ? this.interactionEffectsConfiguration.interactionAnimation
            : this.interactionEffectsConfiguration.normalAnimation;
        this.organ.anims.play(animation, true);
    }

    private playOrPauseOrganSoundEffect(interactionIsCurrentlyHappening: boolean) {
        if (interactionIsCurrentlyHappening && !this.holdSound?.isPlaying) {
            const key = this.interactionEffectsConfiguration.holdSound;
            this.holdSound = this.player.scene.sound.add(key, {loop: true}) as Phaser.Sound.WebAudioSound;
            this.holdSound.setVolume(1);
            this.holdSound.play();
        }

        if (!interactionIsCurrentlyHappening && this.holdSound && !this.holdSound.isPaused) {
            this.holdSound.pause();
        }
    }

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
                if (this.pumpSoundKey) {
                    this.playPumpSound();
                }
            }
        }
    };

    private playPumpSound = () => {
        if (this.pumpSound?.isPlaying) {
            return;
        }
        this.pumpSound = this.player.scene.sound.add(this.pumpSoundKey, {loop: false}) as Phaser.Sound.WebAudioSound;
        this.pumpSound.setVolume(2);
        this.pumpSound.play();
    }

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

interface InteractionEffectsConfiguration {
    pickInteractionTime: (OrganInteractionTimes) => number;
    holdSound: string;
    normalAnimation?: string;
    interactionAnimation?: string;
}
