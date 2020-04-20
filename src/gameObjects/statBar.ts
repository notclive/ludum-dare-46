import * as Phaser from 'phaser';
import {Level} from '../scenes/level';
import Color = Phaser.Display.Color;
import Graphics = Phaser.GameObjects.Graphics;

export const STAT_BAR_WIDTH = 460;
export const STAT_BAR_HEIGHT = 30;
export const LABEL_WIDTH = 70;
export const STAT_BAR_RADIUS = 10;
export const LAG_IN_TICKS = 30;

export class StatBar {

    private readonly widthHistory = Array(LAG_IN_TICKS).fill(STAT_BAR_WIDTH);
    private readonly laggingBar: Graphics;
    private readonly currentValueBar: Graphics;

    public constructor(public scene: Level, private x: number, private y: number, private label: string) {
        this.scene.add.text(this.x, this.y + 5, this.label, {fontSize: '20px', fill: '#000'});

        const container = this.scene.add.graphics();
        container.fillStyle(Color.HexStringToColor('#6D1213').color);
        container.fillRoundedRect(this.x + LABEL_WIDTH, this.y, STAT_BAR_WIDTH, STAT_BAR_HEIGHT, STAT_BAR_RADIUS);

        this.currentValueBar = this.scene.add.graphics();
        this.laggingBar = this.scene.add.graphics();
    }

    public update(value: number) {
        this.fillCurrentBar(value);
        this.fillLaggingBar();
    }

    private fillLaggingBar = () => {
        const lagWidth = this.widthHistory.shift();
        this.laggingBar.clear();
        this.laggingBar.fillStyle(Color.HexStringToColor('#DB484C').color);
        this.laggingBar.fillRoundedRect(this.x + LABEL_WIDTH, this.y, lagWidth, STAT_BAR_HEIGHT, STAT_BAR_RADIUS);
    };

    private fillCurrentBar = (value: number) => {
        const barWidth = STAT_BAR_WIDTH * value / 100;
        this.widthHistory.push(barWidth);
        this.currentValueBar.clear();
        this.currentValueBar.fillStyle(Color.HexStringToColor('#FFCA3A').color);
        this.currentValueBar.fillRoundedRect(this.x + LABEL_WIDTH, this.y, barWidth, STAT_BAR_HEIGHT, STAT_BAR_RADIUS);
    };
}
