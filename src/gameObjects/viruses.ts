import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import Sprite = Phaser.Physics.Arcade.Sprite;
import GameObject = Phaser.GameObjects.GameObject;
import {Level} from '../scenes/level';
import {Player} from './player';
import {GameObjectPosition, Virus} from '../multiplayer/stateManager';

export class Viruses extends StaticGroup {
    public constructor(
        public scene: Level,
        private player: Player,
        private targets: Phaser.GameObjects.Sprite[]
    ) {
        super(scene.physics.world, scene);
    }

    public createNewVirus = () => {
        const catMouthX = 340;
        const catMouthY = 340;
        this.createVirus({x: catMouthX, y: catMouthY});
    };

    public update = (viruses: Virus[]) => {
        this.destroyVirusesThatNoLongerExist(viruses);
        this.getVirusSpritePair(viruses)
            .forEach((spriteVirusPair) => {
                if (!spriteVirusPair.sprite) {
                    this.addNewVirus(spriteVirusPair.virus);
                } else {
                    this.updateSpritePosition(spriteVirusPair.sprite, spriteVirusPair.virus);
                }
            });
    };

    public updateVirusesMovement = (viruses: Virus[]) => {
        const speed = 100;
        return this.getVirusSpritePair(viruses).map(({virus, sprite}) => {
            if (!sprite) {
                return virus;
            }
            const target = this.scene.physics.closest(sprite, this.targets) as Phaser.GameObjects.Sprite;
            const xDistance = target.x - sprite.x;
            const yDistance = target.y - sprite.y;
            const distance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
            const ratio = speed / distance;
            virus.velocity.x = ratio * xDistance;
            virus.velocity.y = ratio * yDistance;
            // Use the estimate of 60 frames per second
            virus.position.x += virus.velocity.x * 1/60;
            virus.position.y += virus.velocity.y * 1/60;
            return virus;
        });
    };

    private createVirus = (position: GameObjectPosition) => {
        this.scene.stateManager.handleEvent({
            type: 'PLACE_VIRUS',
            id: this.scene.stateManager.generateGloballyUniqueId(),
            position: position,
        });
    };

    private destroyVirusesThatNoLongerExist = (viruses: Virus[]) => {
        const idsThatStillExist = viruses.map(f => f.id);
        this.getChildren()
            .filter(image => !idsThatStillExist.includes(image.name))
            .forEach(image => {
                image.destroy();
            });
    };

    private addNewVirus = (virus: Virus) => {
        const sprite = new Sprite(this.scene, virus.position.x, virus.position.y, 'virus');
        sprite.name = virus.id;
        this.add(sprite);
        this.scene.add.existing(sprite);
    };

    private updateSpritePosition = (sprite: Sprite, virus: Virus) => {
        sprite.x = virus.position.x;
        sprite.y = virus.position.y;
        if (this.scene.getDistanceBetweenBandACentres(sprite, this.player) < this.player.displayHeight) {
            this.player.x = this.player.x + (virus.velocity.x / 2);
            this.player.y = this.player.y + (virus.velocity.y / 2);
        }
    };

    private getVirusSpritePair = (viruses: Virus[]) => {
        const sprites = this.getChildren() as Sprite[];
        return viruses.map((virus) => ({virus, sprite: sprites.filter(sprite => sprite.name === virus.id)[0]}));
    };
}
