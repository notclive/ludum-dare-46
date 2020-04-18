import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';
import { Player } from '../gameObjects/player';
import { Heart } from '../gameObjects/heart';
import { StatBar } from '../gameObjects/statBar';
import { Lungs } from '../gameObjects/lungs';
import OutsideView from '../subscene/outsideView';

export class Level extends SceneBase {
    private player: Player;
    private heart: Heart;
    private healthBar: StatBar;
    private lungs: Lungs;
    private breatheBar: StatBar;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private outsideView: OutsideView;
    private gameOver = false;

    create() {
        const background = this.add.image(0, 0, 'sky');
        this.centreObject(background);
        this.scaleObjectToGameWidth(background, 1);

        this.player = new Player(this, this.gameWidth / 2, this.gameHeight / 2);

        this.heart = new Heart(this, this.gameWidth / 4, this.gameHeight / 2);
        this.healthBar = new StatBar(this, 20, 50, 'HP');

        this.lungs = new Lungs(this, (3 * this.gameWidth) / 4, this.gameHeight / 2);
        this.breatheBar = new StatBar(this, 20, 90, 'O2');

        this.physics.add.collider(this.player, this.heart, () => this.heart.pump(), null, this);
        this.physics.add.collider(this.player, this.lungs, () => this.lungs.breathe(), null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.outsideView = new OutsideView(this);
    };

    update() {
        if (this.gameOver) {
            return;
        }

        this.heart.update(0.1);
        this.lungs.update(0.05);
        if (this.heart.hasFailed() || this.lungs.haveFailed()) {
            this.endGame();
        }

        this.player.update(this.cursors);
        this.healthBar.update(this.heart.getHealth());
        this.breatheBar.update(this.lungs.getHealth());
    };

    private endGame() {
        this.physics.pause();
        this.player.gameOver();
        this.gameOver = true;
    }
}
