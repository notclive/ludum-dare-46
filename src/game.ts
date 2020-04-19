import * as Phaser from 'phaser';
import { Boot } from './scenes/boot';
import { Preloader } from './scenes/preloader';
import { Menu } from './scenes/menu';
import { Level } from './scenes/level';

export class Game extends Phaser.Game {

    constructor() {
        super({
            type: Phaser.AUTO,
            backgroundColor: '#125555',
            scale: {
                width: 1280,
                height: 1024,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: true,
                },
            },
        });

        this.scene.add('Boot', Boot);
        this.scene.add('Preloader', Preloader);
        this.scene.add('Menu', Menu);
        this.scene.add('Level', Level);

        // start
        this.scene.start('Boot');
    }
}
