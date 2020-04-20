import * as Phaser from 'phaser';
import {Level} from '../scenes/level';
import Color = Phaser.Display.Color;
import Graphics = Phaser.GameObjects.Graphics;

export const STAT_BAR_WIDTH = 100;
export const STAT_BAR_HEIGHT = 460;
export const STAT_BAR_RADIUS = 10;
export const LAG_IN_TICKS = 30;

export class StatBar {

    private readonly heightHistory = Array(LAG_IN_TICKS).fill(STAT_BAR_HEIGHT);
    private readonly laggingBar: Graphics;
    private readonly currentValueBar: Graphics;

    public constructor(public scene: Level, private x: number, private y: number, private label: string) {
        const text = this.scene.add.text(this.x + (STAT_BAR_WIDTH / 2), this.y + 10 + STAT_BAR_HEIGHT, this.label, {fontSize: '20px', fill: '#000'});
        text.x -= text.displayWidth / 2;

        const container = this.scene.add.graphics();
        container.fillStyle(Color.HexStringToColor('#6D1213').color);
        container.fillRoundedRect(this.x , this.y, STAT_BAR_WIDTH, STAT_BAR_HEIGHT, STAT_BAR_RADIUS);

        this.currentValueBar = this.scene.add.graphics();
        this.laggingBar = this.scene.add.graphics();
    }

    public update(value: number) {
        this.fillCurrentBar(value);
        this.fillLaggingBar();
    }

    private fillLaggingBar = () => {
        const lagHeight = this.heightHistory.shift();
        this.laggingBar.clear();
        this.laggingBar.fillStyle(Color.HexStringToColor('#DB484C').color);
        this.laggingBar.fillRoundedRect(this.x, this.y + STAT_BAR_HEIGHT - lagHeight, STAT_BAR_WIDTH, lagHeight, STAT_BAR_RADIUS);
    };

    private fillCurrentBar = (value: number) => {
        const barHeight = STAT_BAR_HEIGHT * value / 100;
        this.heightHistory.push(barHeight);
        this.currentValueBar.clear();
        this.currentValueBar.fillStyle(Color.HexStringToColor('#FFCA3A').color);
        this.currentValueBar.fillRoundedRect(this.x, this.y + STAT_BAR_HEIGHT - barHeight, STAT_BAR_WIDTH, barHeight, STAT_BAR_RADIUS);
    };
}
