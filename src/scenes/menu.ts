import {SceneBase} from './sceneBase';
import HostStateManager from '../state/hostStateManager';
import MenuButton from '../menuObjects/menuButton';
import {BUTTON_BACKGROUND_COLOUR} from '../menuObjects/menuConstants';

export class Menu extends SceneBase {

    create() {
        this.add.image(640, 512, 'background');

        const title = this.add.text(0, 150, 'ginger\'s day in', {fontSize: '50px', color: BUTTON_BACKGROUND_COLOUR});
        this.centreObjectX(title);

        new MenuButton(this, 440, 'singleplayer', this.startSingleplayerGame);
        new MenuButton(this, 530, 'mutiplayer', this.startMultiplayerSetup);
    }

    private startSingleplayerGame = () => {
        this.scene.start('Level', new HostStateManager());
    };

    private startMultiplayerSetup = () => {
        this.scene.start('MultiplayerSetup');
    };
}
