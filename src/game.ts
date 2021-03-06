import * as Phaser from 'phaser';
import { Boot } from './scenes/boot';
import { Preloader } from './scenes/preloader';
import { Menu } from './scenes/menu';
import { Level } from './scenes/level';
import {MultiplayerSetup} from './scenes/multiplayerSetup';
import {GameOver} from './scenes/gameOver';

export class Game extends Phaser.Game {

    constructor() {
        super({
            type: Phaser.AUTO,
            backgroundColor: '#FFFFFF',
            scale: {
                width: 1280,
                height: 1024,
                mode: Phaser.Scale.FIT,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: true,
                },
            },
            // Parent and dom.createContainer allow HTML elements to be laid over the canvas.
            // Used for game ID input when setting up multiplayer games.
            parent: 'body',
            dom: {
                createContainer: true
            },
        });

        this.scene.add('Boot', Boot);
        this.scene.add('Preloader', Preloader);
        this.scene.add('Menu', Menu);
        this.scene.add('MultiplayerSetup', MultiplayerSetup);
        this.scene.add('Level', Level);
        this.scene.add('GameOver', GameOver);

        // start
        this.scene.start('Boot');
    }
}
