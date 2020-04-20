import {Player} from './player';
import {DecisionBox} from './decisionBox';
import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import {DecisionButton} from './decisionButton';
import {Level} from '../scenes/level';
import {Decision} from './decision';
import {CatStatus} from './catStatus';
import {InteractionManager} from './interactionManager';
import {GameState} from '../state/stateManager';
import {OrganShaker} from './organShaker';
import OrganBase from './organBase';

export class Brain extends OrganBase {

    private readonly shaker = new OrganShaker(this);
    private readonly interactionManager = new InteractionManager(
        this,
        this.scene.player,
        'PRESS',
        () => {
            this.tryPressButton();
        }
    ).moveInteractionHint(0, -75);

    private decisionBox: DecisionBox;
    private buttonA: DecisionButton;
    private buttonB: DecisionButton;
    private currentDecision: Decision;
    private decisionIsVisible: boolean;

    constructor(public scene: Level, x: number, y: number, private player: Player) {
        super(scene, x, y, 'brain');

        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);

        this.scene.anims.create({
            key: 'brain-slowPulse',
            frames: this.scene.anims.generateFrameNumbers('brain', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.play('brain-slowPulse', true);
    }

    private tryPressButton = () => {
        if (!this.decisionIsVisible) {
            return;
        }

        if (this.player.isTouching(this.buttonA)) {
            this.currentDecision.optionA.action();
            this.hideDecision();
        }
        else if (this.player.isTouching(this.buttonB)) {
            this.currentDecision.optionB.action();
            this.hideDecision();
        }
    };

    showDecision() {
        if (!this.decisionIsVisible) {
            this.decisionBox.show();
            this.buttonA.show();
            this.buttonB.show();

            this.decisionIsVisible = true;
        }
    }

    hideDecision() {
        if (this.decisionIsVisible) {
            this.decisionBox.hide();
            this.buttonA.hide();
            this.buttonB.hide();

            this.decisionIsVisible = false;
        }
    }

    update(state: GameState) {
        this.shaker.shakeIfUrgent(this.calculateUrgency(state));
        this.interactionManager.update(state);

        if (this.currentDecision?.catStatuses.includes(state.catStatus)){
            return;
        }
        this.currentDecision = this.scene.mapCatStatusToDecision(state.catStatus);

        //TODO: Not sure how to destroy these things, rather than just hide them.
        this.decisionBox?.hide();
        this.buttonA?.hide();
        this.buttonB?.hide();

        this.decisionBox = new DecisionBox(this.scene, 750, 350, this.currentDecision);
        this.buttonA = new DecisionButton(this.scene, this.x - 30, this.y, 'buttonA');
        this.buttonB = new DecisionButton(this.scene, this.x + 24, this.y - 33, 'buttonB');
    }

    private calculateUrgency = (state: GameState) => {
        const fishAreAvailable = state.catStatus === CatStatus.Eating
            || state.fishes.numberOfFishInPile > 0
            || this.scene.stateManager.myPlayer.holdingFish;
        if (fishAreAvailable) {
            return 0;
        }
        // +20 as players often don't work out that the brain is needed to fill hunger.
        return (100 - state.fullness) + 20;
    };
}
