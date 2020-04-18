import * as Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'dude');

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.create();
    }

    create() {
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.scene.anims.create({
            key: 'still',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'moving',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),
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
            this.anims.play('moving', true);
        }
        else if (cursors.right.isDown)
        {
            this.setVelocity(0);
            this.setVelocityX(walkingSpeed);
            this.anims.play('moving', true);
        }
        else if (cursors.up.isDown)
        {
            this.setVelocity(0);
            this.setVelocityY(-1 * walkingSpeed);
            this.anims.play('moving', true);
        }
        else if (cursors.down.isDown)
        {
            this.setVelocity(0);
            this.setVelocityY(walkingSpeed);
            this.anims.play('moving', true);
        }
        else
        {
            this.setVelocity(0);
            this.anims.play('still', true);
        }
    }

    gameOver() {
        this.setTint(0xff0000);
        this.anims.play('still');
    }
}