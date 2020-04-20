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
    private isInBrain: boolean;
    private currentCatStatusForMusic = CatStatus.Asleep;

    public player: Player;

    create(stateManager: StateManager) {
        this._stateManager = stateManager;
        this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');
        this.setMusic('sleep');

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

        this.fishes = new Fishes(this);
        this.viruses = new Viruses(this, this.player, [this.player, this.externalPlayer]);
        this.whiteBloodCell = new WhiteBloodCell(this, this.alarm.x - 25, this.alarm.y - 30, this.viruses);
    }

    update() {
        if (this.stateManager.state.gameOver) {
            // I'm hoping that starting another scene will tear down everything in this scene.
            this.scene.start('GameOver', {stateManager: this.stateManager, music: this.music});
            // Reset the music to stop it clashing when restarting the game.
            this.music = null;
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
    }

    private updateStateFromGameObjects() {
        this.stateManager.myPlayer = {
            ...this.stateManager.myPlayer,
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
        // Must update the music before updating the viruses, as it checks how many
        // there currently are compared to how many there will be
        this.updateMusicFromState();

        this.updateExternalPlayerFromState(this.stateManager.otherPlayer);
        this.fishes.update(this.stateManager.state);
        this.alarm.update(this.stateManager.state);
        this.viruses.update(this.stateManager.state.viruses);
        this.whiteBloodCell.update(this.stateManager.state.whiteBloodCell);
        this.heart.update(this.stateManager.state);
        this.healthBar.update(this.stateManager.state.heart);
        this.lungs.update(this.stateManager.state);
        this.breatheBar.update(this.stateManager.state.lungs);
        this.plug.update(this.stateManager.state);
        this.water.update(this.stateManager.state.waterLevel);
        this.stomach.update(this.stateManager.state);
        this.foodBar.update(this.stateManager.state.fullness);
        this.brain.update(this.stateManager.state);
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

    public get stateManager() {
        return this._stateManager;
    }

    private transitionToAwake = () => {
        this.stateManager.handleEvent({
            type: 'TRANSITION_TO_AWAKE'
        });
    };

    private transitionToEating = () => {
        this.stateManager.handleEvent({
            type: 'TRANSITION_TO_EATING'
        });
    };

    private updateMusicFromState = () => {
        const numberOfExistingViruses = this.viruses.getChildren().length;
        const numberOfNewViruses = this.stateManager.state.viruses.length;
        const newCatStatus = this.stateManager.state.catStatus;
        if (numberOfExistingViruses === 0 && numberOfNewViruses > 0) {
            this.setMusic('fast', 500);
        }
        else if (numberOfExistingViruses > 0 && numberOfNewViruses === 0) {
            this.setMusic('regular', 1000);
        }
        else if (this.currentCatStatusForMusic === CatStatus.Asleep && newCatStatus !== CatStatus.Asleep) {
            this.setMusic('regular');
        }
        this.currentCatStatusForMusic = newCatStatus;
    };

    private setMusic = (key: 'sleep' | 'regular' | 'fast', fadeTimeMillis = 4000) => {
        if (!this.music || this.music.key !== key) {
            const music = this.sound.add(key, {loop: true}) as Phaser.Sound.WebAudioSound;
            this.setNewMusicWithFade(music, fadeTimeMillis);
        }
    };

    public mapCatStatusToDecision = (status: CatStatus) => {
        return this.decisions.find(d => d.catStatuses.includes(status));
    }

    private decisions: Decision[] = [
        {
            catStatuses: [CatStatus.Asleep],
            optionA: {
                label: 'wake up',
                action: this.transitionToAwake
            },

            optionB: {
                label: 'nahhh',
                action: () => {}
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
                action: this.transitionToEating
            },

            optionB: {
                label: 'keep chillin\'',
                action: () => {}
            }
        },
    ];
}
