import Sprite = Phaser.GameObjects.Sprite;

export class OrganShaker {

    private readonly maximumRotationLimit = 15;
    private readonly shakingSpeed = 0.15;
    private rotationDirection = 1;

    public constructor(private organ: Sprite) {
    }

    // A higher urgency percentage leads to a bigger shake.
    public shakeIfUrgent = (urgencyPercentage: number) => {
        const rotationLimit = this.calculateRotationLimit(urgencyPercentage);
        if (this.organ.angle < -rotationLimit) {
            this.rotationDirection = 1;
        }
        if (this.organ.angle > rotationLimit) {
            this.rotationDirection = -1;
        }
        this.organ.angle += this.rotationDirection * this.shakingSpeed * rotationLimit;
    };

    private calculateRotationLimit = (urgencyPercentage: number) => {
        const linearZeroToOne = Math.min(urgencyPercentage, 100) / 100;
        const cubicZeroToOne = Math.pow(linearZeroToOne, 3);
        return cubicZeroToOne * this.maximumRotationLimit;
    };
}
