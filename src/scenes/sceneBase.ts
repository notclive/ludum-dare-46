export type MoveableGameObject =
    Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | Phaser.GameObjects.Image;

export class SceneBase extends Phaser.Scene {

    public get gameWidth(): number {
        return this.sys.game.config.width as number;
    }

    public get gameHeight(): number {
        return this.sys.game.config.height as number;
    }

    public getClosestBTouchingA(a: MoveableGameObject, b: MoveableGameObject[]) {
        const bsThatAreTouching = b.filter(x => this.bIsTouchingA(a, x));
        if (bsThatAreTouching.length === 0) {
            return;
        }

        return bsThatAreTouching[0];
    }

    public bIsTouchingA(a: MoveableGameObject, b: MoveableGameObject) {
        // 4 pixels grace
        const xAllowableDistance = (a.displayWidth / 2) + (b.displayWidth / 2) + 4;
        const yAllowableDistance = (a.displayHeight / 2) + (b.displayHeight / 2) + 4;
        return Math.abs(a.x - b.x) <= xAllowableDistance && Math.abs(a.y - b.y) <= yAllowableDistance;
    }

    public getDistanceBetweenBandACentres(a: MoveableGameObject, b: MoveableGameObject) {
        const xDistance = Math.abs(a.x - b.x);
        const yDistance = Math.abs(a.y - b.y);
        return Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
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