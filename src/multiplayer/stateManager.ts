export interface StateManager {
    tick: () => void;
    state: GameState;
    handleEvent: (event: StateChangeEvent) => void;
    myPosition: GameObjectPosition;
    otherPlayerPosition: GameObjectPosition;
}

export interface GameState {
    gameOver: boolean;
    hostPlayer: PlayerState;
    peerPlayer: PlayerState;
    fish: GameObjectPosition[];
    heart: number;
    lungs: number;
    fullness: number;
    waterLevel: number;
}

interface PlayerState {
    position: GameObjectPosition;
    holdingFish: boolean;
}

export interface GameObjectPosition {
    x: number;
    y: number;
}

export type StateChangeEvent = PumpLungs | BeatHeart | DigestFood | DrainPlug | PlaceFish | RemoveFish | SetPeerPlayerPosition;

interface PumpLungs {
    type: 'PUMP_LUNGS';
}

interface BeatHeart {
    type: 'BEAT_HEART';
}

interface DigestFood {
    type: 'DIGEST_FOOD';
}

interface DrainPlug {
    type: 'DRAIN_PLUG';
}

interface PlaceFish {
    type: 'PLACE_FISH';
    position: GameObjectPosition;
    ticksUntilVisible: number;
}

interface RemoveFish {
    type: 'REMOVE_FISH';
    id: number;
}

interface SetPeerPlayerPosition {
    type: 'SET_PEER_PLAYER_POSITION';
    position: GameObjectPosition;
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
    fish: [],
    heart: 100,
    lungs: 100,
    fullness: 100,
    waterLevel: 0
};
