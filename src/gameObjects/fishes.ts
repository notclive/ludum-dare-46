import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import Image = Phaser.GameObjects.Image;
import {Level} from '../scenes/level';
import {Player} from './player';
import GameObject = Phaser.GameObjects.GameObject;

export default class Fishes extends StaticGroup {
    private fishGenerationId: NodeJS.Timeout;

    public constructor(public scene: Level, private player: Player, private placeFishCallback: (fish: Image) => void) {
        super(scene.physics.world, scene);
        this.handleFishKeyBeingPressed();
    }

    public stopGeneratingFish = () => {
        clearInterval(this.fishGenerationId);
    };

    public generateFishRegularlyForAWhile = () => {
        this.generateFishRegularly();
        setTimeout(() => {
            this.stopGeneratingFish();
        }, 40 * 1000)
    }

    private generateFishRegularly = () => {
        if (this.fishGenerationId) {
            this.stopGeneratingFish();
        }
        this.fishGenerationId = setInterval(() => {
            this.generateFish();
        }, 10 * 1000);
    };

    private generateFish = () => {
        const xJitter = Math.random() / 10;
        const yJitter = Math.random() / 10;
        const x = this.scene.gameWidth / (2 + xJitter);
        const y = this.scene.gameHeight / (2 + yJitter);
        this.placeFish(x, y);
    };

    private handleFishKeyBeingPressed = () => {
        this.scene.input.keyboard
            .addKey('F')
            .on('down', () => {
                if (this.player.isHoldingFish) {
                    this.dropFish();
                } else {
                    this.tryPickUpFish();
                }
            });
    };

    private tryPickUpFish = () => {
        const closestFish = this.scene.getClosestBTouchingA(this.player, this.children.entries as Image[]);
        if (closestFish) {
            this.pickUpFish(closestFish);
        }
    };

    private pickUpFish = (closestFish: GameObject) => {
        this.player.isHoldingFish = true;
        // It might be more efficient to use an object pool but we're not going to have that many fish ... right?
        closestFish.destroy();
    };

    private dropFish = () => {
        this.player.isHoldingFish = false;
        this.placeFish(this.player.x, this.player.y);
    };

    private placeFish = (x: number, y: number) => {
        const fish = new Image(this.scene, x, y, 'fish');
        fish.scale = this.scene.gameWidth * 0.02 / fish.displayWidth;
        this.add(fish);
        this.scene.add.existing(fish);
        this.placeFishCallback(fish);
    };
}
