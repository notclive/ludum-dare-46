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
        this.scene.add.text(this.x, this.y + 5, this.label, {
            fontSize: '20px', fill: '#fff', shadow: {color: '#000', fill: true, blur: 7}
        });

        const container = this.scene.add.graphics();
        container.fillStyle(Color.HexStringToColor('#6D1213').color);
        container.fillRoundedRect(this.x + LABEL_WIDTH, this.y, STAT_BAR_WIDTH, STAT_BAR_HEIGHT, STAT_BAR_RADIUS);

        this.currentValueBar = this.scene.add.graphics();
        this.laggingBar = this.scene.add.graphics();
    }

    public update(value: number) {
        if (value < 1) {
            return;
        }
        this.fillCurrentBar(value);
        this.fillLaggingBar();
    }

    private fillLaggingBar = () => {
        const lagWidth = this.widthHistory.shift();
        this.fillBar(this.laggingBar, Color.HexStringToColor('#DB484C'), lagWidth);
    };

    private fillCurrentBar = (value: number) => {
        const barWidth = STAT_BAR_WIDTH * value / 100;
        this.widthHistory.push(barWidth);
        this.fillBar(this.currentValueBar, Color.HexStringToColor('#FFCA3A'), barWidth);
    };

    private fillBar = (bar: Graphics, {color}: Color, desiredWidth: number) => {
        if (desiredWidth < 1) {
            return;
        }
        bar.clear();
        bar.fillStyle(color);
        const desiredWidthCannotBeDrawnWithRoundedRectangle = desiredWidth < 100 * STAT_BAR_HEIGHT / STAT_BAR_WIDTH;
        if (desiredWidthCannotBeDrawnWithRoundedRectangle) {
            bar.fillEllipse(this.x + LABEL_WIDTH + (desiredWidth / 2), this.y + (STAT_BAR_HEIGHT / 2), desiredWidth, STAT_BAR_HEIGHT);
        } else {
            bar.fillRoundedRect(this.x + LABEL_WIDTH, this.y, desiredWidth, STAT_BAR_HEIGHT, STAT_BAR_RADIUS);
        }

    }
}
