import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import Image = Phaser.GameObjects.Image;
import {Level} from '../scenes/level';
import {GameState} from '../state/stateManager';

// Could be replaced by a sprite representing a pile of fish.
export default class Fishes extends StaticGroup {

    public constructor(public scene: Level) {
        super(scene.physics.world, scene);
    }

    public update = (state: GameState) => {
        this.maybePickUpFish();
        this.ensureCorrectNumberOfFishAreShown(state);
    };

    private maybePickUpFish = () => {
        if (this.scene.stateManager.myPlayer.holdingFish) {
            return;
        }
        const playerIsTouchingFish = !!this.getChildren().find(image => this.scene.player.isTouching(image as Image));
        if (playerIsTouchingFish) {
            this.pickUpFish();
        }
    };

    private pickUpFish = () => {
        this.scene.stateManager.myPlayer = {
            ...this.scene.stateManager.myPlayer,
            holdingFish: true
        };
        this.scene.stateManager.handleEvent({
            type: 'TAKE_FISH_FROM_PILE'
        });
    };

    private ensureCorrectNumberOfFishAreShown(state: GameState) {
        const numberOfFishDrawn = this.getChildren().length;
        if (state.fishes.numberOfFishInPile > numberOfFishDrawn) {
            this.drawFish();
        }
        if (state.fishes.numberOfFishInPile < numberOfFishDrawn) {
            this.destroyFish();
        }
    }

    private destroyFish = () => {
        if (this.getChildren().length === 0) {
            return;
        }
        this.getChildren()[0].destroy();
    };

    private drawFish = () => {
        const {x, y} = this.generateFishCoordinates();
        const image = new Image(this.scene, x, y, 'fish');
        image.scale = 0.6;
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
