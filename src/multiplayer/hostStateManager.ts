import {INITIAL_STATE, PlayerPosition, StateChangeEvent, StateManager} from './stateManager';
import {DataConnection} from 'peerjs';

export default class HostStateManager implements StateManager {

    private _state = INITIAL_STATE;

    public constructor(private connection?: DataConnection) {
        if (this.connection) {
            this.handleEventsFromPeer(this.connection);
        }
    }

    public get state() {
        return this._state;
    }

    public tick = () => {
        this._state = {
            ...this._state,
            gameOver: this.isGameOver(),
            heart: Math.max(this._state.heart - 0.1, 0),
            lungs: Math.max(this._state.lungs - 0.05, 0),
            fullness: Math.max(this._state.fullness - 0.01, 0),
            waterLevel: Math.min(this._state.waterLevel + 0.03, 100)
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

    public set myPosition(position: PlayerPosition) {
        this._state = {
            ...this._state,
            hostPlayer: {
                ...this._state.hostPlayer,
                position: position
            }
        };
    };

    public get otherPlayerPosition() {
        return this.state.peerPlayer.position;
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
        if (event.type === 'SET_PEER_PLAYER_POSITION') {
            this.setPeerPlayerPosition(event.position);
        }
    };

    private pumpLungs = () => {
        this._state = {
            ...this._state,
            lungs: Math.min(this._state.lungs + 0.5, 100)
        };
    };

    private beatHeart = () => {
        this._state = {
            ...this._state,
            heart: Math.min(this._state.heart + 10, 100)
        };
    };

    private digestFood = () => {
        this._state = {
            ...this._state,
            fullness: Math.min(this._state.fullness + 20, 100)
        };
    };

    private drainPlug = () => {
        this._state = {
            ...this._state,
            waterLevel: Math.max(this._state.waterLevel - 0.8, 0)
        };
    };

    private setPeerPlayerPosition = (position: PlayerPosition) => {
        this._state = {
            ...this._state,
            peerPlayer: {
                ...this.state.peerPlayer,
                position
            }
        };
    };

    private handleEventsFromPeer = (connection: DataConnection) => {
        connection.on('data', this.handleEvent);
    };

    private sendStateToPeer = (connection: DataConnection) => {
        connection.send(this.state);
    };
}
