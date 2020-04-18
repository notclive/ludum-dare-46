type MoveableGameObject =
    Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | Phaser.GameObjects.Image;

export class SceneBase extends Phaser.Scene {
    public get gameWidth(): number {
        return this.sys.game.config.width as number;
    }

    public get gameHeight(): number {
        return this.sys.game.config.height as number;
    }

    protected centreObjectX(object: MoveableGameObject) {
        object.x = (this.gameWidth / 2) - (object.displayWidth / 2);
    }

    protected centreObjectY(object: MoveableGameObject) {
        object.y = (this.gameHeight / 2) - (object.displayHeight / 2);
    }

    protected centreObject(object: MoveableGameObject) {
        this.centreObjectX(object);
        this.centreObjectY(object);
    }

    protected scaleObjectToGameWidth(object: MoveableGameObject, percentage: number) {
        object.displayWidth = this.gameWidth * percentage;
        object.scaleY = object.scaleX;
    }
}