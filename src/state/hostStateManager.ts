import {CatStatus} from '../gameObjects/catStatus';
import {
    GameObjectPosition,
    INITIAL_STATE,
    PlayerState,
    StateChangeEvent,
    StateManager,
    Virus,
    WhiteBloodCellState
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
            heart: Math.max(this._state.heart - this._gameConfig.bloodLossPerTick, 0),
            lungs: Math.max(this._state.lungs - this._gameConfig.o2LossPerTick, 0),
            fullness: Math.max(this._state.fullness - this._gameConfig.foodLossPerTick, 0),
            waterLevel: Math.min(this._state.waterLevel + this._gameConfig.waterRisePerTick, 100)
        };
        this.reproduceViruses();
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

    public set myPlayer(hostPlayer: PlayerState) {
        this._state = {
            ...this._state,
            hostPlayer
        };
    };

    public get otherPlayer() {
        return this.state.peerPlayer;
    };

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
        if (event.type === 'PUMP_LUNGS') {
            this.pumpLungs();
        }
        if (event.type === 'BEAT_HEART') {
            this.beatHeart();
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
        if (event.type === 'PLACE_FISH') {
            this.placeFish(event.id, event.position, event.ticksUntilVisible);
        }
        if (event.type === 'REMOVE_FISH') {
            this.removeFish(event.id);
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
        if (event.type === 'SET_CAT_STATUS') {
            this.setCatStatus(event.catStatus);
        }
    };

    private restartGame = () => {
        this._state = INITIAL_STATE;
    };

    private pumpLungs = () => {
        this._state = {
            ...this._state,
            lungs: Math.min(this._state.lungs + this._gameConfig.o2RisePerTick, 100)
        };
    };

    private beatHeart = () => {
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
                enabled: true,
            }
        };
    };

    private placeFish = (id: string, position: GameObjectPosition, ticksUntilVisible: number) => {
        this._state = {
            ...this._state,
            fishes: [
                ...this._state.fishes,
                {
                    id,
                    position,
                    visibleAfterGameTime: this._state.gameTime + ticksUntilVisible
                }
            ]
        };
    };

    private removeFish = (fishId: string) => {
        this._state = {
            ...this._state,
            fishes: this._state.fishes.filter(fish => fish.id !== fishId)
        };
    };

    private setCatStatus = (catStatus: CatStatus) => {
        this._state = {
            ...this._state,
            catStatus: catStatus
        }
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
            ]
        }
    };

    private destroyVirus = (id: string) => {
        const newViruses = this._state.viruses.filter(x => x.id !== id);
        this._state = {
            ...this._state,
            viruses: newViruses,
        }
        
        if (newViruses.length === 0) {
            this.handleEvent({
                type: 'SET_CAT_STATUS',
                catStatus: CatStatus.Awake
            });
        }
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
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
}
