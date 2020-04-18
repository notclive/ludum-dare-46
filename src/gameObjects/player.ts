import * as Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {

    private _isHoldingFish = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
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

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        const walkingSpeed = 160;

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

    gameOver() {
        this.setTint(0xff0000);
        this.anims.play('still');
    }

    public get isHoldingFish() {
        return this._isHoldingFish;
    }

    public set isHoldingFish(isHoldingFish: boolean) {
        this._isHoldingFish = isHoldingFish;
    }
}
