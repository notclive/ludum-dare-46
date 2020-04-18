export interface StateManager {
    tick: () => void;
    state: GameState;
    handleEvent: (event: StateChangeEvent) => void;
    myPlayer: PlayerState;
    otherPlayer: PlayerState;
}

export interface GameState {
    gameOver: boolean;
    gameTime: number;
    hostPlayer: PlayerState;
    peerPlayer: PlayerState;
    fishes: Fish[];
    heart: number;
    lungs: number;
    fullness: number;
    waterLevel: number;
}

export interface PlayerState {
    position: GameObjectPosition;
    holdingFish: boolean;
}

export interface GameObjectPosition {
    x: number;
    y: number;
}

export interface Fish {
    id: string;
    visibleAfterGameTime: number;
    position: GameObjectPosition;
}

export type StateChangeEvent = PumpLungs | BeatHeart | DigestFood | DrainPlug | PlaceFish | RemoveFish | SetPeerPlayerState;

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
    id: string;
    position: GameObjectPosition;
    ticksUntilVisible: number;
}

interface RemoveFish {
    type: 'REMOVE_FISH';
    id: string;
}

interface SetPeerPlayerState {
    type: 'SET_PEER_PLAYER_STATE';
    state: PlayerState;
}

export const INITIAL_STATE: GameState = {
    gameOver: false,
    gameTime: 0,
    hostPlayer: {
        position: {
            x: 500, y: 500
        },
        holdingFish: false
    },
    peerPlayer: {
        position: {
            x: -500, y: -500 // If playing single player peer will be hidden by these coordinates.
        },
        holdingFish: false
    },
    fishes: [],
    heart: 100,
    lungs: 100,
    fullness: 100,
    waterLevel: 0
};
