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

    difficultyIncreasePerTick: number;
    hardModeStartTime: number;
}

export const singlePlayerConfig: GameConfig = {
    bloodLossPerTick: 0.07,
    o2LossPerTick: 0.038,
    foodLossPerTick: 0.014,
    waterRisePerTick: 0.08,

    bloodRisePerPump: 10,
    o2RisePerTick: 0.5,
    foodRisePerFish: 20,
    waterLossPerTick: 0.8,

    baseWalkingSpeed: 200,
    waterWalkingSpeed: 100,

    virusBaseSpeed: 100,
    virusWaterSpeed: 75,

    bloodCellsBaseSpeed: 70,
    bloodCellsWaterSpeed: 50,

    ticksForVirusToReproduce: 6 * 60, // 60FPS

    difficultyIncreasePerTick: 0.0002,
    hardModeStartTime: 45 * 60, // 60 FPS
};

export const multiPlayerConfig: GameConfig = {
    bloodLossPerTick: 0.135,
    o2LossPerTick: 0.072,
    foodLossPerTick: 0.027,
    waterRisePerTick: 0.13,

    bloodRisePerPump: 10,
    o2RisePerTick: 0.5,
    foodRisePerFish: 20,
    waterLossPerTick: 0.8,

    baseWalkingSpeed: 190,
    waterWalkingSpeed: 95,

    virusBaseSpeed: 100,
    virusWaterSpeed: 75,

    bloodCellsBaseSpeed: 70,
    bloodCellsWaterSpeed: 50,

    ticksForVirusToReproduce: 5 * 60, // 60FPS

    difficultyIncreasePerTick: 0.0003,
    hardModeStartTime: 45 * 60, // 60 FPS
};
