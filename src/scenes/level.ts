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
import { Stomach } from '../gameObjects/stomach';
import { Plug } from '../gameObjects/plug';
import { Water } from '../gameObjects/water';

export class Level extends SceneBase {
    private player: Player;
    private heart: Heart;
    private healthBar: StatBar;
    private lungs: Lungs;
    private breatheBar: StatBar;
    private stomach: Stomach;
    private foodBar: StatBar;
    private brain: Brain;
    private plug: Plug;
    private water: Water;
    private fishes: Fishes;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private outsideView: OutsideView;
    private gameOver = false;
    private spaceBarDown = false;
    private walls: Phaser.Physics.Arcade.StaticGroup;

    create() {
        const background = this.add.image(0, 0, 'sky');
        this.centreObject(background);
        this.scaleObjectToGameWidth(background, 1);

        const leftGameWidth = this.gameWidth / 2;

        const catBackground = this.add.image(0, 0, 'catBackground');
        const catXPosition = (leftGameWidth / 2);
        const catTopY = (this.gameHeight - catBackground.displayHeight) / 2;

        catBackground.x = catXPosition;
        catBackground.y = this.gameHeight / 2;

        this.player = new Player(this, leftGameWidth / 2, this.gameHeight / 2);

        this.heart = new Heart(this, 3 * leftGameWidth / 4, this.gameHeight / 2);
        this.healthBar = new StatBar(this, 20, 50, 'HP');

        this.lungs = new Lungs(this, (leftGameWidth) / 4, this.gameHeight / 2);
        this.breatheBar = new StatBar(this, 20, 90, 'O2');

        this.stomach = new Stomach(this, 5 * leftGameWidth / 8, (3 * this.gameHeight) / 4);
        this.foodBar = new StatBar(this, 20, 130, 'Food');

        this.brain = new Brain(this, leftGameWidth/2, this.gameHeight/3, this.player);

        this.water = new Water(this, catXPosition, catTopY + (catBackground.displayHeight * 1.5), 0);
        this.plug = new Plug(this, 3 * leftGameWidth / 8, (3 * this.gameHeight) / 4, this.water);

        this.physics.add.collider(this.player, this.heart, () => this.handleCollidingWithInteractableObject(() => this.heart.pump()), null, this);
        this.physics.add.collider(this.player, this.lungs, () => this.handleCollidingWithInteractableObjectHold(() => this.lungs.breathe()), null, this);
        this.physics.add.collider(this.player, this.plug, () => this.handleCollidingWithInteractableObjectHold(() => this.openPlug()), null, this);

        this.physics.add.overlap(this.player, this.brain, () => this.handleOverlapWithBrain(), null, this);
        
        this.walls = this.physics.add.staticGroup();
        this.createWalls();
        this.physics.add.collider(this.player, this.walls);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.outsideView = new OutsideView(this);

        this.fishes = new Fishes(this, this.player, this.handleFishPlaced);
    }

    update() {
        const baseWalkingSpeed = 160;
        if (this.gameOver) {
            return;
        }

        this.heart.update(0.1);
        this.lungs.update(0.05);
        this.stomach.update(0.01);
        this.plug.update(0.03);
        if (this.heart.hasFailed() || this.lungs.haveFailed()) {
            this.endGame();
        }

        const walkingSpeed = this.player.y > this.water.YOfTheWaterLevel()
            ? baseWalkingSpeed / 2
            : baseWalkingSpeed;

        this.player.update(walkingSpeed, this.cursors);

        this.healthBar.update(this.heart.getHealth());
        this.breatheBar.update(this.lungs.getHealth());
        this.foodBar.update(this.stomach.getHealth());
    }

    private endGame() {
        this.physics.pause();
        this.player.gameOver();
        this.fishes.stopGeneratingFish();
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

    private handleCollidingWithInteractableObjectHold(performAction: () => void) {
        if (this.cursors.space.isDown && this.cursors.space.getDuration() > 200) {
            performAction();
        }
    }

    private handleOverlapWithBrain() {
        this.brain.showDecision();

        if (this.cursors.space.isDown) {
            if (!this.spaceBarDown) {
                this.brain.tryPressButton();
            }
            this.spaceBarDown = true;
        } else {
            this.spaceBarDown = false;
        }
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

    private handleFishPlaced = (fish: Phaser.GameObjects.Image) => {
        this.physics.add.collider(fish, this.stomach, () => this.feedStomach(fish), null, this);
    }

    private feedStomach = (fish: Phaser.GameObjects.Image) => {
        fish.destroy();
        this.stomach.feed();
    }

    private openPlug = () => {
        if (this.plug.getIsPlugged()) {
            this.cursors.space.once('up', () => this.plug.plug());
            this.plug.unplug();
        }
        this.plug.drain();
    }
}
