export interface GameConfig {
    canvas: {
        width: number;
        height: number;
        backgroundColor: number;
    };
    scene: {
        centerX: number;
        centerY: number;
        hitArea: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    tank: {
        towerRotationSpeed: number;
        bodyRotationSpeed: number;
        movementSpeed: number;
    };
}

export const gameConfig: GameConfig = {
    canvas: {
        width: 1000,
        height: 600,
        backgroundColor: 0xc2c2c2,
    },
    scene: {
        centerX: 500,
        centerY: 300,
        hitArea: {
            x: -500,
            y: -500,
            width: 1200,
            height: 1200,
        },
    },
    tank: {
        towerRotationSpeed: 0.1,
        bodyRotationSpeed: 0.05,
        movementSpeed: 0.7,
    },
};