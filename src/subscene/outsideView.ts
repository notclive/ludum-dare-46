import { CatStatus } from './../gameObjects/catStatus';
import { OutsideCat } from './outsideCat';
import {Level} from '../scenes/level';

export default class OutsideView {

    private viewWidth: number;
    private viewHeight: number;
    private viewTopLeftX: number;
    private viewTopLeftY: number;

    private cat: OutsideCat;

    public constructor(private scene: Level) {
        this.calculateBounds();
        this.drawBorder();
        this.drawCat();
    }

    update(status: CatStatus) {
        switch (status) {
            case CatStatus.Awake: this.cat.wakeUp(); break;
            case CatStatus.Drinking: this.cat.drink(); break;
        }
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
        this.cat = new OutsideCat(this.scene, x, y);
        this.cat.scale = (this.viewWidth * 0.5) / this.cat.displayWidth;
    };

    private viewPositionToGamePosition = (x: number, y: number) => ({
        x: this.viewTopLeftX + x * this.viewWidth,
        y: this.viewTopLeftY + y * this.viewHeight
    });
}
