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
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        const walkingSpeed = 160;

        if (cursors.left.isDown)
        {
            this.setVelocity(0);
            this.setVelocityX(-1 * walkingSpeed);
            this.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            this.setVelocity(0);
            this.setVelocityX(walkingSpeed);
            this.anims.play('right', true);
        }
        else if (cursors.up.isDown)
        {
            this.setVelocity(0);
            this.setVelocityY(-1 * walkingSpeed);
            this.anims.play('right', true);
        }
        else if (cursors.down.isDown)
        {
            this.setVelocity(0);
            this.setVelocityY(walkingSpeed);
            this.anims.play('turn', true);
        }
        else
        {
            this.setVelocity(0);
            this.anims.play('turn', true);
        }
    }

    gameOver() {
        this.setTint(0xff0000);
        this.anims.play('turn');
    }
}