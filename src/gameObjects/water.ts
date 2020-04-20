import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import Image = Phaser.GameObjects.Image;

export class Water extends Image {

    private sideToSideDirection = 1;

    public constructor(public scene: Phaser.Scene, private catBackground: Image) {
        super(scene, catBackground.x, 0, 'water');
        this.configureHowItLooks();
        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    private configureHowItLooks() {
        const mask = this.createBitmapMask(this.catBackground);
        this.setMask(mask);
        this.setAlpha(0.55);
        this.setDepth(1);
        this.scale = 1.2;
    }

    public update(waterLevel: number) {
        this.moveSideToSide();
        // This keeps the water within the bounds of the cat
        const topOfCatBackground = this.catBackground.y - (this.catBackground.displayHeight / 2);
        const waterLevelY = topOfCatBackground + (this.catBackground.displayHeight * (100 - waterLevel) / 100);
        this.y = waterLevelY + (this.displayHeight / 2);
    }

    private moveSideToSide = () => {
        if (this.x < this.catBackground.x - 30) {
            this.sideToSideDirection = 1;
        }
        if (this.x > this.catBackground.x + 30) {
            this.sideToSideDirection = -1
        }
        this.x += 0.25 * this.sideToSideDirection;
    };

    public YOfTheWaterLevel = () => this.y - (this.displayHeight / 2);
}
