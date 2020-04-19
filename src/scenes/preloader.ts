import { SceneBase } from './sceneBase';
import heart from '../assets/oragans/organ-heart.png';
import lungs from '../assets/oragans/organ-lungs.png';
import brain from '../assets/oragans/organ-brain.png';
import stomach from '../assets/oragans/organ-stomach.png';
import buttonA from '../assets/buttonA.png';
import buttonB from '../assets/buttonB.png';
import water from '../assets/water.png';
import cork from '../assets/oragans/cork.png';
import fish from '../assets/fish.png';
import player1 from '../assets/players/player1.png';
import player2 from '../assets/players/player2.png';
import player1WithFish from '../assets/players/player1-with-fish.png';
import player2WithFish from '../assets/players/player2-with-fish.png';
import cat from '../assets/outsideView/cat.webp';
import catBackground from '../assets/cat-main.png';
import wall from '../assets/wall.png';

export class Preloader extends SceneBase {
    preload() {
        const progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((this.gameWidth / 2) - 160, (this.gameHeight / 2) - 25, 320, 50);

        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((this.gameWidth / 2) - 150, (this.gameHeight / 2) - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.scene.start('Menu');
        });

        this.load.image('buttonA', buttonA);
        this.load.image('buttonB', buttonB);
        this.load.image('stomach', stomach);
        this.load.image('water', water);
        this.load.image('fish', fish);
        this.load.image('cat', cat);
        this.load.image('catBackground', catBackground);

        this.load.image('wall', wall);
        this.load.spritesheet('player1',
            player1,
            { frameWidth: 39, frameHeight: 50 }
        );
        this.load.spritesheet('player2',
            player2,
            { frameWidth: 39, frameHeight: 50 }
        );
        this.load.spritesheet('player1-with-fish',
            player1WithFish,
            { frameWidth: 39, frameHeight: 50 }
        );
        this.load.spritesheet('player2-with-fish',
            player2WithFish,
            { frameWidth: 39, frameHeight: 50 }
        );
        this.load.spritesheet('brain',
            brain,
            { frameWidth: 134, frameHeight: 130 }
        );
        this.load.spritesheet('heart',
            heart,
            { frameWidth: 101, frameHeight: 147 }
        );
        this.load.spritesheet('lungs',
            lungs,
            { frameWidth: 165, frameHeight: 257 }
        );
        this.load.spritesheet('plug',
            cork,
            { frameWidth: 76, frameHeight: 65 }
        );
        this.setupBackground();
    }

    private setupBackground = () => {
        const texture = this.textures.createCanvas('background', this.gameWidth, this.gameHeight);
        const context = texture.getContext();
        var gradient = context.createLinearGradient(0, 0, this.gameWidth, this.gameHeight);

        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(1, '#4B0082');

        context.fillStyle = gradient;
        context.fillRect(0, 0, this.gameWidth, this.gameHeight);
        texture.refresh();
    };
}
