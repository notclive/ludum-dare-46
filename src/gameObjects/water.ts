import * as Phaser from 'phaser';
import {PHASER_STATIC_BODY} from '../consts';
import Image = Phaser.GameObjects.Image;

export class Water extends Image {

    public constructor(public scene: Phaser.Scene, private catBackground: Image) {
        super(scene, catBackground.x, 0, 'water');
        this.configureHowItLooks();
        scene.physics.world.enable(this, PHASER_STATIC_BODY);
        scene.add.existing(this);
    }

    private configureHowItLooks() {
        const mask = this.createBitmapMask(this.catBackground);
        this.setMask(mask);
        this.setAlpha(0.5);
        this.setDepth(1);
        this.scale = 1.2;
    }

    public update(waterLevel: number) {
        // This keeps the water within the bounds of the cat
        const topOfCatBackground = this.catBackground.y - (this.catBackground.displayHeight / 2);
        const waterLevelY = topOfCatBackground + (this.catBackground.displayHeight * (100 - waterLevel) / 100);
        this.y = waterLevelY + (this.displayHeight / 2);
    }

    public YOfTheWaterLevel = () => this.y - (this.displayHeight / 2);
}
