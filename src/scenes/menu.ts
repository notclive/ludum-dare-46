import {SceneBase} from './sceneBase';
import HostStateManager from '../state/hostStateManager';
import MenuButton from '../menuObjects/menuButton';
import {BUTTON_BACKGROUND_COLOUR} from '../menuObjects/menuConstants';
import { Mute } from '../gameObjects/mute';

export class Menu extends SceneBase {
    create(config: {muteButton: Mute, music: Phaser.Sound.WebAudioSound}) {
        this.add.image(640, 512, 'background');

        if (!config.music) {
            this.music = this.sound.add('regular', {loop: true}) as Phaser.Sound.WebAudioSound;
            this.music.play();
            this.sound.pauseOnBlur = false;
        } else {
            this.music = config.music;
        }

        const title = this.add.text(0, 150, 'snowball\'s day in', {fontSize: '50px', color: BUTTON_BACKGROUND_COLOUR});
        this.centreObjectX(title);

        new MenuButton(this, 440, 'singleplayer', this.startSingleplayerGame);
        new MenuButton(this, 530, 'multiplayer', this.startMultiplayerSetup);
        if (config.muteButton) {
            this.setMuteButton(config.muteButton);
        } else {
            this.mute = new Mute(this, 50, 50, false);
        }
    }

    private startSingleplayerGame = () => {
        this.fadeOutMusic(this.music, 1000);
        this.scene.start('Level', {stateManager: new HostStateManager(), muteButton: this.mute});
    };

    private startMultiplayerSetup = () => {
        this.scene.start('MultiplayerSetup', {music: this.music, muteButton: this.mute});
    };
}
