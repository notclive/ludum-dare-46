import * as Phaser from 'phaser';
import {SceneBase} from './sceneBase';
import {Player} from '../gameObjects/player';
import {Heart} from '../gameObjects/heart';
import {StatBar} from '../gameObjects/statBar';
import {Lungs} from '../gameObjects/lungs';
import OutsideView from '../subscene/outsideView';
import Fishes from '../gameObjects/fishes';
import {Brain} from '../gameObjects/brain';
import {Stomach} from '../gameObjects/stomach';
import {Plug} from '../gameObjects/plug';
import {Water} from '../gameObjects/water';
import {StateManager} from '../multiplayer/stateManager';
import {listenForMultiplayerHotkeys} from '../multiplayer/multiplayer';
import HostStateManager from '../multiplayer/hostStateManager';

export class Level extends SceneBase {

    private _stateManager: StateManager = new HostStateManager();
    private player: Player;
    private externalPlayer: Phaser.GameObjects.Sprite;
    private heart: Heart;
    private healthBar: StatBar;
    private lungs: Lungs;
    private breatheBar: StatBar;
    private stomach: Stomach;
    private foodBar: StatBar;
    private brain: Brain;
    private plug: Plug;
    private water: Water;
    private fishes: Fishes;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private outsideView: OutsideView;
    private spaceBarDown = false;
    private walls: Phaser.Physics.Arcade.StaticGroup;
    private isInBrain: boolean;

    create() {
        this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');

        const leftGameWidth = this.gameWidth / 2;

        const catBackground = this.add.image(0, 0, 'catBackground');
        const catXPosition = (leftGameWidth / 2);
        const catTopY = (this.gameHeight - catBackground.displayHeight) / 2;

        catBackground.x = catXPosition;
        catBackground.y = this.gameHeight / 2;

        this.player = new Player(this, leftGameWidth / 2, this.gameHeight / 2);
        this.externalPlayer = this.add.sprite(0, 0, 'player2');

        this.heart = new Heart(this, 3 * leftGameWidth / 4, this.gameHeight / 2);
        this.healthBar = new StatBar(this, leftGameWidth + 20, 30, 'Blood');

        this.lungs = new Lungs(this, (leftGameWidth) / 4, this.gameHeight / 2);
        this.breatheBar = new StatBar(this, leftGameWidth + 20, 60, 'O2');

        this.stomach = new Stomach(this, 5 * leftGameWidth / 8, (3 * this.gameHeight) / 4);
        this.foodBar = new StatBar(this, leftGameWidth + 20, 90, 'Food');

        this.brain = new Brain(this, leftGameWidth/2, this.gameHeight/3, this.player);

        this.water = new Water(this, catXPosition, catTopY + catBackground.displayHeight, catTopY);
        this.plug = new Plug(this, 3 * leftGameWidth / 8, (3 * this.gameHeight) / 4, this.water);
        
        this.physics.add.collider(this.player, this.heart);
        this.physics.add.collider(this.player, this.lungs);
        this.physics.add.collider(this.player, this.plug);

        this.walls = this.physics.add.staticGroup();
        this.createWalls();
        this.physics.add.collider(this.player, this.walls);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.outsideView = new OutsideView(this);

        this.fishes = new Fishes(this, leftGameWidth / 2, this.gameHeight / 2,  this.player, this.stomach);
        listenForMultiplayerHotkeys(this);
    }

    update() {
        if (this.stateManager.state.gameOver) {
            this.endGame();
            return;
        }

        this.stateManager.tick();

        const baseWalkingSpeed = 160;
        const walkingSpeed = this.player.y > this.water.YOfTheWaterLevel()
            ? baseWalkingSpeed / 2
            : baseWalkingSpeed;

        this.player.update(walkingSpeed, this.cursors);
        this.stateManager.myPosition = {x: this.player.x, y: this.player.y};
        this.updateGameObjectsFromState();

        if (this.player.isTouching(this.brain)) {
            if (!this.isInBrain) {
                this.brain.showDecision();
            }
            this.isInBrain = true;
        } else {
            if (this.isInBrain) {
                this.brain.hideDecision();
            }
            this.isInBrain = false;
        }

        if (this.cursors.space.isDown) {
            this.handleSpaceBar();
            this.spaceBarDown = true;
        } else {
            this.spaceBarDown = false;
        }
    }

    private endGame() {
        this.physics.pause();
        this.player.gameOver();
    }

    private updateGameObjectsFromState() {
        this.externalPlayer.setPosition(this.stateManager.otherPlayerPosition.x, this.stateManager.otherPlayerPosition.y);
        this.fishes.update(this.stateManager.state.fishes, this.stateManager.state.gameTime);
        this.healthBar.update(this.stateManager.state.heart);
        this.breatheBar.update(this.stateManager.state.lungs);
        this.plug.update(this.stateManager.state.waterLevel);
        this.foodBar.update(this.stateManager.state.fullness);
    }

    private handleSpaceBar() {
        if (this.bIsTouchingA(this.player, this.heart)) {
            if (!this.spaceBarDown) {
                this.beatHeart();
            }
        }
        if (this.bIsTouchingA(this.player, this.lungs)) {
            if (this.cursors.space.getDuration() > 200) {
                this.pumpLungs();
            }
        }
        if (this.bIsTouchingA(this.player, this.plug)) {
            if (this.cursors.space.getDuration() > 200) {
                this.openPlug();
            }
        }
        if (this.bIsTouchingA(this.player, this.brain)) {
            if (!this.spaceBarDown) {
                this.brain.tryPressButton(this.fishes.generateFishRegularlyForAWhile);
            }
        }
    }

    private beatHeart = () => {
        this.stateManager.handleEvent({
            type: 'BEAT_HEART'
        });
    };

    private pumpLungs = () => {
        this.stateManager.handleEvent({
            type: 'PUMP_LUNGS'
        });
    };

    private createWalls() {
        const wallSize = 20;
        const leftMargin = 100;
        const topMargin = 150;

        const xScale = (this.gameWidth - leftMargin * 2) / wallSize;
        const yScale = (this.gameHeight - topMargin * 2) / wallSize;

        this.walls.create(this.gameWidth / 2, topMargin, 'wall').setScale(xScale, 1).refreshBody();
        this.walls.create(this.gameWidth / 2, this.gameHeight - topMargin, 'wall').setScale(xScale, 1).refreshBody();
        this.walls.create(leftMargin, this.gameHeight / 2, 'wall').setScale(1, yScale).refreshBody();
        this.walls.create(this.gameWidth - leftMargin, this.gameHeight / 2, 'wall').setScale(1, yScale).refreshBody();
    }

    private openPlug = () => {
        if (this.plug.getIsPlugged()) {
            this.cursors.space.once('up', () => this.plug.plug());
            this.plug.unplug();
        }
        this.stateManager.handleEvent({
            type: 'DRAIN_PLUG'
        });
    };

    public get stateManager() {
        return this._stateManager;
    }

    public set stateManager(stateManager) {
        this._stateManager = stateManager;
    }
}
