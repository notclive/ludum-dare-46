import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';

export class Boot extends SceneBase {
    preload() {}

    create() {
        this.scene.start('Preloader');
    }
}