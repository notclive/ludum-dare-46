import * as Phaser from 'phaser';
import { Level } from '../scenes/level';
import {MoveableGameObject, SceneBase} from '../scenes/sceneBase';

export class Player extends Phaser.Physics.Arcade.Sprite {

    private _isHoldingFish = false;

    constructor(public scene: Level, x: number, y: number) {
        super(scene, x, y, 'player1');

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.create();
    }

    create() {
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.setDepth(1);

        this.scene.anims.create({
            key: 'still',
            frames: this.scene.anims.generateFrameNumbers('player1', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'moving',
            frames: this.scene.anims.generateFrameNumbers('player1', { start: 0, end: 2 }),
            frameRate: 20,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'still-with-fish',
            frames: this.scene.anims.generateFrameNumbers('player1-with-fish', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'moving-with-fish',
            frames: this.scene.anims.generateFrameNumbers('player1-with-fish', { start: 0, end: 2 }),
            frameRate: 20,
            repeat: -1
        });
    }

    update(walkingSpeed: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (cursors.left.isDown)
        {
            this.setVelocity(0);
            this.setVelocityX(-1 * walkingSpeed);
            this.playMovingAnimation();
        }
        else if (cursors.right.isDown)
        {
            this.setVelocity(0);
            this.setVelocityX(walkingSpeed);
            this.playMovingAnimation();
        }
        else if (cursors.up.isDown)
        {
            this.setVelocity(0);
            this.setVelocityY(-1 * walkingSpeed);
            this.playMovingAnimation();
        }
        else if (cursors.down.isDown)
        {
            this.setVelocity(0);
            this.setVelocityY(walkingSpeed);
            this.playMovingAnimation();
        }
        else
        {
            this.setVelocity(0);
            this.playStillAnimation()
        }
    }

    private playMovingAnimation() {
        const key = this._isHoldingFish ? 'moving-with-fish' : 'moving';
        this.anims.play(key, true);
    }

    private playStillAnimation() {
        const key = this._isHoldingFish ? 'still-with-fish' : 'still';
        this.anims.play(key, true);
    }

    public get isHoldingFish() {
        return this._isHoldingFish;
    }

    public set isHoldingFish(isHoldingFish: boolean) {
        this._isHoldingFish = isHoldingFish;
    }

    isTouching(object: MoveableGameObject) {
        return this.scene.bIsTouchingA(this, object);
    }
}
