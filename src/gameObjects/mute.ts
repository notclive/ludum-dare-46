import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import { SceneBase } from '../scenes/sceneBase';

export class Mute extends Phaser.Physics.Arcade.Sprite {
    public constructor(public scene: SceneBase, x: number, y: number, private _mute: boolean) {
        super(scene, x, y, 'mute');

        this.scene.physics.world.enable(this, PHASER_STATIC_BODY);
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'unmuted',
            frames: this.scene.anims.generateFrameNumbers('mute', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'muted',
            frames: this.scene.anims.generateFrameNumbers('mute', { start: 1, end: 1 }),
            frameRate: 1,
            repeat: -1
        });
        this.updateMutedImage();
        this.setupClicking();
    }

    public get mute() {
        return this._mute;
    }
    
    public set mute(value) {
        this._mute = value;
        this.updateMutedImage();
    }

    private updateMutedImage = () => {
        this.anims.play(Mute.getAnimationForMuteValue(this._mute), true);
        this.scene.sound.mute = this._mute;
    };

    private setupClicking = () => {
        this.setInteractive();

        this.on('pointerover', () => {
            this.scene.game.canvas.style.cursor = 'pointer';
        });

        this.on('pointerout', () => {
            this.scene.game.canvas.style.cursor = 'default';
        });

        this.on('pointerup', () => {
            this.mute = !this._mute;
        });
    };

    private static getAnimationForMuteValue = (mute: boolean) => mute ? 'muted' : 'unmuted';
}
