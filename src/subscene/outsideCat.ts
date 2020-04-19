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
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'awake',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 2, end: 3 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'drinking',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 4, end: 5 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'ill',
            frames: this.scene.anims.generateFrameNumbers('outside-cat', { start: 6, end: 7 }),
            frameRate: 2,
            repeat: -1
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
}
