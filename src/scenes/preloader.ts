import { SceneBase } from './sceneBase';
import sky from '../assets/sky.png';
import heart from '../assets/heart.png';
import lungs from '../assets/lungs.jpg';
import brain from '../assets/brain.png';
import stomach from '../assets/stomach.jpg';
import fish from '../assets/fish.png';
import player1 from '../assets/player1.png';
import player1WithFish from '../assets/player1-with-fish.png';
import cat from '../assets/outsideView/cat.webp';
import catBackground from '../assets/cat-main.png';
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
        this.load.image('stomach', stomach);
        this.load.image('fish', fish);
        this.load.image('cat', cat);
        this.load.image('catBackground', catBackground);

        this.load.image('wall', wall);
        this.load.spritesheet('player1',
            player1,
            { frameWidth: 39, frameHeight: 50 }
        );
        this.load.spritesheet('player1-with-fish',
            player1WithFish,
            { frameWidth: 39, frameHeight: 50 }
        );
    }
}
