import { CatStatus } from './../gameObjects/catStatus';

export interface StateManager {
    tick: () => void;
    state: GameState;
    handleEvent: (event: StateChangeEvent) => void;
    myPlayer: PlayerState;
    otherPlayer: PlayerState;
    viruses: Virus[];
    whiteBloodCell: WhiteBloodCellState;
    generateGloballyUniqueId: () => string;
}

export interface GameState {
    gameOver: boolean;
    gameTime: number;
    hostPlayer: PlayerState;
    peerPlayer: PlayerState;
    fishes: Fish[];
    viruses: Virus[];
    whiteBloodCell: WhiteBloodCellState;
    heart: number;
    lungs: number;
    fullness: number;
    waterLevel: number;
    catStatus: CatStatus;
    speeds: SpeedState;
}

export interface PlayerState {
    position: GameObjectPosition;
    holdingFish: boolean;
}

export interface SpeedState {
    baseWalkingSpeed: number;
    waterWalkingSpeed: number;
    virusBaseSpeed: number;
    virusWaterSpeed: number;
    bloodCellsBaseSpeed: number;
    bloodCellsWaterSpeed: number;
}

export interface WhiteBloodCellState {
    position: GameObjectPosition;
    velocity: GameObjectVelocity;
    enabled: boolean;
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

export type StateChangeEvent = PumpLungs | BeatHeart | DigestFood | DrainPlug | RingAlarm |
    PlaceFish | RemoveFish | PlaceVirus | VirusDestroyed | SetCatStatus | SetPeerPlayerState;

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

interface RingAlarm {
    type: 'RING_ALARM';
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

interface VirusDestroyed {
    type: 'VIRUS_DESTROYED';
    id: string;
}

interface SetCatStatus {
    type: 'SET_CAT_STATUS';
    catStatus: CatStatus;
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
    viruses: [{ // TODO remove this - just a test
        id: 'firstVirus',
        position: {x: 340, y: 340},
        velocity: {x: 0, y: 0}
    }],
    whiteBloodCell: { // Set within the whiteBloodCell Sprite
        position: {x: 0, y: 0},
        velocity: {x: 0, y: 0},
        enabled: false,
    },
    heart: 100,
    lungs: 100,
    fullness: 100,
    waterLevel: 0,
    catStatus: CatStatus.Asleep,
    // These are all set my the host using the config when the gameplay starts
    speeds: {
        baseWalkingSpeed: null,
        waterWalkingSpeed: null,
        virusBaseSpeed: null,
        virusWaterSpeed: null,
        bloodCellsBaseSpeed: null,
        bloodCellsWaterSpeed: null,
    },
};
