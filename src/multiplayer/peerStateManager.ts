import {GameState, INITIAL_STATE, PlayerPosition, StateChangeEvent, StateManager} from './stateManager';
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

    public get otherPlayerPosition() {
        return this.state.hostPlayer.position;
    };

    public set myPosition(position: PlayerPosition) {
        this.handleEvent({
            type: 'SET_PEER_PLAYER_POSITION',
            position
        });
    };

    public handleEvent = (event: StateChangeEvent) => {
        this.connection.send(event);
    };

    public tick = () => {
        // Do nothing, the host manages game state.
    };
}
