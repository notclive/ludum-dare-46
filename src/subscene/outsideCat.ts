import { CatStatus } from './../gameObjects/catStatus';
import * as Phaser from 'phaser';
import { Level } from '../scenes/level';

export class OutsideCat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Level, x: number, y: number) {
        super(scene, x, y, 'outside-cat');

        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setUpAnimations();

        this.anims.play('asleep', true);
    }

    setUpAnimations() {
        this.scene.anims.create({
            key: 'asleep',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 0, end: 3 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'awake',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 4, end: 9 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'drinking',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 17, end: 20 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'ill',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 21, end: 23 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'eating',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 10, end: 16 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'dead',
            frames: [ { key: 'outside-cat', frame: 24 } ],
            frameRate: 2
        });
    }

    wakeUp = () => {
      this.anims.play('awake', true);
    }

    drink = () => {
      this.anims.play('drinking', true);
    }

    eat = () => {
      this.anims.play('eating', true);
    }

    becomeIll = () => {
      this.anims.play('ill', true);
    }

    die = () => {
      this.anims.play('dead', true);
    }
}
