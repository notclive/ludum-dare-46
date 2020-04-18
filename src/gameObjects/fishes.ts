import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import Image = Phaser.GameObjects.Image;
import Distance = Phaser.Math.Distance;
import {Level} from '../scenes/level';
import {Player} from './player';
import GameObject = Phaser.GameObjects.GameObject;

export default class Fishes extends StaticGroup {
    private fishGenerationId: NodeJS.Timeout;

    public constructor(public scene: Level, private player: Player, private placeFishCallback: (fish: Image) => void) {
        super(scene.physics.world, scene);
        this.generateFishEveryFifteenSeconds();
        this.handleFishKeyBeingPressed();
    }

    public stopGeneratingFish = () => {
        clearInterval(this.fishGenerationId);
    };

    private generateFishEveryFifteenSeconds = () => {
        this.generateFish();
        this.fishGenerationId = setInterval(() => {
            this.generateFish();
        }, 15 * 1000);
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
        const closestFish = this.scene.physics.closest(this.player, this.children.entries) as Image;
        if (!closestFish) {
            return;
        }
        const distanceToFish = Distance.Between(closestFish.x, closestFish.y, this.player.x, this.player.y);
        // 30 seems about right on my screen, but probably needs to be scaled with the window.
        if (distanceToFish < 30) {
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
