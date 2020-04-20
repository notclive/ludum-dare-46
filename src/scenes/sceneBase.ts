import { Mute } from "../gameObjects/mute";
import { Tilemaps } from "phaser";
import { PHASER_STATIC_BODY } from "../consts";

export type MoveableGameObject =
    Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | Phaser.GameObjects.Image | Phaser.GameObjects.Shape;

export class SceneBase extends Phaser.Scene {
    protected music: Phaser.Sound.WebAudioSound;
    protected mute: Mute;

    protected setMuteButton = (muteButton: Mute) => {
        this.mute = new Mute(this, muteButton.x, muteButton.y, muteButton.mute);
        this.sound.mute = muteButton.mute;
    };

    public get gameWidth(): number {
        return this.sys.game.config.width as number;
    }

    public get gameHeight(): number {
        return this.sys.game.config.height as number;
    }

    public getDistanceBetweenBandACentres(a: MoveableGameObject, b: MoveableGameObject) {
        const xDistance = Math.abs(a.x - b.x);
        const yDistance = Math.abs(a.y - b.y);
        return Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
    }

    public centreObjectX(object: MoveableGameObject) {
        object.x = (this.gameWidth / 2) - (object.displayWidth / 2);
    }

    protected setNewMusicWithFade = (newMusic: Phaser.Sound.WebAudioSound, fadeTimeMillis: number) => {
        if (this.music) {
            this.fadeOutMusic(this.music, fadeTimeMillis);
        }
        this.fadeInMusic(newMusic, fadeTimeMillis);
        this.music = newMusic;
    };

    protected fadeOutMusic(music: Phaser.Sound.WebAudioSound, timeInMillis: number) {
        const stages = 20;
        const startingVolume = music.volume;
        for (let i = 0; i < stages; i++) {
            const timeOut = i * timeInMillis / stages;
            const volume = startingVolume * (stages - i) / stages;
            setTimeout(() => music.setVolume(volume), timeOut);
        }
        setTimeout(() => music.stop(), timeInMillis);
    }

    protected fadeInMusic(music: Phaser.Sound.WebAudioSound, timeInMillis: number) {
        const stages = 20;
        const desiredVolume = music.volume;
        music.setVolume(0);
        music.play();
        for (let i = 0; i < stages; i++) {
            const timeOut = i * timeInMillis / stages;
            const volume = desiredVolume * i / stages;
            setTimeout(() => music.setVolume(volume), timeOut);
        }
        setTimeout(() => music.setVolume(desiredVolume), timeInMillis);
    }
}
