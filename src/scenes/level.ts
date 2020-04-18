import * as Phaser from 'phaser';
import { SceneBase } from './sceneBase';
import { Player } from '../gameObjects/player';
import { Heart } from '../gameObjects/heart';
import { StatBar } from '../gameObjects/statBar';

export class Level extends SceneBase {
    private player: Player;
    private heart: Heart;
    private healthBar: StatBar;
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private stars: Phaser.Physics.Arcade.Group;
    private bombs: Phaser.Physics.Arcade.Group;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private scoreText: Phaser.GameObjects.Text;
    private score = 0;
    private gameOver = false;

    create() {
        const background = this.add.image(0, 0, 'sky');
        this.centreObject(background);
        this.scaleObjectToGameWidth(background, 1);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(this.gameWidth / 2, this.gameHeight - 22, 'ground').setScale(4).refreshBody();

        this.player = new Player(this, 100, 450);
        this.heart = new Heart(this, 300, 450, 20);
        this.healthBar = new StatBar(this, 20, 50, 'HP');

        this.stars = this.physics.add.group();
        this.createStars();

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.player, this.heart, () => this.heart.pump(), null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    };

    update() {
        if (this.gameOver) {
            return;
        }

        this.heart.update();
        if (this.heart.getHealth() <= 0) {
            this.endGame();
        }

        this.player.update(this.cursors);
        this.healthBar.update(this.heart.getHealth());
    };

    private collectStar(player: Player, star: Phaser.GameObjects.GameObject) {
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

    private hitBomb(player: Player, bomb: Phaser.GameObjects.GameObject) {
        this.endGame();
    }

    private createStars() {
        for (let i = 0; i < 12; i++) {
            this.stars.create(12 + (70 * i), 0, 'star');
        }

        this.stars.children.iterate((star) => {
            (star.body as Phaser.Physics.Arcade.Body).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    }

    private endGame() {
        this.physics.pause();
        this.player.gameOver();
        this.gameOver = true;
    }
}