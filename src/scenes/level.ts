import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';
import { Player } from '../gameObjects/player';
import { Heart } from '../gameObjects/heart';
import { StatBar } from '../gameObjects/statBar';

export class Level extends SceneBase {
    private player: Player;
    private heart: Heart;
    private healthBar: StatBar;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private gameOver = false;

    create() {
        const background = this.add.image(0, 0, 'sky');
        this.centreObject(background);
        this.scaleObjectToGameWidth(background, 1);

        this.player = new Player(this, 100, 450);
        this.heart = new Heart(this, 300, 450, 20);
        this.healthBar = new StatBar(this, 20, 50, 'HP');

        this.physics.add.collider(this.player, this.heart, () => this.heart.pump(), null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    };

    update() {
        if (this.gameOver) {
            return;
        }

        this.heart.update();
        if (this.heart.getHealth() <= 0) {
            this.endGame();
        }

        this.player.update(this.cursors);
        this.healthBar.update(this.heart.getHealth());
    };

    private endGame() {
        this.physics.pause();
        this.player.gameOver();
        this.gameOver = true;
    }
}