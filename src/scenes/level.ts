import { DecisionBox } from './../gameObjects/decisionBox';
import * as Phaser from 'phaser';
import {SceneBase} from './sceneBase';
import {Player} from '../gameObjects/player';
import {Heart} from '../gameObjects/heart';
import {StatBar} from '../gameObjects/statBar';
import {Lungs} from '../gameObjects/lungs';
import OutsideView from '../subscene/outsideView';
import Fishes from '../gameObjects/fishes';
import { Brain } from '../gameObjects/brain';

export class Level extends SceneBase {
    private player: Player;
    private heart: Heart;
    private healthBar: StatBar;
    private lungs: Lungs;
    private breatheBar: StatBar;
    private brain: Brain;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private outsideView: OutsideView;
    private gameOver = false;
    private spaceBarDown = false;
    private walls: Phaser.Physics.Arcade.StaticGroup;
    private decisionBox: DecisionBox;

    create() {
        const background = this.add.image(0, 0, 'sky');
        this.centreObject(background);
        this.scaleObjectToGameWidth(background, 1);

        this.player = new Player(this, this.gameWidth / 2, this.gameHeight / 2);

        this.heart = new Heart(this, this.gameWidth / 4, this.gameHeight / 2);
        this.healthBar = new StatBar(this, 20, 50, 'HP');

        this.lungs = new Lungs(this, (3 * this.gameWidth) / 4, this.gameHeight / 2);
        this.breatheBar = new StatBar(this, 20, 90, 'O2');

        this.brain = new Brain(this, this.gameWidth/2, this.gameHeight/4);
        this.decisionBox = new DecisionBox(this, this.gameWidth/2, 20);

        this.physics.add.collider(this.player, this.heart, () => this.handleCollidingWithInteractableObject(() => this.heart.pump()), null, this);
        this.physics.add.collider(this.player, this.lungs, () => this.handleCollidingWithLungs(), null, this);
        this.physics.add.collider(this.player, this.brain, () => this.handleCollidingWithBrain(), null, this);

        this.walls = this.physics.add.staticGroup();
        this.createWalls();
        this.physics.add.collider(this.player, this.walls);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.outsideView = new OutsideView(this);

        new Fishes(this, this.player);
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

    private handleCollidingWithBrain() {
        this.decisionBox.show();
    }

    private createWalls() {
        const wallSize = 20;
        const leftMargin = 100;
        const topMargin = 150;

        const xScale = (this.gameWidth - leftMargin * 2) / wallSize;
        const yScale = (this.gameHeight - topMargin * 2) / wallSize;

        this.walls.create(this.gameWidth/2, topMargin, 'wall').setScale(xScale, 1).refreshBody();
        this.walls.create(this.gameWidth/2, this.gameHeight - topMargin, 'wall').setScale(xScale, 1).refreshBody();
        this.walls.create(leftMargin, this.gameHeight/2, 'wall').setScale(1, yScale).refreshBody();
        this.walls.create(this.gameWidth - leftMargin, this.gameHeight/2, 'wall').setScale(1, yScale).refreshBody();
    }
}
