import { CatStatus } from './../gameObjects/catStatus';
import { OutsideCat } from './outsideCat';
import {Level} from '../scenes/level';

export default class OutsideView {

    private viewWidth: number;
    private viewHeight: number;
    private viewTopLeftX: number;
    private viewTopLeftY: number;

    private background: Phaser.GameObjects.Rectangle;
    private status: CatStatus = CatStatus.Asleep;

    private cat: OutsideCat;

    public constructor(private scene: Level) {
        this.calculateBounds();
        this.drawBorder();
        this.drawCat();
    }

    update(status: CatStatus) {
        if (status === this.status) {
            return;
        }
        switch (status) {
            case CatStatus.Awake: this.wakeUp(); break;
            case CatStatus.Drinking: this.drink(); break;
            case CatStatus.Eating: this.eat(); break;
            case CatStatus.Ill: this.becomeIll(); break;
            case CatStatus.Dead: this.die(); break;
        }
        this.status = status;
    }

    // Outside view takes up 40% of height and width of game, and is positioned in bottom right corner.
    private calculateBounds = () => {
        this.viewWidth = this.scene.gameWidth * 0.4;
        this.viewHeight = this.scene.gameHeight * 0.4;
        this.viewTopLeftX = this.scene.gameWidth - this.viewWidth - 20;
        this.viewTopLeftY = this.scene.gameHeight - this.viewHeight - 20;
    };

    private drawBorder = () => {
        const {x, y} = this.viewPositionToGamePosition(0.5, 0.5);
        this.background = this.scene.add.rectangle(x, y, this.viewWidth, this.viewHeight, 0x6984B5);
        this.background.setStrokeStyle(2, 0x404040);
    };

    private updateBackgroundColour = (colour: number) => {
        this.background.setFillStyle(colour);
    };

    private drawCat = () => {
        const {x, y} = this.viewPositionToGamePosition(0.5, 0.5);
        this.cat = new OutsideCat(this.scene, x, y);
        this.cat.scale = (this.viewWidth * 0.75) / this.cat.displayWidth;
    };

    private viewPositionToGamePosition = (x: number, y: number) => ({
        x: this.viewTopLeftX + x * this.viewWidth,
        y: this.viewTopLeftY + y * this.viewHeight
    });

    private wakeUp = () => {
        this.updateBackgroundColour(0x63DBF9);
        this.cat.wakeUp();
    };

    private drink = () => {
        this.updateBackgroundColour(0xFF8488);
        this.cat.drink();
    };

    private eat = () => {
        this.updateBackgroundColour(0xFFCA3A);
        this.cat.eat();
    };

    private becomeIll = () => {
        this.updateBackgroundColour(0xBCC6C5);
        this.cat.becomeIll();
    };

    private die = () => {
        this.updateBackgroundColour(0xFFFFFF);
        this.cat.die();
    };
}
