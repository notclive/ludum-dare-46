export interface GameConfig {
    bloodLossPerTick: number;
    o2LossPerTick: number;
    foodLossPerTick: number;
    waterRisePerTick: number;

    bloodRisePerPump: number;
    o2RisePerTick: number;
    foodRisePerFish: number;
    waterLossPerTick: number;

    baseWalkingSpeed: number;
    waterWalkingSpeed: number;

    virusBaseSpeed: number;
    virusWaterSpeed: number;

    bloodCellsBaseSpeed: number;
    bloodCellsWaterSpeed: number;

    ticksForVirusToReproduce: number;
}

export const singlePlayerConfig: GameConfig = {
    bloodLossPerTick: 0.1,
    o2LossPerTick: 0.05,
    foodLossPerTick: 0.015,
    waterRisePerTick: 0.03,

    bloodRisePerPump: 10,
    o2RisePerTick: 0.5,
    foodRisePerFish: 20,
    waterLossPerTick: 0.8,

    baseWalkingSpeed: 160,
    waterWalkingSpeed: 80,

    virusBaseSpeed: 75,
    virusWaterSpeed: 50,

    bloodCellsBaseSpeed: 55,
    bloodCellsWaterSpeed: 40,

    ticksForVirusToReproduce: 6 * 60, // 60FPS
};

export const multiPlayerConfig: GameConfig = {
    bloodLossPerTick: 0.2,
    o2LossPerTick: 0.1,
    foodLossPerTick: 0.03,
    waterRisePerTick: 0.06,

    bloodRisePerPump: 10,
    o2RisePerTick: 0.5,
    foodRisePerFish: 10,
    waterLossPerTick: 0.8,

    baseWalkingSpeed: 140,
    waterWalkingSpeed: 70,

    virusBaseSpeed: 75,
    virusWaterSpeed: 50,

    bloodCellsBaseSpeed: 55,
    bloodCellsWaterSpeed: 40,

    ticksForVirusToReproduce: 5 * 60, // 60FPS
};
