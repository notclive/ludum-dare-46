import * as Phaser from 'phaser';
import {Level} from '../scenes/level';
import {MoveableGameObject} from '../scenes/sceneBase';
import Image = Phaser.GameObjects.Image;
import {GameState} from '../state/stateManager';
import {Water} from './water';
import Vector2 = Phaser.Math.Vector2;

export class Player extends Phaser.Physics.Arcade.Sprite {

    private readonly cursors = this.scene.input.keyboard.createCursorKeys();
    private snorkel: Image;

    public constructor(
        public scene: Level,
        private representsCurrentPlayer: boolean,
        private water: Water,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'player1');
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.create();
    }

    public create() {
        if (this.representsCurrentPlayer) {
            this.setBounce(0.2);
            this.setCollideWorldBounds(true);
        }

        this.scene.anims.create({
            key: `${this.getSpriteKey()}-still`,
            frames: this.scene.anims.generateFrameNumbers(this.getSpriteKey(), { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: `${this.getSpriteKey()}-moving`,
            frames: this.scene.anims.generateFrameNumbers(this.getSpriteKey(), { start: 0, end: 2 }),
            frameRate: 20,
            repeat: -1
        });

        this.scene.anims.create({
            key: `${this.getSpriteKey()}-still-with-fish`,
            frames: this.scene.anims.generateFrameNumbers(`${this.getSpriteKey()}-with-fish`, { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: `${this.getSpriteKey()}-moving-with-fish`,
            frames: this.scene.anims.generateFrameNumbers(`${this.getSpriteKey()}-with-fish`, { start: 0, end: 2 }),
            frameRate: 20,
            repeat: -1
        });

        this.setDepth(1);
        this.drawSnorkel(this.x, this.y);
    }

    private getSpriteKey = () => {
        return this.representsCurrentPlayer ? 'player1' : 'player2';
    };

    private drawSnorkel = (x: number, y: number) => {
        this.snorkel = this.scene.add.image(x, y, 'snorkel');
        this.snorkel.setDepth(1);
    };

    public update(state: GameState) {
        if (this.representsCurrentPlayer) {
            this.moveUsingCursor(state);
        } else {
            this.moveUsingState();
        }
        this.positionSnorkelOverPlayer();
    }

    private moveUsingCursor = (state: GameState) => {
        const direction = new Vector2();
        if (this.cursors.left.isDown) {
            direction.add(Vector2.LEFT);
        }
        if (this.cursors.right.isDown) {
            direction.add(Vector2.RIGHT);
        }
        if (this.cursors.up.isDown) {
            direction.add(Vector2.UP);
        }
        if (this.cursors.down.isDown) {
            direction.add(Vector2.DOWN);
        }

        const walkingSpeed = this.isUnderwater()
            ? state.speeds.waterWalkingSpeed
            : state.speeds.baseWalkingSpeed;
        const velocity = direction.normalize().scale(walkingSpeed);
        this.setVelocity(velocity.x, velocity.y);

        if (velocity.x > 0 || velocity.y > 0) {
            this.playMovingAnimation();
        } else {
            this.playStillAnimation();
        }
    };

    private playMovingAnimation = () => {
        const fishSuffix = this.getPlayerState().holdingFish ? '-with-fish' : '';
        this.anims.play(`${this.getSpriteKey()}-moving${fishSuffix}`, true);
    };

    private playStillAnimation = () => {
        const fishSuffix = this.getPlayerState().holdingFish ? '-with-fish' : '';
        this.anims.play(`${this.getSpriteKey()}-still${fishSuffix}`, true);
    };

    private moveUsingState = () => {
        const newX = this.getPlayerState().position.x;
        const newY = this.getPlayerState().position.y;
        const playerMoved = this.x != newX || this.y != newY;
        if (playerMoved) {
            this.playMovingAnimation();
        } else {
            this.playStillAnimation();
        }
        this.setPosition(newX, newY);
    };

    private getPlayerState = () => {
        return this.representsCurrentPlayer
            ? this.scene.stateManager.myPlayer
            : this.scene.stateManager.otherPlayer;
    };

    private positionSnorkelOverPlayer = () => {
        this.snorkel.x = this.x;
        this.snorkel.y = this.y;
        this.snorkel.setVisible(this.isUnderwater());
    };


    private isUnderwater = () => {
        return this.y > this.water.YOfTheWaterLevel();
    };

    public isTouching = (object: MoveableGameObject) => {
        return this.scene.physics.overlap(this, object);
    };
}
