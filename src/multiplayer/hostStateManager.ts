import {CatStatus} from '../gameObjects/decision';
import {GameObjectPosition, INITIAL_STATE, PlayerState, StateChangeEvent, StateManager} from './stateManager';
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
        this._state.baseWalkingSpeed = this._gameConfig.baseWalkingSpeed;
        this._state.waterWalkingSpeed = this._gameConfig.waterWalkingSpeed;
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

    public handleEvent = (event: StateChangeEvent) => {
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
        if (event.type === 'PLACE_FISH') {
            this.placeFish(event.id, event.position, event.ticksUntilVisible);
        }
        if (event.type === 'REMOVE_FISH') {
            this.removeFish(event.id);
        }
        if (event.type === 'SET_PEER_PLAYER_STATE') {
            this.setPeerPlayerState(event.state);
        }
        if (event.type === 'SET_CAT_STATUS') {
            this.setCatStatus(event.catStatus);
        }
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
            waterLevel: Math.max(this._state.waterLevel - this._gameConfig.waterLossPerTick, 0)
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
    }

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
}
