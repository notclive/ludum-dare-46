import {GameState, INITIAL_STATE, PlayerPosition, StateChangeEvent, StateManager} from './stateManager';
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
            gameOver: this.state.gameOver || this._state.heart === 0 || this._state.lungs === 0,
            heart: Math.max(this._state.heart - 0.1, 0),
            lungs: Math.max(this._state.lungs - 0.05, 0)
        };
        if (this.connection) {
            this.sendStateToPeer(this.connection)
        }
    };

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
        if (event.type === 'SET_PEER_PLAYER_POSITION') {
            this.setPeerPlayerPosition(event.position);
        }
    };

    private pumpLungs = () => {
        this._state = {
            ...this._state,
            lungs: Math.min(this._state.lungs + 0.5, 100)
        }
    };

    private beatHeart = () => {
        this._state = {
            ...this._state,
            heart: Math.min(this._state.heart + 10, 100)
        }
    };

    private setHostPlayerPosition = (position: PlayerPosition) => {
        this._state = {
            ...this._state,
            hostPlayer: {
                ...this.state.hostPlayer,
                position
            }
        }
    };

    private setPeerPlayerPosition = (position: PlayerPosition) => {
        this._state = {
            ...this._state,
            peerPlayer: {
                ...this.state.peerPlayer,
                position
            }
        }
    };

    private handleEventsFromPeer = (connection: DataConnection) => {
        connection.on('data', this.handleEvent);
    };

    private sendStateToPeer = (connection: DataConnection) => {
        connection.send(this.state);
    };
}
