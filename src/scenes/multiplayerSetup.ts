import * as Phaser from 'phaser';
import {SceneBase} from './sceneBase';
import * as PeerDefinition from 'peerjs';
import PeerStateManager from '../state/peerStateManager';
import HostStateManager from '../state/hostStateManager';
import {Level} from './level';
import {StateManager} from '../state/stateManager';
import Text = Phaser.GameObjects.Text;
import {BUTTON_BACKGROUND_COLOUR, BUTTON_TEXT_COLOUR} from '../menuObjects/menuConstants';
import MenuButton from '../menuObjects/menuButton';
import { Mute } from '../gameObjects/mute';
// Module does not quite match Typescript definitions.
const Peer = (PeerDefinition as any).default;

export class MultiplayerSetup extends SceneBase {

    private readonly adjectives = ['fat', 'angry', 'proud', 'lazy', 'fluffy', 'playful', 'wild', 'cute'];
    private readonly colours = ['white', 'black', 'ginger', 'grey', 'cream', 'brown', 'cinnamon'];
    private readonly names = ['cat', 'feline', 'puss', 'tabby', 'kitty'];

    private loading: Text;
    private peer: PeerDefinition;

    create(config: {music: Phaser.Sound.WebAudioSound, muteButton: Mute}) {
        this.music = config.music;
        this.add.image(640, 512, 'background');

        this.setMuteButton(config.muteButton);

        const title = this.add.text(0, 150, 'multiplayer setup (beta)', {fontSize: '50px', color: BUTTON_BACKGROUND_COLOUR});
        this.centreObjectX(title);

        this.loading = this.add.text(0, 400, 'establishing connection to the kittynet...', {fontSize: '30px', color: BUTTON_BACKGROUND_COLOUR});
        this.centreObjectX(this.loading);

        new MenuButton(this, this.gameHeight - 75, 'main menu', () =>
            this.scene.start('Menu', {muteButton: this.mute, music: this.music}));

        this.startListeningForJoiners();
    }

    private startListeningForJoiners = () => {
        this.peer = new Peer(this.randomlyGenerateGameId());
        this.peer.on('open', gameId => {
            this.loading && this.loading.destroy();
            this.showInstructions(gameId);
        });
        this.peer.on('connection', (connection) => {
            connection.on('error', (error) => {
                console.error('Connection error', error);
            });
            connection.on('open', () => {
                this.startGameWithStateManager(new HostStateManager(connection))
            });
        });
        this.peer.on('error', (error) => {
            console.error('Peer error', error);
        })
    };

    private showInstructions = (gameId: string) => {
        if (!this.scene.isActive()) {
            return;
        }
        this.drawGameIdMessage(gameId);
        const gameIdInput = this.drawGameIdInput();
        new MenuButton(this, 660, 'join', () => {
            this.joinGame(gameIdInput.value);
        });
    };

    private drawGameIdMessage = (gameId: string) => {
        const gameIdMessage = this.add.text(
            0, 400,
            `your game id is \'${gameId}\'\n share it with a friend`,
            {fontSize: '30px', color: BUTTON_BACKGROUND_COLOUR, align: 'center'}
        );
        gameIdMessage.setLineSpacing(35);
        this.centreObjectX(gameIdMessage);
    };

    private drawGameIdInput = () => {
        const gameIdInput = document.createElement('input');
        gameIdInput.placeholder = 'your friend\'s game id';
        gameIdInput.style.width = '400px';
        gameIdInput.style.padding = '10px 5px';
        gameIdInput.style.fontSize = '30px';
        // Roughly matches Phaser font.
        gameIdInput.style.fontFamily = 'monospace';
        this.add.dom(640, 600, gameIdInput);
        gameIdInput.focus();
        return gameIdInput;
    };

    private joinGame = (gameId: string) => {
        const connection = this.peer.connect(gameId);
        connection.on('open', () => {
            this.startGameWithStateManager(new PeerStateManager(connection));
        });
        connection.on('error', (error) => {
            console.error('Connection error', error);
        })
    };

    private startGameWithStateManager = (stateManager: StateManager) => {
        this.fadeOutMusic(this.music, 1000);
        this.scene.start('Level', {stateManager, muteButton: this.mute});
    };

    private randomlyGenerateGameId = () => {
        const adjective = this.randomlySelectFromList(this.adjectives);
        const colour = this.randomlySelectFromList(this.colours);
        const name = this.randomlySelectFromList(this.names);
        return `${adjective}-${colour}-${name}`;
    };

    private randomlySelectFromList = <T>(list: T[]) => {
        return list[Math.floor(Math.random() * list.length)];
    };
}
