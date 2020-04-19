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
}

export const singlePlayerConfig: GameConfig = {
    bloodLossPerTick: 0.1,
    o2LossPerTick: 0.05,
    foodLossPerTick: 0.01,
    waterRisePerTick: 0.03,

    bloodRisePerPump: 10,
    o2RisePerTick: 0.5,
    foodRisePerFish: 20,
    waterLossPerTick: 0.8,

    baseWalkingSpeed: 160,
    waterWalkingSpeed: 80,
};

export const multiPlayerConfig: GameConfig = {
    bloodLossPerTick: 0.2,
    o2LossPerTick: 0.1,
    foodLossPerTick: 0.02,
    waterRisePerTick: 0.06,

    bloodRisePerPump: 10,
    o2RisePerTick: 0.5,
    foodRisePerFish: 10,
    waterLossPerTick: 0.8,

    baseWalkingSpeed: 140,
    waterWalkingSpeed: 70,
};