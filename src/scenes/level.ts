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
    private spaceBarDown = false;
    private walls: Phaser.Physics.Arcade.StaticGroup;

    create() {
        const background = this.add.image(0, 0, 'sky');
        this.centreObject(background);
        this.scaleObjectToGameWidth(background, 1);

        this.player = new Player(this, this.gameWidth / 2, this.gameHeight / 2);

        this.heart = new Heart(this, this.gameWidth / 4, this.gameHeight / 2);
        this.healthBar = new StatBar(this, 20, 50, 'HP');

        this.lungs = new Lungs(this, (3 * this.gameWidth) / 4, this.gameHeight / 2);
        this.breatheBar = new StatBar(this, 20, 90, 'O2');

        this.physics.add.collider(this.player, this.heart, () => this.handleCollidingWithInteractableObject(() => this.heart.pump()), null, this);
        this.physics.add.collider(this.player, this.lungs, () => this.handleCollidingWithLungs(), null, this);

        this.walls = this.physics.add.staticGroup();
        this.createWalls();
        this.physics.add.collider(this.player, this.walls);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.outsideView = new OutsideView(this);

        this.generateFishEveryMinute();
    }

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
    }

    private endGame() {
        this.physics.pause();
        this.player.gameOver();
        this.gameOver = true;
    }

    private handleCollidingWithInteractableObject(performAction: () => void) {
        if (this.cursors.space.isDown) {
            if (!this.spaceBarDown) {
                performAction();
            }
            this.spaceBarDown = true;
        } else {
            this.spaceBarDown = false;
        }
    }

    private handleCollidingWithLungs() {
        if (this.cursors.space.isDown && this.cursors.space.getDuration() > 200) {
            this.lungs.breathe();
        }
    }

    private generateFishEveryMinute() {
        setInterval(() => {
            const xJitter = Math.random() / 10;
            const yJitter = Math.random() / 10;
            const fish = this.add.image(this.gameWidth / (2 + xJitter), this.gameHeight  / (4 + yJitter), 'fish');
            this.scaleObjectToGameWidth(fish, 0.02);
        }, 60 * 1000)
    }

    private createWalls() {
        const leftMargin = 50;
        const topMargin = 150;
        for (var i = leftMargin; i <= this.gameWidth - leftMargin; i = i + 50) {
            this.walls.create(i, topMargin, 'wall');
            this.walls.create(i, this.gameHeight - topMargin, 'wall');
            for (var j = topMargin; j <= this.gameHeight - topMargin; j = j + 50) {
                this.walls.create(leftMargin, j, 'wall');
                this.walls.create(this.gameWidth - leftMargin, j, 'wall');
            }
        }
    }
}
