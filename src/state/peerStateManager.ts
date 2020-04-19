import {
    GameState,
    INITIAL_STATE,
    GameObjectPosition,
    StateChangeEvent,
    StateManager,
    PlayerState,
    Virus,
    WhiteBloodCellState
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

    public set viruses(viruses: Virus[]) {
        // Do nothing, handled by host
    };

    public set whiteBloodCell(whiteBloodCell: WhiteBloodCellState) {
        // Do nothing, handled by host
    };

    public handleEvent = (event: StateChangeEvent) => {
        this.connection.send(event);
    };

    public tick = () => {
        // Do nothing, the host manages game state.
    };

    public generateGloballyUniqueId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
}
