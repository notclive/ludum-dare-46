import { CatStatus } from './../gameObjects/decision';

export interface StateManager {
    tick: () => void;
    state: GameState;
    handleEvent: (event: StateChangeEvent) => void;
    myPlayer: PlayerState;
    otherPlayer: PlayerState;
    viruses: Virus[];
    generateGloballyUniqueId: () => string;
}

export interface GameState {
    gameOver: boolean;
    gameTime: number;
    hostPlayer: PlayerState;
    peerPlayer: PlayerState;
    fishes: Fish[];
    viruses: Virus[];
    heart: number;
    lungs: number;
    fullness: number;
    waterLevel: number;
    baseWalkingSpeed: number;
    waterWalkingSpeed: number;
    catStatus: CatStatus;
}

export interface PlayerState {
    position: GameObjectPosition;
    holdingFish: boolean;
}

export interface GameObjectPosition {
    x: number;
    y: number;
}

export type GameObjectVelocity = GameObjectPosition;

export interface Fish {
    id: string;
    visibleAfterGameTime: number;
    position: GameObjectPosition;
}

export interface Virus {
    id: string;
    position: GameObjectPosition;
    velocity: GameObjectVelocity;
}

export type StateChangeEvent = PumpLungs | BeatHeart | DigestFood | DrainPlug | PlaceFish | RemoveFish | PlaceVirus | SetCatStatus | SetPeerPlayerState;

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

interface SetCatStatus {
    type: 'SET_CAT_STATUS';
    catStatus: CatStatus;
}

interface PlaceVirus {
    type: 'PLACE_VIRUS';
    id: string;
    position: GameObjectPosition;
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
    viruses: [{
        id: 'firstVirus',
        position: {x: 340, y: 340},
        velocity: {x: 0, y: 0}
    }],
    heart: 100,
    lungs: 100,
    fullness: 100,
    waterLevel: 0,
    baseWalkingSpeed: null, // Set by config in HostStateManager
    waterWalkingSpeed: null, // Set by config in HostStateManager
    catStatus: CatStatus.Asleep,
};
