export interface StateManager {
    tick: () => void;
    state: GameState;
    handleEvent: (event: StateChangeEvent) => void;
    myPosition: PlayerPosition;
    otherPlayerPosition: PlayerPosition;
}

export interface GameState {
    gameOver: boolean;
    hostPlayer: PlayerState;
    peerPlayer: PlayerState;
    heart: number;
    lungs: number;
}

interface PlayerState {
    position: PlayerPosition;
    holdingFish: boolean;
}

export interface PlayerPosition {
    x: number;
    y: number
}

export type StateChangeEvent = PumpLungs | BeatHeart | SetPeerPlayerPosition;

interface PumpLungs {
    type: 'PUMP_LUNGS';
}

interface BeatHeart {
    type: 'BEAT_HEART';
}

interface SetPeerPlayerPosition {
    type: 'SET_PEER_PLAYER_POSITION';
    position: PlayerPosition;
}

export const INITIAL_STATE: GameState = {
    gameOver: false,
    hostPlayer: {
        position: {
            x: 500, y: 500
        },
        holdingFish: false
    },
    peerPlayer: {
        position: {
            x: 500, y: 500
        },
        holdingFish: false
    },
    heart: 100,
    lungs: 100
};
