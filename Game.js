var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-ignore
import * as PIXI from "./pixi.min.mjs";
import { assetsMap } from "./assetsMap.js";
import { Tank } from "./Tank.js";
import { gameConfig } from "./config.js";
export class Game {
    constructor(app) {
        this.app = app;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadAssets();
            this.setupScene();
            this.setupInteractions();
        });
    }
    loadAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            PIXI.Assets.addBundle("assets", assetsMap.sprites);
            yield PIXI.Assets.loadBundle("assets");
        });
    }
    setupScene() {
        // Установка фона
        const background = new PIXI.Sprite(PIXI.Texture.from("Background"));
        background.width = this.app.screen.width * 2;
        background.height = this.app.screen.height * 2;
        background.anchor.set(0.5);
        this.app.stage.addChild(background);
        // Создание танка
        this.tank = new Tank();
        this.app.stage.addChild(this.tank.view);
        // Центрирование сцены
        this.app.stage.position.set(this.app.screen.width / 2, this.app.screen.width / 2);
        this.app.stage.interactive = true;
        this.app.stage.interactiveChildren = false;
        this.app.stage.hitArea = new PIXI.Rectangle(-this.app.screen.width, -this.app.screen.height, this.app.screen.width * 2, this.app.screen.height * 2);
    }
    setupInteractions() {
        this.app.stage.on("pointerdown", this.onPointerDown.bind(this));
    }
    onPointerDown(event) {
        const { x, y } = event.getLocalPosition(this.app.stage);
        const distanceToTank = event.getLocalPosition(this.tank.view);
        const angle = Math.atan2(distanceToTank.y, distanceToTank.x);
        // Используем параметры из конфигурационного файла для вращения и движения танка
        this.tank.rotateTowerBy(this.app, angle, gameConfig.tank.towerRotationSpeed);
        this.tank.rotateBodyBy(this.app, angle, gameConfig.tank.bodyRotationSpeed);
        this.tank.moveTo(this.app, x, y, gameConfig.tank.movementSpeed);
    }
}
