import { SceneBase } from './sceneBase';
import sky from '../assets/sky.png';
import heart from '../assets/heart.png';
import lungs from '../assets/lungs.jpg';
import dude from '../assets/dude.png';
import cat from '../assets/outsideView/cat.webp';

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
        this.load.image('cat', cat);

        this.load.spritesheet('dude', 
            dude,
            { frameWidth: 32, frameHeight: 48 }
        );
    }
}
