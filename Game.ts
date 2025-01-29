//@ts-ignore
import * as PIXI from "./pixi.min.mjs";
import { assetsMap } from "./assetsMap.js";
import { Tank } from "./Tank.js";
import { gameConfig } from "./config.js";

export class Game {
    private app: PIXI.Application;
    private tank!: Tank;

    constructor(app: PIXI.Application) {
        this.app = app;
    }

    async init(): Promise<void> {
        await this.loadAssets();
        this.setupScene();
        this.setupInteractions();
    }

    private async loadAssets(): Promise<void> {
        PIXI.Assets.addBundle("assets", assetsMap.sprites);
        await PIXI.Assets.loadBundle("assets");
    }

    private setupScene(): void {
        // Установка фона
        const background = new PIXI.Sprite(PIXI.Texture.from("Background"));
        background.width = this.app.screen.width;
        background.height = this.app.screen.height;
        background.anchor.set(0.5);
        this.app.stage.addChild(background);

        // Создание танка
        this.tank = new Tank();
        this.app.stage.addChild(this.tank.view);

        // Центрирование сцены
        this.app.stage.position.set(gameConfig.scene.centerX, gameConfig.scene.centerY);
        this.app.stage.interactive = true;
        this.app.stage.interactiveChildren = false;
        this.app.stage.hitArea = new PIXI.Rectangle(
            gameConfig.scene.hitArea.x,
            gameConfig.scene.hitArea.y,
            gameConfig.scene.hitArea.width,
            gameConfig.scene.hitArea.height
        );
    }

    private setupInteractions(): void {
        this.app.stage.on("pointerdown", this.onPointerDown.bind(this));
    }

    private onPointerDown(event: PIXI.FederatedPointerEvent): void {
        const { x, y } = event.getLocalPosition(this.app.stage);

        const distanceToTank = event.getLocalPosition(this.tank.view);
        const angle = Math.atan2(distanceToTank.y, distanceToTank.x);

        // Используем параметры из конфигурационного файла для вращения и движения танка
        this.tank.rotateTowerBy(this.app, angle, gameConfig.tank.towerRotationSpeed);
        this.tank.rotateBodyBy(this.app, angle, gameConfig.tank.bodyRotationSpeed);
        this.tank.moveTo(this.app, x, y, gameConfig.tank.movementSpeed);
    }
}