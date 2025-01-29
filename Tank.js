//@ts-ignore
import { Container, AnimatedSprite, Texture, Sprite } from "./pixi.min.mjs";
export function createAnimatedSprite(textureNames, position = { x: 0, y: 0 }, anchor = { x: 0.5, y: 0.5 }) {
    const textures = textureNames.map((name) => Texture.from(name));
    const animatedSprite = new AnimatedSprite(textures);
    animatedSprite.position.set(position.x, position.y);
    animatedSprite.anchor.set(anchor.x, anchor.y);
    return animatedSprite;
}
export function createSprite(textureName, position = { x: 0, y: 0 }, anchor = { x: 0.5, y: 0.5 }) {
    const sprite = new Sprite(Texture.from(textureName));
    sprite.position.set(position.x, position.y);
    sprite.anchor.set(anchor.x, anchor.y);
    return sprite;
}
export class Tank {
    constructor() {
        this._isMoving = false;
        this._isTowerRotating = false;
        this._isBodyRotating = false;
        this._onMoveCallback = null;
        this._view = new Container();
        this._initializeBody();
        this._initializeTower();
        this._initializeTracks();
    }
    _initializeBody() {
        this._bodyContainer = new Container();
        this._bodyContainer.addChild(createSprite("MediumHullA"));
        this._view.addChild(this._bodyContainer);
    }
    _initializeTower() {
        this._towerContainer = new Container();
        this._towerContainer.addChild(createSprite("HeavyGunB", { x: 140, y: -27 }));
        this._towerContainer.addChild(createSprite("HeavyGunB", { x: 160, y: 29 }));
        this._towerContainer.addChild(createSprite("GunConnectorD", { x: 80, y: 0 }));
        this._towerContainer.addChild(createSprite("HeavyTowerB"));
        this._view.addChild(this._towerContainer);
    }
    _initializeTracks() {
        this._tracksLeft = createAnimatedSprite(["TrackAFrame1", "TrackAFrame2"], { x: 0, y: -80 });
        this._tracksRight = createAnimatedSprite(["TrackAFrame1", "TrackAFrame2"], { x: 0, y: 80 });
        this._tracksLeft.animationSpeed = this._tracksRight.animationSpeed = 20 / 60;
        this._bodyContainer.addChild(this._tracksLeft, this._tracksRight);
    }
    get view() {
        return this._view;
    }
    _rotateContainer(container, app, targetAngle, speed, flagName) {
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
        if (!this[flagName])
            app.ticker.add(rotateHandler);
    }
    rotateTowerBy(app, targetAngle, speed) {
        this._rotateContainer(this._towerContainer, app, targetAngle, speed, "_isTowerRotating");
    }
    rotateBodyBy(app, targetAngle, speed) {
        this._rotateContainer(this._bodyContainer, app, targetAngle, speed, "_isBodyRotating");
    }
    startTracks() {
        this._tracksLeft.play();
        this._tracksRight.play();
    }
    stopTracks() {
        this._tracksLeft.stop();
        this._tracksRight.stop();
    }
    moveTo(app, endX, endY, speed) {
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
                }
                else {
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    x += directionX * speed;
                    y += directionY * speed;
                }
                this._view.x = x;
                this._view.y = y;
            };
            app.ticker.add(this._onMoveCallback);
        }
        else {
            this._isMoving = false;
            this.stopTracks();
            if (this._onMoveCallback) {
                app.ticker.remove(this._onMoveCallback);
            }
        }
    }
}
