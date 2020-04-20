import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import Image = Phaser.GameObjects.Image;
import {Level} from '../scenes/level';
import {Player} from './player';
import {GameState} from '../state/stateManager';
import {Stomach} from './stomach';

// Could be replaced by a sprite representing a pile of fish.
export default class Fishes extends StaticGroup {

    public constructor(
        public scene: Level,
        private player: Player,
        private stomach: Stomach
    ) {
        super(scene.physics.world, scene);
        this.handleFishKeyBeingPressed();
    }

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
            this.pickUpFish();
        }
    };

    private pickUpFish = () => {
        this.player.isHoldingFish = true;
        this.scene.stateManager.handleEvent({
            type: 'TAKE_FISH_FROM_PILE'
        });
    };

    private dropFish = () => {
        // For now dropped fish disappear, shortly players won't be able to control when fish are dropped.
        this.player.isHoldingFish = false;
        if (this.player.isTouching(this.stomach)) {
            this.scene.stateManager.handleEvent({
                type: 'DIGEST_FOOD'
            });
        }
    };

    public update = (state: GameState) => {
        const numberOfFishDrawn = this.getChildren().length;
        if (state.fishes.numberOfFishInPile > numberOfFishDrawn) {
            this.drawFish();
        }
        if (state.fishes.numberOfFishInPile < numberOfFishDrawn) {
            this.destroyFish();
        }
    };

    private destroyFish = () => {
        if (this.getChildren().length === 0) {
            return;
        }
        this.getChildren()[0].destroy();
    };

    private drawFish = () => {
        const {x, y} = this.generateFishCoordinates();
        const image = new Image(this.scene, x, y, 'fish');
        this.add(image);
        this.scene.add.existing(image);
    };

    // Jitter is added so that multiple fish look like a pile rather than one fish.
    private generateFishCoordinates = () => {
        const catMouthX = 325;
        const catMouthY = 365;
        const xJitter = Math.random() * 45;
        const yJitter = Math.random() * 30;
        return {x: catMouthX + xJitter, y: catMouthY + yJitter};
    };
}
