export interface StateManager {
    tick: () => void;
    state: GameState;
    handleEvent: (event: StateChangeEvent) => void;
    myPosition: GameObjectPosition;
    otherPlayerPosition: GameObjectPosition;
}

export interface GameState {
    gameOver: boolean;
    clock: number;
    hostPlayer: PlayerState;
    peerPlayer: PlayerState;
    fishes: Fish[];
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

interface Fish {
    id: number;
    visibleAfterGameTime: number;
    position: GameObjectPosition;
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
    id: number;
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
    clock: 0,
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
    fishes: [],
    heart: 100,
    lungs: 100,
    fullness: 100,
    waterLevel: 0
};
