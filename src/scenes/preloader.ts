import { SceneBase } from './sceneBase';
import sky from '../assets/sky.png';
import heart from '../assets/heart.png';
import lungs from '../assets/lungs.jpg';
import brain from '../assets/brain.png';
import fish from '../assets/fish.png';
import dude from '../assets/player1.png';
import cat from '../assets/outsideView/cat.webp';
import wall from '../assets/wall.png';

export class Preloader extends SceneBase {
    preload() {
        const progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.scene.start('Menu');
        });

        this.load.image('sky', sky);
        this.load.image('heart', heart);
        this.load.image('lungs', lungs);
        this.load.image('brain', brain);
        this.load.image('fish', fish);
        this.load.image('cat', cat);

        this.load.image('wall', wall);
        this.load.spritesheet('dude', 
            dude,
            { frameWidth: 39, frameHeight: 50 }
        );
    }
}
