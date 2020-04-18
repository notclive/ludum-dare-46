const INITIAL_STATE: GameState = {
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

export default class MasterStateManager {

    private _state = INITIAL_STATE;

    public get state() {
        return this._state;
    }

    public tick = () => {
        this._state = {
            ...this._state,
            gameOver: this.state.gameOver || this._state.heart === 0 || this._state.lungs === 0,
            heart: Math.max(this._state.heart - 0.1, 0),
            lungs: Math.max(this._state.lungs - 0.05, 0)
        };
    };

    public setMyPosition = (position: Position) => {
        this._state = {
            ...this._state,
            hostPlayer: {
                ...this._state.hostPlayer,
                position: position
            }
        };
    };

    public handleEvent = (event: Event) => {
        if (event.type === 'PUMP_LUNGS') {
            this.pumpLungs();
        }
        if (event.type === 'BEAT_HEART') {
            this.beatHeart();
        }
    };

    private pumpLungs = () => {
        this._state = {
            ...this._state,
            lungs: Math.min(this._state.lungs + 0.5, 100)
        }
    };

    private beatHeart = () => {
        this._state = {
            ...this._state,
            heart: Math.min(this._state.heart + 10, 100)
        }
    };
}

interface GameState {
    gameOver: boolean;
    hostPlayer: PlayerState;
    peerPlayer: PlayerState;
    heart: number;
    lungs: number;
}

interface PlayerState {
    position: Position;
    holdingFish: boolean;
}

interface Position {
    x: number;
    y: number
}

type Event = PumpLungs | BeatHeart;

interface PumpLungs {
    type: 'PUMP_LUNGS';
}

interface BeatHeart {
    type: 'BEAT_HEART';
}
