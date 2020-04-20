import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';
import { Player } from '../gameObjects/player';
import { Mouth } from '../gameObjects/mouth';
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
import { Decision } from '../gameObjects/decision';
import {Viruses} from '../gameObjects/viruses';
import { Alarm } from '../gameObjects/alarm';
import { WhiteBloodCell } from '../gameObjects/whiteBloodCell';
import { CatStatus } from '../gameObjects/catStatus';

export class Level extends SceneBase {

    private _stateManager: StateManager;
    private externalPlayer: Phaser.GameObjects.Sprite;
    private mouth: Mouth;
    private heart: Heart;
    private healthBar: StatBar;
    private lungs: Lungs;
    private breatheBar: StatBar;
    private stomach: Stomach;
    private foodBar: StatBar;
    private brain: Brain;
    private alarm: Alarm;
    private plug: Plug;
    private water: Water;
    private fishes: Fishes;
    private viruses: Viruses;
    private whiteBloodCell: WhiteBloodCell;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private outsideView: OutsideView;
    private spaceBarDown = false;
    private isInBrain: boolean;

    private drinkingInterval: NodeJS.Timeout;
    private drinkingTimeout: NodeJS.Timeout;
    private illnessInterval: NodeJS.Timeout;

    public player: Player;

    create(stateManager: StateManager) {
        this._stateManager = stateManager;
        this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');

        const catBackground = this.add.image(350, 510, 'catBackground');
        catBackground.scale = 1.15;

        // World bounds are rectangular so don't perfectly match catBackground.
        this.physics.world.setBounds(80, 150, 580, 830);

        this.player = new Player(this, 350, 610);
        this.externalPlayer = this.physics.add.sprite(0, 0, 'player2');

        this.mouth = new Mouth(this, 350, 360);

        this.heart = new Heart(this, 420, 470);
        this.healthBar = new StatBar(this, 700, 40, 'Blood');

        this.lungs = new Lungs(this, 235, 545);
        this.breatheBar = new StatBar(this, 700, 80, 'O2');

        this.stomach = new Stomach(this, 500, 750);
        this.foodBar = new StatBar(this, 700, 120, 'Food');

        this.brain = new Brain(this, 240, 260, this.player);
        this.alarm = new Alarm(this, 485, 335);

        this.water = new Water(this, catBackground);
        this.plug = new Plug(this, 200, 910);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.outsideView = new OutsideView(this);

        this.fishes = new Fishes(this, this.player, this.stomach);
        this.viruses = new Viruses(this, this.player, [this.player, this.externalPlayer]);
        this.whiteBloodCell = new WhiteBloodCell(this, this.alarm.x - 25, this.alarm.y - 30, this.viruses);
    }

    update() {
        if (this.stateManager.state.gameOver) {
            // I'm hoping that starting another scene will tear down everything in this scene.
            this.scene.start('GameOver', this.stateManager);
            return;
        }

        this.stateManager.tick();

        const walkingSpeed = this.player.y > this.water.YOfTheWaterLevel()
            ? this.stateManager.state.speeds.waterWalkingSpeed
            : this.stateManager.state.speeds.baseWalkingSpeed;

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

    private updateStateFromGameObjects() {
        this.stateManager.myPlayer = {
            holdingFish: this.player.isHoldingFish,
            position: {
                x: this.player.x,
                y: this.player.y
            }
        };
        this.stateManager.viruses = this.viruses.getUpdatedGameState(
            this.stateManager.state.viruses,
            this.stateManager.state.speeds.virusBaseSpeed,
            this.stateManager.state.speeds.virusWaterSpeed,
            this.water.YOfTheWaterLevel());
        this.stateManager.whiteBloodCell = this.whiteBloodCell.getUpdatedGameState(
            this.stateManager.state.whiteBloodCell,
            this.stateManager.state.viruses,
            this.stateManager.state.speeds.bloodCellsBaseSpeed,
            this.stateManager.state.speeds.bloodCellsWaterSpeed,
            this.water.YOfTheWaterLevel());
    }

    private updateGameObjectsFromState() {
        this.updateExternalPlayerFromState(this.stateManager.otherPlayer);
        this.fishes.update(this.stateManager.state.fishes, this.stateManager.state.gameTime);
        this.alarm.update(this.stateManager.state);
        this.viruses.update(this.stateManager.state.viruses);
        this.whiteBloodCell.update(this.stateManager.state.whiteBloodCell);
        this.heart.update(this.stateManager.state);
        this.healthBar.update(this.stateManager.state.heart);
        this.lungs.update(this.stateManager.state);
        this.breatheBar.update(this.stateManager.state.lungs);
        this.plug.update(this.stateManager.state);
        this.water.update(this.stateManager.state.waterLevel);
        this.foodBar.update(this.stateManager.state.fullness);
        this.brain.update(this, this.stateManager.state.catStatus);
        this.outsideView.update(this.stateManager.state.catStatus);
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
        if (this.bIsTouchingA(this.player, this.brain)) {
            if (!this.spaceBarDown) {
                this.brain.tryPressButton();
            }
        }
    }

    public get stateManager() {
        return this._stateManager;
    }

    private setCatStatus(catStatus: CatStatus) {
        if (![CatStatus.Awake, CatStatus.Drinking].includes(catStatus)) {
            this.clearDrinkTimeouts();
        }

        this.stateManager.handleEvent({
            type: 'SET_CAT_STATUS',
            catStatus: catStatus
        });
    }

    private wakeUp = () => {
        this.setCatStatus(CatStatus.Awake);
        this.drinkPeriodically();

        if (!this.illnessInterval) {
            this.illnessInterval = setInterval(() => {
                this.becomeIll();
            }, 60 * 1000);
        }
    }

    private becomeIll = () => {
        this.setCatStatus(CatStatus.Ill);
        this.viruses.createNewVirus();
    }

    private drinkPeriodically = () => {
        const durationOfEachDrink = 3 * 1000;
        const timeBetweenDrinks = 10 * 1000;

        this.drinkingInterval = setInterval(() => {
            this.setCatStatus(CatStatus.Drinking);
            this.drinkingTimeout = setTimeout(() => {
                this.setCatStatus(CatStatus.Awake);
            }, durationOfEachDrink)
        }, timeBetweenDrinks)
    }

    private clearDrinkTimeouts = () => {
        clearInterval(this.drinkingInterval);
        clearTimeout(this.drinkingTimeout);
    }

    private eatFish = () => {
        const generateFishDurationInSeconds = 40;

        this.fishes.generateFishRegularlyForNSeconds(generateFishDurationInSeconds);
        this.setCatStatus(CatStatus.Eating);

        setTimeout(() => {
            this.wakeUp();
        }, generateFishDurationInSeconds * 1000)
    }

    public mapCatStatusToDecision = (status: CatStatus) => {
        return this.decisions.find(d => d.catStatuses.includes(status));
    }

    private decisions: Decision[] = [
        {
            catStatuses: [CatStatus.Asleep],
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
            catStatuses: [
                CatStatus.Awake,
                CatStatus.Drinking,
                CatStatus.Eating,
                CatStatus.LickingSomething,
                CatStatus.Ill,
            ],
            optionA: {
                label: 'eat some fish',
                action: this.eatFish
            },

            optionB: {
                label: 'keep chillin\'',
                action: null
            }
        },
    ];
}
