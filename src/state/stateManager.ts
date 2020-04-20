import {CatStatus} from '../gameObjects/catStatus';

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
    fishes: FishState;
    viruses: Virus[];
    whiteBloodCell: WhiteBloodCellState;
    heart: number;
    lungs: number;
    fullness: number;
    waterLevel: number;
    catStatus: CatStatus;
    queuedCatStatus?: QueuedCatStatus;
    speeds: SpeedState;
    organInteractionTimes: OrganInteractionTimes;
    externalEventTimes: ExternalEventTimes;

    hardModeMultiplier: number;
}

export interface PlayerState {
    position: GameObjectPosition;
    holdingFish: boolean;
}

export interface QueuedCatStatus {
    status: CatStatus;
    time: number;
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

interface FishState {
    queuedFish: number[];
    numberOfFishInPile: number;
}

export interface Virus {
    id: string;
    position: GameObjectPosition;
    velocity: GameObjectVelocity;
    reproducesAt: number;
}

export type StateChangeEvent = RestartGame | BreathLungs | PumpHeart | DigestFood | DrainPlug | RingAlarm |
    TransitionToAwake | TransitionToEating | TakeFishFromPile | PlaceVirus | VirusDestroyed | SetPeerPlayerState;

interface RestartGame {
    type: 'RESTART_GAME';
}

interface BreathLungs {
    type: 'BREATHE_LUNGS';
}

interface PumpHeart {
    type: 'PUMP_HEART';
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

interface TransitionToAwake {
    type: 'TRANSITION_TO_AWAKE';
}

interface TransitionToEating {
    type: 'TRANSITION_TO_EATING';
}

interface TakeFishFromPile {
    type: 'TAKE_FISH_FROM_PILE';
}

interface PlaceVirus {
    type: 'PLACE_VIRUS';
    id: string;
    position: GameObjectPosition;
}

interface VirusDestroyed {
    type: 'DESTROY_VIRUS';
    id: string;
}

interface SetPeerPlayerState {
    type: 'SET_PEER_PLAYER_STATE';
    state: PlayerState;
}

export interface OrganInteractionTimes {
    plugUsed: number;
    lungsUsed: number;
}

export interface ExternalEventTimes {
    catDrank: number;
    catGotIll: number;
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
    fishes: {
        queuedFish: [],
        numberOfFishInPile: 0
    },
    viruses: [],
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
    hardModeMultiplier: 1,
    // These are all set my the host using the config when the gameplay starts
    speeds: {
        baseWalkingSpeed: null,
        waterWalkingSpeed: null,
        virusBaseSpeed: null,
        virusWaterSpeed: null,
        bloodCellsBaseSpeed: null,
        bloodCellsWaterSpeed: null,
    },
    organInteractionTimes: {
        plugUsed: null,
        lungsUsed: null,
    },
    externalEventTimes: {
        catDrank: null,
        catGotIll: null
    }
};
