import { CatStatus } from './../gameObjects/catStatus';
import * as Phaser from 'phaser';
import { Level } from '../scenes/level';

export class OutsideCat extends Phaser.Physics.Arcade.Sprite {
    private status: CatStatus = CatStatus.Asleep;

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
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 10, end: 10 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'ill',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 11, end: 11 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'eating',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 12, end: 12 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'dead',
            frames: [ { key: 'outside-cat', frame: 13 } ],
            frameRate: 2
        });
    }

    wakeUp = () => {
      if (this.status !== CatStatus.Awake) {
        this.status = CatStatus.Awake;
        this.anims.play('awake', true);
      }
    }

    drink = () => {
      if (this.status === CatStatus.Awake) {
        this.status = CatStatus.Drinking;
        this.anims.play('drinking', true);
      }
    }

    eat = () => {
      if (this.status !== CatStatus.Eating) {
        this.status = CatStatus.Eating;
        this.anims.play('eating', true);
      }
    }

    becomeIll = () => {
      if (this.status !== CatStatus.Ill) {
        this.status = CatStatus.Ill;
        this.anims.play('ill', true);
      }
    }

    die = () => {
      this.status = CatStatus.Dead;
      this.anims.play('dead', true);
    }
}
