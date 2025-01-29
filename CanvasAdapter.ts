//@ts-ignore
import * as PIXI from "./pixi.min.mjs";

export class CanvasAdapter {
	private app: PIXI.Application;
  
	constructor(app: PIXI.Application) {
	  this.app = app;
	  this.init();
	}
  
	private init() {
	  this.resizeCanvas();
	  this.setupFullscreen();
	  window.addEventListener("resize", () => this.resizeCanvas());
	}
  
	private resizeCanvas() {
	  const width = window.innerWidth;
	  const height = window.innerHeight;
  
	  const maxWidth = 1280; // Максимальная ширина для десктопных браузеров
	  const maxHeight = 768; // Максимальная высота для десктопных браузеров
  
	  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
	  // Вычисляем коэффициент масштабирования по меньшей стороне
	  const scaleFactor = isMobile
		? Math.min(width / this.app.renderer.width, height / this.app.renderer.height)
		: Math.min(maxWidth / this.app.renderer.width, maxHeight / this.app.renderer.height);
  
	  // Новые размеры холста
	  const newWidth = this.app.renderer.width * scaleFactor;
	  const newHeight = this.app.renderer.height * scaleFactor;
  
	  // Устанавливаем размеры рендера
	  this.app.renderer.resize(newWidth, newHeight);
  
	  // Центрирование холста
	  this.app.view.style.width = `${newWidth}px`;
	  this.app.view.style.height = `${newHeight}px`;
	  this.app.view.style.position = "absolute";
	  this.app.view.style.left = `${(width - newWidth) / 2}px`;
	  this.app.view.style.top = `${(height - newHeight) / 2}px`;
	}
  
	private setupFullscreen() {
	  const enableFullscreen = () => {
		const canvas = this.app.view;
		if (canvas.requestFullscreen) {
		  canvas.requestFullscreen();
		} else if ((canvas as any).webkitRequestFullscreen) {
		  (canvas as any).webkitRequestFullscreen();
		}
	  };
  
	  // События для активации полноэкранного режима
	  this.app.view.addEventListener("click", enableFullscreen, { once: true });
	  this.app.view.addEventListener("touchstart", enableFullscreen, { once: true });
	}
  }
  