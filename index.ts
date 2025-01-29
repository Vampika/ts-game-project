//@ts-ignore
import * as PIXI from "./pixi.min.mjs";
import { Game } from "./Game.js";
import { gameConfig } from "./config.js";

async function initializeApp() {
    const app = new PIXI.Application();

    // Используем параметры из конфигурационного файла
    await app.init({
        width: gameConfig.canvas.width,
        height: gameConfig.canvas.height,
        backgroundColor: gameConfig.canvas.backgroundColor,
    });

    // Добавляем canvas в DOM
    document.body.appendChild(app.canvas);

    const game = new Game(app);
    await game.init();
}

initializeApp().catch((error) => {
    console.error("Failed to initialize the app:", error);
});