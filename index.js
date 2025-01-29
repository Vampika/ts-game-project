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
import { Game } from "./Game.js";
import { CanvasAdapter } from "./CanvasAdapter.js";
import { gameConfig } from "./config.js";
function initializeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = new PIXI.Application();
        // Используем параметры из конфигурационного файла
        yield app.init({
            width: gameConfig.canvas.width,
            height: gameConfig.canvas.height,
            backgroundColor: gameConfig.canvas.backgroundColor,
        });
        // Добавляем canvas в DOM
        document.body.appendChild(app.canvas);
        new CanvasAdapter(app);
        const game = new Game(app);
        yield game.init();
    });
}
initializeApp().catch((error) => {
    console.error("Failed to initialize the app:", error);
});
