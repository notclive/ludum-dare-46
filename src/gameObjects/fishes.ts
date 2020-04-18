import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import Image = Phaser.GameObjects.Image;
import GameObject = Phaser.GameObjects.GameObject;
import {Level} from '../scenes/level';
import {Player} from './player';
import {Fish} from '../multiplayer/stateManager';
import {Stomach} from './stomach';

export default class Fishes extends StaticGroup {

    public constructor(
        public scene: Level,
        private x: number,
        private y: number,
        private player: Player,
        private stomach: Stomach
    ) {
        super(scene.physics.world, scene);
        this.handleFishKeyBeingPressed();
    }

    public generateFishRegularlyForAWhile = () => {
        // Not exact, but it doesn't matter.
        const ticksPerSecond = 60;
        for (let delayInSeconds = 0; delayInSeconds < 40; delayInSeconds += 10) {
            this.scene.stateManager.handleEvent({
                type: 'PLACE_FISH',
                id: this.generateGloballyUniqueFishId(),
                position: this.generateFishCoordinates(),
                ticksUntilVisible: ticksPerSecond * delayInSeconds
            });
        }
    };

    // Jitter is added so that multiple fish look like a pile rather than one fish.
    private generateFishCoordinates = () => {
        const xJitter = Math.random() * 40;
        const yJitter = Math.random() * 40;
        const x = this.x + xJitter;
        const y = this.y + yJitter;
        return {x, y};
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
        this.scene.stateManager.handleEvent({
            type: 'REMOVE_FISH',
            id: closestFish.name
        });
    };

    private dropFish = () => {
        this.player.isHoldingFish = false;
        if (this.player.isTouching(this.stomach)) {
            this.scene.stateManager.handleEvent({
                type: 'DIGEST_FOOD'
            });
        } else {
            this.scene.stateManager.handleEvent({
                type: 'PLACE_FISH',
                id: this.generateGloballyUniqueFishId(),
                position: {x: this.player.x, y: this.player.y},
                ticksUntilVisible: 0
            });
        }
    };

    // Globally unique so that other players can generate fish.
    private generateGloballyUniqueFishId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    public update = (fishes: Fish[], gameTime: number) => {
        this.destroyFishThatNoLongerExist(fishes);
        this.drawNewFishes(fishes, gameTime);
    };

    private destroyFishThatNoLongerExist = (fishes: Fish[]) => {
        const idsThatStillExist = fishes.map(f => f.id);
        this.getChildren()
            .filter(image => !idsThatStillExist.includes(image.name))
            .forEach(image => {
                image.destroy();
            });
    };

    private drawNewFishes = (fishes: Fish[], gameTime: number) => {
        const idsThatHaveBeenDrawn = this.getChildren().map(image => image.name);
        fishes.filter(fish => !idsThatHaveBeenDrawn.includes(fish.id))
            .filter(fish => fish.visibleAfterGameTime < gameTime)
            .forEach(this.drawNewFish);
    };

    private drawNewFish = (fish: Fish) => {
        const image = new Image(this.scene, fish.position.x, fish.position.y, 'fish');
        image.name = fish.id;
        image.scale = this.scene.gameWidth * 0.02 / image.displayWidth;
        this.add(image);
        this.scene.add.existing(image);
    };
}
