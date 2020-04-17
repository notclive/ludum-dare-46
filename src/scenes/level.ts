import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';
import { Player } from '../gameObjects/player';

export class Level extends SceneBase {
    private player: Player;
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private stars: Phaser.Physics.Arcade.Group;
    private bombs: Phaser.Physics.Arcade.Group;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private scoreText: Phaser.GameObjects.Text;
    private score = 0;
    private gameOver = false;

    create() {
        const background = this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = new Player(this, 100, 450);

        this.stars = this.physics.add.group();
        this.createStars();
        
        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    };

    update() {
        if (this.gameOver) {
            return;
        }

        this.player.update(this.cursors);
    };

    private collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.GameObjects.GameObject) {
        star.destroy();

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        if (this.stars.countActive(true) === 0)
        {
            this.createStars();

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    private hitBomb(player: Phaser.Physics.Arcade.Sprite, bomb: Phaser.GameObjects.GameObject) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
    
        this.gameOver = true;
    }

    private createStars() {
        for (let i = 0; i < 12; i++) {
            this.stars.create(12 + (70 * i), 0, 'star');
        }

        this.stars.children.iterate((star) => {
            (star.body as Phaser.Physics.Arcade.Body).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    }
}