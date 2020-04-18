import {
    GameState,
    INITIAL_STATE,
    GameObjectPosition,
    StateChangeEvent,
    StateManager,
    PlayerState
} from './stateManager';
import {DataConnection} from 'peerjs';

export default class PeerStateManager implements StateManager {

    private _state = INITIAL_STATE;

    public constructor(private connection: DataConnection) {
        connection.on('data', (stateFromMaster: GameState) => {
            this._state = stateFromMaster;
        });
    }

    public get state() {
        return this._state;
    }

    public set myPlayer(state: PlayerState) {
        this.handleEvent({
            type: 'SET_PEER_PLAYER_STATE',
            state
        });
    };

    public get otherPlayer() {
        return this.state.hostPlayer;
    };

    public handleEvent = (event: StateChangeEvent) => {
        this.connection.send(event);
    };

    public tick = () => {
        // Do nothing, the host manages game state.
    };
}
