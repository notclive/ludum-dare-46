import * as Phaser from 'phaser';
import {SceneBase} from './sceneBase';
import * as PeerDefinition from 'peerjs';
import PeerStateManager from '../state/peerStateManager';
import HostStateManager from '../state/hostStateManager';
import {Level} from './level';
import {StateManager} from '../state/stateManager';
import Text = Phaser.GameObjects.Text;
// Module does not quite match Typescript definitions.
const Peer = (PeerDefinition as any).default;

export class MultiplayerSetup extends SceneBase {

    private readonly adjectives = ['fat', 'angry', 'proud', 'lazy', 'fluffy', 'playful', 'wild', 'cute'];
    private readonly colours = ['white', 'black', 'ginger', 'grey', 'cream', 'brown', 'cinnamon'];
    private readonly names = ['cat', 'feline', 'puss', 'tabby', 'kitty'];

    // Colours are darker shades of the palette colour #484d6d.
    private readonly defaultTextColour: string = '#3b405a';
    private readonly hoverTextColour: string = '#282a3c';

    private loading: Text;
    private peer: PeerDefinition;

    create() {
        this.add.image(640, 512, 'background');

        const title = this.add.text(0, 150, 'multiplayer setup', {fontSize: '50px', color: this.defaultTextColour});
        this.centreObjectX(title);

        this.loading = this.add.text(0, 400, 'establishing connection to the kittynet...', {fontSize: '30px', color: this.defaultTextColour});
        this.centreObjectX(this.loading);

        this.startListeningForJoiners();
    }

    private startListeningForJoiners = () => {
        this.peer = new Peer(this.randomlyGenerateGameId());
        this.peer.on('open', gameId => {
            this.loading && this.loading.destroy();
            this.showInstructions(gameId);
        });
        this.peer.on('connection', (connection) => {
            this.startGameWithStateManager(new HostStateManager(connection))
        });
    };

    private showInstructions = (gameId: string) => {
        this.drawGameIdMessage(gameId);
        const gameIdInput = this.drawGameIdInput();
        const join = this.add.text(745, 585, 'join', {fontSize: '30px', color: this.defaultTextColour, align: 'center'});
        this.makeTextClickable(join, () => {
            this.joinGame(gameIdInput.value);
        });
    };

    private drawGameIdMessage = (gameId: string) => {
        const gameIdMessage = this.add.text(
            0, 400,
            `your game id is \'${gameId}\'\n share it with a friend`,
            {fontSize: '30px', color: this.defaultTextColour, align: 'center'}
        );
        gameIdMessage.setLineSpacing(35);
        this.centreObjectX(gameIdMessage);
    };

    private drawGameIdInput = () => {
        const gameIdInput = document.createElement('input');
        gameIdInput.placeholder = 'your friend\'s game id';
        gameIdInput.style.width = '325px';
        gameIdInput.style.padding = '3px';
        gameIdInput.style.fontSize = '25px';
        // Roughly matches Phaser font.
        gameIdInput.style.fontFamily = 'monospace';
        this.add.dom(560, 600, gameIdInput);
        return gameIdInput;
    };

    private joinGame = (gameId: string) => {
        const connection = this.peer.connect(gameId);
        connection.on('open', () => {
            this.startGameWithStateManager(new PeerStateManager(connection));
        });
    };

    private startGameWithStateManager = (stateManager: StateManager) => {
        this.scene.start('Level', stateManager);
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

    private makeTextClickable = (text: Phaser.GameObjects.Text, onClick: () => void) => {
        text.setInteractive();

        text.on('pointerover', () => {
            text.setColor(this.hoverTextColour);
            this.game.canvas.style.cursor = 'pointer';
        });

        text.on('pointerout', () => {
            text.setColor(this.defaultTextColour);
            this.game.canvas.style.cursor = 'default';
        });

        text.on('pointerdown', () => {
            this.game.canvas.style.cursor = 'default';
            onClick();
        });
    };
}
