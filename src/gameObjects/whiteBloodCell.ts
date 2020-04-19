import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import Sprite = Phaser.Physics.Arcade.Sprite;
import GameObject = Phaser.GameObjects.GameObject;
import {Level} from '../scenes/level';
import {Virus, WhiteBloodCellState} from '../state/stateManager';
import { Viruses } from './viruses';

export class WhiteBloodCell extends Sprite {
    private _isAttackingVirus = false;

    public constructor(
        public scene: Level,
        private initialX: number,
        private initialY: number,
        private targets: Viruses
    ) {
        super(scene, initialX, initialY, 'whiteBloodCell');

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setDepth(1);
    }

    public update = (whiteBloodCellState: WhiteBloodCellState) => {
        this.x = whiteBloodCellState.position.x;
        this.y = whiteBloodCellState.position.y;
        this.setVisible(whiteBloodCellState.enabled);
        const closestTarget = this.scene.physics.closest(this, this.targets.getChildren()) as Sprite;
        if (closestTarget
            && this.scene.getDistanceBetweenBandACentres(this, closestTarget) < this.displayHeight
            && !this._isAttackingVirus
        ) {
            // Use a timeout to give the impression that the white blood cells are taking time to kill the virus
            this._isAttackingVirus = true;
            setTimeout(() => {
                this._isAttackingVirus = false;
                this.scene.stateManager.handleEvent({
                    type: 'DESTROY_VIRUS',
                    id: closestTarget.name,
                });
            }, 1000);
        }
    };

    public getUpdatedGameState = (
        whiteBloodCellState: WhiteBloodCellState, viruses: Virus[], baseSpeed: number, waterSpeed: number, waterLevelY: number
    ) => {
        if (!whiteBloodCellState.enabled || viruses.length === 0) {
            return {
                enabled: false,
                position: {
                    x: this.initialX,
                    y: this.initialY,
                },
                velocity: {
                    x: 0,
                    y: 0,
                }
            } as WhiteBloodCellState;
        }
        const speed = this.y >= waterLevelY ? waterSpeed : baseSpeed;
        const target = this.scene.physics.closest(this, this.targets.getChildren()) as Phaser.GameObjects.Sprite;
        if (!target) {
            return whiteBloodCellState;
        }
        const xDistance = target.x - this.x;
        const yDistance = target.y - this.y;
        const distance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
        const ratio = speed / distance;
        whiteBloodCellState.velocity.x = ratio * xDistance;
        whiteBloodCellState.velocity.y = ratio * yDistance;
        // Use the estimate of 60 frames per second
        whiteBloodCellState.position.x += whiteBloodCellState.velocity.x * 1/60;
        whiteBloodCellState.position.y += whiteBloodCellState.velocity.y * 1/60;
        return whiteBloodCellState;
    };
}
