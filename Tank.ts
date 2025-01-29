//@ts-ignore
import { Container, AnimatedSprite, Texture, Sprite, Application, Ticker } from "./pixi.min.mjs";

export function createAnimatedSprite(
    textureNames: string[],
    position: { x: number; y: number } = { x: 0, y: 0 },
    anchor: { x: number; y: number } = { x: 0.5, y: 0.5 }
): AnimatedSprite {
    const textures = textureNames.map((name) => Texture.from(name));
    const animatedSprite = new AnimatedSprite(textures);
    animatedSprite.position.set(position.x, position.y);
    animatedSprite.anchor.set(anchor.x, anchor.y);
    return animatedSprite;
}

export function createSprite(
    textureName: string,
    position: { x: number; y: number } = { x: 0, y: 0 },
    anchor: { x: number; y: number } = { x: 0.5, y: 0.5 }
): Sprite {
    const sprite = new Sprite(Texture.from(textureName));
    sprite.position.set(position.x, position.y);
    sprite.anchor.set(anchor.x, anchor.y);
    return sprite;
}

export class Tank {
    private _view: Container;
    private _bodyContainer: Container;
    private _towerContainer: Container;
    private _tracksLeft: AnimatedSprite;
    private _tracksRight: AnimatedSprite;
    private _isMoving: boolean = false;
    private _isTowerRotating: boolean = false;
    private _isBodyRotating: boolean = false;
    private _onMoveCallback: (() => void) | null = null;

    constructor() {
        this._view = new Container();
        this._initializeBody();
        this._initializeTower();
        this._initializeTracks();
    }

    private _initializeBody(): void {
        this._bodyContainer = new Container();
        this._bodyContainer.addChild(createSprite("MediumHullA"));
        this._view.addChild(this._bodyContainer);
    }

    private _initializeTower(): void {
        this._towerContainer = new Container();
        this._towerContainer.addChild(createSprite("HeavyGunB", { x: 140, y: -27 }));
        this._towerContainer.addChild(createSprite("HeavyGunB", { x: 160, y: 29 }));
        this._towerContainer.addChild(createSprite("GunConnectorD", { x: 80, y: 0 }));
        this._towerContainer.addChild(createSprite("HeavyTowerB"));
        this._view.addChild(this._towerContainer);
    }

    private _initializeTracks(): void {
        this._tracksLeft = createAnimatedSprite(["TrackAFrame1", "TrackAFrame2"], { x: 0, y: -80 });
        this._tracksRight = createAnimatedSprite(["TrackAFrame1", "TrackAFrame2"], { x: 0, y: 80 });

        this._tracksLeft.animationSpeed = this._tracksRight.animationSpeed = 20 / 60;
        this._bodyContainer.addChild(this._tracksLeft, this._tracksRight);
    }

    public get view(): Container {
        return this._view;
    }

    private _rotateContainer(
        container: Container,
        app: Application,
        targetAngle: number,
        speed: number,
        flagName: "_isTowerRotating" | "_isBodyRotating"
    ): void {
        const rotateHandler = () => {
            this[flagName] = true;
            const delta = targetAngle - container.rotation;
            if (Math.abs(delta) < 0.01) {
                container.rotation = targetAngle;
                this[flagName] = false;
                app.ticker.remove(rotateHandler);
                return;
            }
            container.rotation += delta * speed;
        };

        if (!this[flagName]) app.ticker.add(rotateHandler);
    }

    public rotateTowerBy(app: Application, targetAngle: number, speed: number): void {
        this._rotateContainer(this._towerContainer, app, targetAngle, speed, "_isTowerRotating");
    }

    public rotateBodyBy(app: Application, targetAngle: number, speed: number): void {
        this._rotateContainer(this._bodyContainer, app, targetAngle, speed, "_isBodyRotating");
    }

    public startTracks(): void {
        this._tracksLeft.play();
        this._tracksRight.play();
    }

    public stopTracks(): void {
        this._tracksLeft.stop();
        this._tracksRight.stop();
    }

    public moveTo(app: Application, endX: number, endY: number, speed: number): void {
        if (!this._isMoving) {
            let x = this._view.x;
            let y = this._view.y;

            this._onMoveCallback = () => {
                this.startTracks();
                this._isMoving = true;

                const dx = endX - this._view.x;
                const dy = endY - this._view.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < speed) {
                    x = endX;
                    y = endY;
                    this._isMoving = false;
                    this.stopTracks();
                    app.ticker.remove(this._onMoveCallback);
                } else {
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    x += directionX * speed;
                    y += directionY * speed;
                }

                this._view.x = x;
                this._view.y = y;
            };

            app.ticker.add(this._onMoveCallback);
        } else {
            this._isMoving = false;
            this.stopTracks();
            if (this._onMoveCallback) {
                app.ticker.remove(this._onMoveCallback);
            }
        }
    }
}