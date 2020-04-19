import * as Phaser from 'phaser';
import {SceneBase} from './sceneBase';
import {Player} from '../gameObjects/player';
import {Heart} from '../gameObjects/heart';
import {StatBar} from '../gameObjects/statBar';
import {Lungs} from '../gameObjects/lungs';
import OutsideView from '../subscene/outsideView';
import Fishes from '../gameObjects/fishes';
import {Brain} from '../gameObjects/brain';
import {Stomach} from '../gameObjects/stomach';
import {Plug} from '../gameObjects/plug';
import {Water} from '../gameObjects/water';
import {PlayerState, StateManager} from '../multiplayer/stateManager';
import {listenForMultiplayerHotkeys} from '../multiplayer/multiplayer';
import HostStateManager from '../multiplayer/hostStateManager';
import {Decision} from '../gameObjects/decision';

export class Level extends SceneBase {

    private _stateManager: StateManager = new HostStateManager();
    private player: Player;
    private externalPlayer: Phaser.GameObjects.Sprite;
    private heart: Heart;
    private healthBar: StatBar;
    private lungs: Lungs;
    private breatheBar: StatBar;
    private stomach: Stomach;
    private foodBar: StatBar;
    private brain: Brain;
    private plug: Plug;
    private water: Water;
    private fishes: Fishes;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private outsideView: OutsideView;
    private spaceBarDown = false;
    private isInBrain: boolean;

    create() {
        this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');

        const leftGameWidth = this.gameWidth / 2;

        const catBackground = this.add.image(350, 510, 'catBackground');
        catBackground.scale = 1.15;

        // World bounds are rectangular so don't perfectly match catBackground.
        this.physics.world.setBounds(80, 150, 580, 830);

        this.player = new Player(this, leftGameWidth / 2, this.gameHeight / 2);
        this.externalPlayer = this.add.sprite(0, 0, 'player2');

        this.heart = new Heart(this, 420, 470);
        this.healthBar = new StatBar(this, leftGameWidth + 20, 30, 'Blood');

        this.lungs = new Lungs(this, 220, 540);
        this.breatheBar = new StatBar(this, leftGameWidth + 20, 60, 'O2');

        this.stomach = new Stomach(this, 500, 750);
        this.foodBar = new StatBar(this, leftGameWidth + 20, 90, 'Food');

        this.brain = new Brain(this, 260, 260, this.player);

        this.water = new Water(this, catBackground);
        this.plug = new Plug(this, 200, 910);

        this.physics.add.collider(this.player, this.heart);
        this.physics.add.collider(this.player, this.lungs);
        this.physics.add.collider(this.player, this.plug);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.outsideView = new OutsideView(this);

        this.fishes = new Fishes(this, leftGameWidth / 2, this.gameHeight / 2, this.player, this.stomach);

        this.brain.setAvailableDecision(this, this.wakeOrNotDecision());

        listenForMultiplayerHotkeys(this);
    }

    update() {
        if (this.stateManager.state.gameOver) {
            this.endGame();
            return;
        }

        this.stateManager.tick();

        const baseWalkingSpeed = 160;
        const walkingSpeed = this.player.y > this.water.YOfTheWaterLevel()
            ? baseWalkingSpeed / 2
            : baseWalkingSpeed;

        this.player.update(walkingSpeed, this.cursors);
        this.updateStateFromGameObjects();
        this.updateGameObjectsFromState();

        if (this.player.isTouching(this.brain)) {
            if (!this.isInBrain) {
                this.brain.showDecision();
            }
            this.isInBrain = true;
        } else {
            if (this.isInBrain) {
                this.brain.hideDecision();
            }
            this.isInBrain = false;
        }

        if (this.cursors.space.isDown) {
            this.handleSpaceBar();
            this.spaceBarDown = true;
        } else {
            this.spaceBarDown = false;
        }
    }

    private endGame() {
        this.physics.pause();
        this.player.gameOver();
    }

    private updateStateFromGameObjects() {
        this.stateManager.myPlayer = {
            holdingFish: this.player.isHoldingFish,
            position: {
                x: this.player.x,
                y: this.player.y
            }
        };
    }

    private updateGameObjectsFromState() {
        this.updateExternalPlayerFromState(this.stateManager.otherPlayer);
        this.fishes.update(this.stateManager.state.fishes, this.stateManager.state.gameTime);
        this.healthBar.update(this.stateManager.state.heart);
        this.breatheBar.update(this.stateManager.state.lungs);
        this.water.update(this.stateManager.state.waterLevel);
        this.foodBar.update(this.stateManager.state.fullness);
    }

    private updateExternalPlayerFromState(otherPlayer: PlayerState) {
        this.externalPlayer.setPosition(otherPlayer.position.x, otherPlayer.position.y);
        if (otherPlayer.holdingFish) {
            this.externalPlayer.setTexture('player2-with-fish');
        } else {
            this.externalPlayer.setTexture('player2');
        }
    }

    private handleSpaceBar() {
        if (this.bIsTouchingA(this.player, this.heart)) {
            if (!this.spaceBarDown) {
                this.beatHeart();
            }
        }
        if (this.bIsTouchingA(this.player, this.lungs)) {
            if (this.cursors.space.getDuration() > 200) {
                this.pumpLungs();
            }
        }
        if (this.bIsTouchingA(this.player, this.plug)) {
            if (this.cursors.space.getDuration() > 200) {
                this.openPlug();
            }
        }
        if (this.bIsTouchingA(this.player, this.brain)) {
            if (!this.spaceBarDown) {
                this.brain.tryPressButton();
            }
        }
    }

    private beatHeart = () => {
        this.stateManager.handleEvent({
            type: 'BEAT_HEART'
        });
    };

    private pumpLungs = () => {
        this.stateManager.handleEvent({
            type: 'PUMP_LUNGS'
        });
    };

    private openPlug = () => {
        if (this.plug.getIsPlugged()) {
            this.cursors.space.once('up', () => this.plug.plug());
            this.plug.unplug();
        }
        this.stateManager.handleEvent({
            type: 'DRAIN_PLUG'
        });
    };

    public get stateManager() {
        return this._stateManager;
    }

    public set stateManager(stateManager) {
        this._stateManager = stateManager;
    }

    private fishOrNotDecision(): Decision {
        return {
            optionA: {
                label: 'eat some fish',
                action: this.fishes.generateFishRegularlyForAWhile
            },

            optionB: {
                label: 'go back to sleep',
                action: this.goToSleep
            }
        }
    }

    private wakeOrNotDecision(): Decision {
        return {
            optionA: {
                label: 'wake up',
                action: this.wakeUp
            },

            optionB: {
                label: 'nahhh',
                action: null
            }
        }
    }

    private wakeUp = () => {
        this.brain.setAvailableDecision(this, this.fishOrNotDecision());
    }

    private goToSleep = () => {
        this.brain.setAvailableDecision(this, this.wakeOrNotDecision());
    }
}
