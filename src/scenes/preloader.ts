import {SceneBase} from './sceneBase';
import mouth from '../assets/organs/mouth.png';
import heart from '../assets/organs/organ-heart.png';
import lungs from '../assets/organs/organ-lungs.png';
import brain from '../assets/organs/organ-brain.png';
import stomach from '../assets/organs/organ-stomach.png';
import lymph from '../assets/organs/organ-lymph.png';
import buttonA from '../assets/buttonA.png';
import buttonB from '../assets/buttonB.png';
import water from '../assets/water.png';
import cork from '../assets/organs/cork.png';
import fish from '../assets/fish.png';
import disease from '../assets/disease.png';
import bloodcells from '../assets/bloodcells.png';
import player1 from '../assets/players/player1.png';
import player2 from '../assets/players/player2.png';
import player1WithFish from '../assets/players/player1-with-fish.png';
import player2WithFish from '../assets/players/player2-with-fish.png';
import outsideCat from '../assets/outsideView/outside-cat.png';
import decisionBox from '../assets/decisions.png';
import catBackground from '../assets/cat-main.png';
import spacebar from '../assets/spacebar.png';
import fastMusic from '../assets/music/fast.mp3';
import regularMusic from '../assets/music/regular.mp3';
import sleepMusic from '../assets/music/sleep.mp3';
import { BUTTON_BACKGROUND_COLOUR_HEX } from '../menuObjects/menuConstants';

const BAR_WIDTH = 320;
const BAR_HEIGHT = 50;
const BAR_RADIUS = 10;

export class Preloader extends SceneBase {

    preload() {
        this.setupBackground();
        this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');

        const progressBar = this.add.graphics();
        progressBar.setDepth(1);
        var progressBox = this.add.graphics();
        progressBox.fillStyle(BUTTON_BACKGROUND_COLOUR_HEX, 0.8);
        progressBox.fillRoundedRect((this.gameWidth / 2) - (BAR_WIDTH / 2), (this.gameHeight / 2) - (BAR_HEIGHT / 2), BAR_WIDTH, BAR_HEIGHT, BAR_RADIUS);

        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xFFFFFF, 1);
            const barWidth = BAR_WIDTH * value;
            if (value < 1 * BAR_HEIGHT / BAR_WIDTH) {
                progressBar.fillEllipse((this.gameWidth / 2) - (BAR_WIDTH / 2) + (barWidth / 2), (this.gameHeight / 2), barWidth, BAR_HEIGHT);
            } else {
                progressBar.fillRoundedRect((this.gameWidth / 2) - (BAR_WIDTH / 2), (this.gameHeight / 2) - (BAR_HEIGHT / 2), barWidth, BAR_HEIGHT, BAR_RADIUS);
            }
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.scene.start('Menu');
        });

        this.load.image('buttonA', buttonA);
        this.load.image('buttonB', buttonB);
        this.load.image('mouth', mouth);
        this.load.image('stomach', stomach);
        this.load.image('water', water);
        this.load.image('fish', fish);
        this.load.image('catBackground', catBackground);

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
        this.load.spritesheet('lymph',
            lymph,
            { frameWidth: 100, frameHeight: 140 }
        );
        this.load.spritesheet('plug',
            cork,
            { frameWidth: 76, frameHeight: 65 }
        );
        this.load.spritesheet('disease',
            disease,
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('bloodcells',
            bloodcells,
            { frameWidth: 80, frameHeight: 80 }
        );
        this.load.spritesheet('outside-cat',
            outsideCat,
            { frameWidth: 400, frameHeight: 320 }
        );
        this.load.spritesheet('decision-box',
            decisionBox,
            { frameWidth: 757, frameHeight: 371 }
        );
        this.load.spritesheet('spacebar',
            spacebar,
            { frameWidth: 122, frameHeight: 49 }
        );

        this.load.audio('fast', [fastMusic]);
        this.load.audio('regular', [regularMusic]);
        this.load.audio('sleep', [sleepMusic]);
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
