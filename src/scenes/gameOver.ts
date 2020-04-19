import {SceneBase} from './sceneBase';
import {StateManager} from '../state/stateManager';
import MenuButton from '../menuObjects/menuButton';
import {BUTTON_BACKGROUND_COLOUR} from '../menuObjects/menuConstants';

export class GameOver extends SceneBase {

    private _stateManager: StateManager;

    public create(stateManager: StateManager) {
        this._stateManager = stateManager;

        this.add.image(640, 512, 'background');

        const title = this.add.text(0, 150, 'game over', {fontSize: '50px', color: BUTTON_BACKGROUND_COLOUR});
        this.centreObjectX(title);

        const deadCat = this.add.image(640, 325, 'outside-cat', 8);
        deadCat.scale = 1.5;

        const yourScore = this.add.text(0, 460, `your scored ${stateManager.state.gameTime} points`, {fontSize: '30px', color: BUTTON_BACKGROUND_COLOUR});
        this.centreObjectX(yourScore);

        new MenuButton(this, 545, 'try again', this.restart);
    }

    public update() {
        // Game has been restarted by one of the players.
        if (!this._stateManager.state.gameOver) {
            this.scene.start('Level', this._stateManager);
        }
    }

    private restart = () => {
        this._stateManager.handleEvent({
            type: 'RESTART_GAME'
        });
    };
}
