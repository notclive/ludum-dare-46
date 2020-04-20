import * as Phaser from 'phaser';
import {SceneBase} from './sceneBase';
import {Player} from '../gameObjects/player';
import {Mouth} from '../gameObjects/mouth';
import {Heart} from '../gameObjects/heart';
import {StatBar} from '../gameObjects/statBar';
import {Lungs} from '../gameObjects/lungs';
import OutsideView from '../subscene/outsideView';
import Fishes from '../gameObjects/fishes';
import {Brain} from '../gameObjects/brain';
import {Stomach} from '../gameObjects/stomach';
import {Plug} from '../gameObjects/plug';
import {Water} from '../gameObjects/water';
import {StateManager} from '../state/stateManager';
import {Decision} from '../gameObjects/decision';
import {Viruses} from '../gameObjects/viruses';
import {Alarm} from '../gameObjects/alarm';
import {WhiteBloodCell} from '../gameObjects/whiteBloodCell';
import {CatStatus} from '../gameObjects/catStatus';
import {Mute} from '../gameObjects/mute';

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
    private outsideView: OutsideView;
    private isInBrain: boolean;
    private currentCatStatusForMusic = CatStatus.Asleep;

    public player: Player;

    private tiledBackground: Phaser.GameObjects.TileSprite;

    create(config: {stateManager: StateManager, muteButton: Mute}) {
        this._stateManager = config.stateManager;

        this.tiledBackground = this.add.tileSprite(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth, this.gameHeight, 'stars-background');

        this.setMuteButton(config.muteButton);
        this.setMusic('sleep');

        const catBackground = this.add.image(350, 510, 'catBackground');
        catBackground.scale = 1.15;

        // World bounds are rectangular so don't perfectly match catBackground.
        this.physics.world.setBounds(80, 150, 580, 830);

        this.water = new Water(this, catBackground);
        this.player = new Player(this, true, this.water, 350, 610);
        this.externalPlayer = new Player(this, false, this.water, 0, 0);

        this.mouth = new Mouth(this, 350, 350);
        this.heart = new Heart(this, 460, 550);
        this.lungs = new Lungs(this, 240, 540);
        this.stomach = new Stomach(this, 500, 780);
        this.brain = new Brain(this, 280, 240, this.player);
        this.alarm = new Alarm(this, 485, 335);
        this.plug = new Plug(this, 200, 910);

        this.healthBar = new StatBar(this, 775, 50, 'Blood');
        this.breatheBar = new StatBar(this, 950, 50, 'Oxygen');
        this.foodBar = new StatBar(this, 1125, 50, 'Food');

        this.outsideView = new OutsideView(this);

        this.fishes = new Fishes(this);
        this.viruses = new Viruses(this, this.player, [this.player, this.externalPlayer]);
        this.whiteBloodCell = new WhiteBloodCell(this, this.alarm.x - 25, this.alarm.y - 30, this.viruses);
    }

    update() {
        if (this.stateManager.state.gameOver) {
            this.plug.stopSounds();
            this.lungs.stopSounds();
            // I'm hoping that starting another scene will tear down everything in this scene.
            this.scene.start('GameOver', {stateManager: this.stateManager, music: this.music, muteButton: this.mute});
            // Reset the music to stop it clashing when restarting the game.
            this.music = null;
            return;
        }

        this.stateManager.tick();

        this.tiledBackground.tilePositionX += this.stateManager.state.tiledBackgroundSpeed;

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

        this.player.update(this.stateManager.state);
        this.externalPlayer.update(this.stateManager.state);
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
        this.mouth.update(this.stateManager.state);
        this.outsideView.update(this.stateManager.state.catStatus);
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
        } else if (numberOfExistingViruses > 0 && numberOfNewViruses === 0) {
            this.setMusic('regular', 1000);
        } else if (this.currentCatStatusForMusic === CatStatus.Asleep && newCatStatus !== CatStatus.Asleep) {
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
                action: () => {
                }
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
                action: () => {
                }
            }
        },
    ];
}
