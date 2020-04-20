import {CatStatus} from '../gameObjects/catStatus';
import {
    GameObjectPosition,
    INITIAL_STATE,
    PlayerState,
    StateChangeEvent,
    StateManager,
    Virus,
    WhiteBloodCellState,
    BACKGROUND_SPEEDS
} from './stateManager';
import {DataConnection} from 'peerjs';
import {multiPlayerConfig, singlePlayerConfig} from '../gameConfig';

export default class HostStateManager implements StateManager {

    private _gameConfig = singlePlayerConfig;
    private _state = INITIAL_STATE;

    public constructor(private connection?: DataConnection) {
        if (this.connection) {
            this._gameConfig = multiPlayerConfig;
            this.handleEventsFromPeer(this.connection);
        }
        this._state.speeds.baseWalkingSpeed = this._gameConfig.baseWalkingSpeed;
        this._state.speeds.waterWalkingSpeed = this._gameConfig.waterWalkingSpeed;
        this._state.speeds.virusBaseSpeed = this._gameConfig.virusBaseSpeed;
        this._state.speeds.virusWaterSpeed = this._gameConfig.virusWaterSpeed;
        this._state.speeds.bloodCellsBaseSpeed = this._gameConfig.bloodCellsBaseSpeed;
        this._state.speeds.bloodCellsWaterSpeed = this._gameConfig.bloodCellsWaterSpeed;
    }

    public get state() {
        return this._state;
    }

    public tick = () => {
        this._state = {
            ...this._state,
            gameTime: this._state.gameTime + 1,
            gameOver: this.isGameOver(),
            heart: Math.max(this._state.heart - (this._gameConfig.bloodLossPerTick * this._state.hardModeMultiplier), 0),
            lungs: Math.max(this._state.lungs - (this._gameConfig.o2LossPerTick * this._state.hardModeMultiplier), 0),
            fullness: Math.max(this._state.fullness - (this._gameConfig.foodLossPerTick * this._state.hardModeMultiplier), 0),
            waterLevel: this.tickWaterLevel()
        };
        this.checkForQueuedEvents();
        this.reproduceViruses();
        this.setHardModeMultiplier();
        if (this.connection) {
            this.sendStateToPeer(this.connection)
        }
    };

    private isGameOver() {
        return this.state.gameOver
            || this._state.heart === 0
            || this._state.lungs === 0
            || this._state.fullness === 0;
    }

    private tickWaterLevel = () => {
        return this._state.catStatus === CatStatus.Drinking
            ? Math.min(this._state.waterLevel + (this._gameConfig.waterRisePerTick * this._state.hardModeMultiplier), 100)
            : this._state.waterLevel;
    };

    private checkForQueuedEvents = () => {
        this.maybeTransitionToQueuedState();
        this.maybeTransitionAwayFromAwake();
        this.generateAnyQueuedFish();
    };

    private maybeTransitionToQueuedState = () => {
        if (this._state.queuedCatStatus && this._state.queuedCatStatus.time <= this._state.gameTime) {
            this._state = {
                ...this._state,
                catStatus: this._state.queuedCatStatus.status,
                queuedCatStatus: undefined
            }
        }
    };

    private maybeTransitionAwayFromAwake = () => {
        if (this._state.catStatus !== CatStatus.Awake) {
            return;
        }
        const catShouldDrink = !this._state.externalEventTimes.catDrank
            || this._state.externalEventTimes.catDrank < this.gameTimeNSecondsFromNow(-10);
        if (catShouldDrink) {
            this.transitionToDrinking();
            return;
        }
        const catShouldGetIll = !this._state.externalEventTimes.catGotIll
            || this._state.externalEventTimes.catGotIll < this.gameTimeNSecondsFromNow(-35);
        if (catShouldGetIll) {
            this.transitionToIll();
            return;
        }
    };

    private transitionToDrinking = () => {
        this._state = {
            ...this._state,
            catStatus: CatStatus.Drinking,
            queuedCatStatus: {
                status: CatStatus.Awake,
                time: this.gameTimeNSecondsFromNow(3)
            },
            externalEventTimes: {
                ...this._state.externalEventTimes,
                catDrank: this._state.gameTime
            }
        }
    };

    private transitionToIll = () => {
        this._state = {
            ...this._state,
            catStatus: CatStatus.Ill,
            queuedCatStatus: null,
            externalEventTimes: {
                ...this._state.externalEventTimes,
                catGotIll: this._state.gameTime
            },
            tiledBackgroundSpeed: BACKGROUND_SPEEDS.ill,
        };
        const catMouthX = 340;
        const catMouthY = 340;
        this.placeVirus(this.generateGloballyUniqueId(), {x: catMouthX, y: catMouthY});
    };

    private generateAnyQueuedFish = () => {
        if (this._state.fishes.queuedFish) {
            const futureQueuedFish = this.state.fishes.queuedFish.filter(time => time > this._state.gameTime);
            const fishToGenerateNow = this.state.fishes.queuedFish.length - futureQueuedFish.length;
            if (fishToGenerateNow > 0) {
                this._state.fishes = {
                    ...this._state.fishes,
                    numberOfFishInPile: this._state.fishes.numberOfFishInPile + fishToGenerateNow,
                    queuedFish: futureQueuedFish
                }
            }
        }
    };

    public set myPlayer(hostPlayer: PlayerState) {
        this._state = {
            ...this._state,
            hostPlayer
        };
    };

    public get myPlayer() {
        return this._state.hostPlayer;
    }

    public get otherPlayer() {
        return this.state.peerPlayer;
    }

    public set viruses(viruses: Virus[]) {
        this._state = {
            ...this._state,
            viruses: viruses
        };
    }

    public set whiteBloodCell(whiteBloodCell: WhiteBloodCellState) {
        this._state = {
            ...this._state,
            whiteBloodCell: whiteBloodCell
        };
    };

    public handleEvent = (event: StateChangeEvent) => {
        if (event.type === 'RESTART_GAME') {
            this.restartGame();
        }
        if (event.type === 'BREATHE_LUNGS') {
            this.breathLungs();
        }
        if (event.type === 'PUMP_HEART') {
            this.pumpHeart();
        }
        if (event.type === 'DIGEST_FOOD') {
            this.digestFood();
        }
        if (event.type === 'DRAIN_PLUG') {
            this.drainPlug();
        }
        if (event.type === 'RING_ALARM') {
            this.ringAlarm();
        }
        if (event.type === 'TRANSITION_TO_AWAKE') {
            this.transitionToAwake();
        }
        if (event.type === 'TRANSITION_TO_EATING') {
            this.transitionToEating();
        }
        if (event.type === 'TAKE_FISH_FROM_PILE') {
            this.takeFishFromPile();
        }
        if (event.type === 'PLACE_VIRUS') {
            this.placeVirus(event.id, event.position);
        }
        if (event.type === 'DESTROY_VIRUS') {
            this.destroyVirus(event.id);
        }
        if (event.type === 'SET_PEER_PLAYER_STATE') {
            this.setPeerPlayerState(event.state);
        }
    };

    private restartGame = () => {
        this._state = INITIAL_STATE;
    };

    private breathLungs = () => {
        this._state = {
            ...this._state,
            lungs: Math.min(this._state.lungs + this._gameConfig.o2RisePerTick, 100),
            organInteractionTimes: {
                ...this._state.organInteractionTimes,
                lungsUsed: this._state.gameTime
            }
        };
    };

    private pumpHeart = () => {
        this._state = {
            ...this._state,
            heart: Math.min(this._state.heart + this._gameConfig.bloodRisePerPump, 100)
        };
    };

    private digestFood = () => {
        this._state = {
            ...this._state,
            fullness: Math.min(this._state.fullness + this._gameConfig.foodRisePerFish, 100)
        };
    };

    private drainPlug = () => {
        this._state = {
            ...this._state,
            waterLevel: Math.max(this._state.waterLevel - this._gameConfig.waterLossPerTick, 0),
            organInteractionTimes: {
                ...this._state.organInteractionTimes,
                plugUsed: this._state.gameTime
            }
        };
    };

    private ringAlarm = () => {
        this._state = {
            ...this._state,
            whiteBloodCell: {
                ...this._state.whiteBloodCell,
                enabled: this._state.viruses.length > 0,
            }
        };
    };

    private transitionToAwake = () => {
        this._state = {
            ...this._state,
            catStatus: CatStatus.Awake,
            externalEventTimes: {
                ...this._state.externalEventTimes,
                // Prevents cat from drinking and getting ill as soon as it wakes up.
                catDrank: this._state.gameTime,
                catGotIll: this._state.gameTime
            },
            tiledBackgroundSpeed: BACKGROUND_SPEEDS.awake,
        };
    };

    private transitionToEating = () => {
        this._state = {
            ...this._state,
            catStatus: CatStatus.Eating,
            queuedCatStatus: {
                status: CatStatus.Awake,
                time: this.gameTimeNSecondsFromNow(8)
            },
            fishes: {
                ...this._state.fishes,
                queuedFish: [
                    ...this._state.fishes.queuedFish,
                    this.gameTimeNSecondsFromNow(2),
                    this.gameTimeNSecondsFromNow(4),
                    this.gameTimeNSecondsFromNow(6)
                ]
            }
        };
    };

    private takeFishFromPile = () => {
        this._state = {
            ...this._state,
            fishes: {
                ...this._state.fishes,
                numberOfFishInPile: this._state.fishes.numberOfFishInPile - 1
            }
        };
    };

    private placeVirus = (id: string, position: GameObjectPosition) => {
        this._state = {
            ...this._state,
            viruses: [
                ...this._state.viruses,
                {
                    id,
                    position,
                    velocity: {x: 0, y: 0},
                    reproducesAt: this._state.gameTime + this._gameConfig.ticksForVirusToReproduce,
                }
            ],
        }
    };

    private destroyVirus = (id: string) => {
        const stillActiveViruses = this._state.viruses.filter(x => x.id !== id);
        this._state = {
            ...this._state,
            viruses: stillActiveViruses,
            catStatus: stillActiveViruses.length === 0 ? CatStatus.Awake : CatStatus.Ill,
            tiledBackgroundSpeed: stillActiveViruses.length === 0 ? BACKGROUND_SPEEDS.awake : BACKGROUND_SPEEDS.ill,
        };
    };

    private reproduceViruses = () => {
        this._state.viruses.filter(virus => virus.reproducesAt === this._state.gameTime)
            .forEach(virus => {
                this.handleEvent({
                    type: 'PLACE_VIRUS',
                    id: this.generateGloballyUniqueId(),
                    position: {
                        x: virus.position.x - (Math.random() * 100) - 50,
                        y: virus.position.y - (Math.random() * 100) - 50
                    },
                });
                // Make original virus reproduce again, a little later than the new one to stop batching.
                virus.reproducesAt = this._state.gameTime + (this._gameConfig.ticksForVirusToReproduce * 1.7);
            });
    };

    private setHardModeMultiplier = () => {
        const timeSinceHardMode = this._state.gameTime - this._gameConfig.hardModeStartTime;
        if (timeSinceHardMode > 0) {
            this._state.hardModeMultiplier += this._gameConfig.difficultyIncreasePerTick;
        }
    };

    private setPeerPlayerState = (peerPlayer: PlayerState) => {
        this._state = {
            ...this._state,
            peerPlayer: peerPlayer
        };
    };

    private handleEventsFromPeer = (connection: DataConnection) => {
        connection.on('data', this.handleEvent);
    };

    private sendStateToPeer = (connection: DataConnection) => {
        connection.send(this.state);
    };

    public generateGloballyUniqueId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    private gameTimeNSecondsFromNow = (seconds: number) => {
        const ticksPerSecond = 60;
        return this._state.gameTime + ticksPerSecond * seconds;
    };
}
