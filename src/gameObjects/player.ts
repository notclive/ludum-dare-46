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
        if (cursors.left.isDown)
        {
            this.setVelocityX(-160);
            this.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            this.setVelocityX(160);
            this.anims.play('right', true);
        }
        else
        {
            this.setVelocityX(0);
            this.anims.play('turn');
        }

        if (cursors.up.isDown && this.body.touching.down)
        {
            this.setVelocityY(-330);
        }
    }
}