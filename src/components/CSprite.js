/**
 * Holds display and animation data for an entity.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

class CSprite {

    /**
     * Initializes CSprite component
     * @param {Image} sprite       Sprite sheet
     * @param {number} sWidth      Sprite width on sprite sheet
     * @param {number} sHeight     Sprite height on sprite sheet
     * @param {number} scale       Scale factor to apply to sprite, 1 by default
     * @param {number} firstFrameX X position of first frame on sprite sheet (not pixel position!), 0 by default.
     * @param {number} frameY      Y position of frame on sprite sheet (not pixel position!), 0 by default.
     * @param {number} lastFrameX  X position of the last frame on sprite sheet (not pixel position!),
     *                             firstFrameX by default.
     * @param {number} fps         Frames per second of sprite animation, 1 by default.
     * @param {number} padding     Pixels of sprite padding, 0 by default.
     * @returns {CSprite}          The CSprite component
     * @constructor
     */
    constructor({sprite, sWidth, sHeight, scale = 1,
                    firstFrameX = 0, frameY = 0, lastFrameX = firstFrameX,
                    fps = 1, padding = 0 }) {
        Object.assign(this, { sprite, sWidth, sHeight, firstFrameX, frameY, lastFrameX, fps, padding });
        this.name = 'sprite';
        this.currentFrame = this.firstFrameX;
        this.frameDuration = 1 / fps;
        this.dWidth = this.sWidth * scale;
        this.dHeight = this.sHeight * scale;
        this.elapsedTime = 0;
        this.currentState = 'idleR';
        this.animationMap = new Map();
        return this;
    };

    /**
     * Sets sprite animation properties.
     * @param {string} state
     */
    setAnimation(state) {
        if (state !== this.currentState) {
            const aProps = this.animationMap.get(state);
            this.firstFrameX = aProps.firstFrameX;
            this.currentFrame = this.firstFrameX;
            this.frameY = aProps.frameY;
            this.lastFrameX = aProps.lastFrameX;
            this.currentState = state;
        }
    }

    /**
     * Updates sprite if animated.
     * @param {number} tick time length
     */
    update(tick) {
        if (this.lastFrameX !== this.firstFrameX) { // has animations
            if (this.elapsedTime >= this.frameDuration) {
                if (this.currentFrame === this.lastFrameX) { // reset frame
                    this.currentFrame = this.firstFrameX;
                } else {
                    this.currentFrame++;
                }
                this.elapsedTime = 0;
            } else {
                this.elapsedTime += tick;
            }
        }
    }
}