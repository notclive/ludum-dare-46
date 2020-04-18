import {Level} from '../scenes/level';

export default class OutsideView {

    private viewWidth: number;
    private viewHeight: number;
    private viewTopLeftX: number;
    private viewTopLeftY: number;

    public constructor(private scene: Level) {
        this.calculateBounds();
        this.drawBorder();
        this.drawCat();
    }

    // Outside view takes up 40% of height and width of game, and is positioned in bottom right corner.
    private calculateBounds = () => {
        this.viewWidth = this.scene.gameWidth * 0.4;
        this.viewHeight = this.scene.gameHeight * 0.4;
        this.viewTopLeftX = this.scene.gameWidth - this.viewWidth;
        this.viewTopLeftY = this.scene.gameHeight - this.viewHeight;
    };

    private drawBorder = () => {
        const {x, y} = this.viewPositionToGamePosition(0.5, 0.5);
        this.scene.add.rectangle(x, y, this.viewWidth, this.viewHeight, 0);
    };

    private drawCat = () => {
        const {x, y} = this.viewPositionToGamePosition(0.5, 0.5);
        let catImage = this.scene.add.image(x, y, 'cat');
        catImage.scale = (this.viewWidth * 0.5) / catImage.displayWidth;
    };

    private viewPositionToGamePosition = (x: number, y: number) => ({
        x: this.viewTopLeftX + x * this.viewWidth,
        y: this.viewTopLeftY + y * this.viewHeight
    });
}
