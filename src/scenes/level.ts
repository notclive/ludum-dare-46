import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';
import { Player } from '../gameObjects/player';
import { Heart } from '../gameObjects/heart';
import { StatBar } from '../gameObjects/statBar';
import { Lungs } from '../gameObjects/lungs';
import OutsideView from '../subscene/outsideView';
import Fishes from '../gameObjects/fishes';
import { Brain } from '../gameObjects/brain';
import { Stomach } from '../gameObjects/stomach';
import { Plug } from '../gameObjects/plug';
import { Water } from '../gameObjects/water';
import { PlayerState, StateManager } from '../state/stateManager';
import { Decision, CatStatus } from '../gameObjects/decision';
import {Viruses} from '../gameObjects/viruses';

export class Level extends SceneBase {

    private _stateManager: StateManager;
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
    private viruses: Viruses;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private outsideView: OutsideView;
    private spaceBarDown = false;
    private isInBrain: boolean;

    create(stateManager: StateManager) {
        this._stateManager = stateManager;
        this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');

        const catBackground = this.add.image(350, 510, 'catBackground');
        catBackground.scale = 1.15;

        // World bounds are rectangular so don't perfectly match catBackground.
        this.physics.world.setBounds(80, 150, 580, 830);

        this.player = new Player(this, 350, 610);
        this.externalPlayer = this.physics.add.sprite(0, 0, 'player2');

        this.heart = new Heart(this, 420, 470);
        this.healthBar = new StatBar(this, 700, 40, 'Blood');

        this.lungs = new Lungs(this, 220, 540);
        this.breatheBar = new StatBar(this, 700, 80, 'O2');

        this.stomach = new Stomach(this, 500, 750);
        this.foodBar = new StatBar(this, 700, 120, 'Food');

        this.brain = new Brain(this, 240, 260, this.player);

        this.water = new Water(this, catBackground);
        this.plug = new Plug(this, 200, 910);

        this.physics.add.collider(this.player, this.heart);
        this.physics.add.collider(this.player, this.lungs);
        this.physics.add.collider(this.player, this.plug);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.outsideView = new OutsideView(this);

        this.fishes = new Fishes(this, this.player, this.stomach);
        this.viruses = new Viruses(this, this.player, [this.player, this.externalPlayer]);
    }

    update() {
        if (this.stateManager.state.gameOver) {
            this.endGame();
            return;
        }

        this.stateManager.tick();

        const walkingSpeed = this.player.y > this.water.YOfTheWaterLevel()
            ? this.stateManager.state.waterWalkingSpeed
            : this.stateManager.state.baseWalkingSpeed;

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
        this.stateManager.viruses = this.viruses.updateVirusesMovement(this.stateManager.state.viruses);
    }

    private updateGameObjectsFromState() {
        this.updateExternalPlayerFromState(this.stateManager.otherPlayer);
        this.fishes.update(this.stateManager.state.fishes, this.stateManager.state.gameTime);
        this.viruses.update(this.stateManager.state.viruses);
        this.healthBar.update(this.stateManager.state.heart);
        this.breatheBar.update(this.stateManager.state.lungs);
        this.water.update(this.stateManager.state.waterLevel);
        this.foodBar.update(this.stateManager.state.fullness);
        this.brain.update(this, this.stateManager.state.catStatus);
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

    private wakeUp = () => {
        this.brain.setAvailableDecision(this, CatStatus.Awake);
    }

    private goToSleep = () => {
        this.brain.setAvailableDecision(this, CatStatus.Asleep);
    }

    private catchFish = () => {
        this.fishes.generateFishRegularlyForAWhile();
    }

    public mapCatStatusToDecision = (status: CatStatus) => {
        return this.decisions.find(d => d.catStatus === status);
    }

    private decisions: Decision[] = [
        {
            catStatus: CatStatus.Asleep,
            optionA: {
                label: 'wake up',
                action: this.wakeUp
            },

            optionB: {
                label: 'nahhh',
                action: null
            }
        },
        {
            catStatus: CatStatus.Awake,
            optionA: {
                label: 'eat some fish',
                action: this.catchFish
            },

            optionB: {
                label: 'go back to sleep',
                action: this.goToSleep
            }
        },
    ];
}
