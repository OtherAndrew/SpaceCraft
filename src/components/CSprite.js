/**
 * Holds sprite data.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

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
const CSprite = function CSprite({sprite, sWidth, sHeight, scale = 1,
                                  firstFrameX = 0, frameY = 0, lastFrameX = firstFrameX,
                                  fps = 1, padding = 0 }) {
    Object.assign(this, { sprite, sWidth, sHeight, firstFrameX, frameY, lastFrameX, fps, padding });
    this.currentFrame = this.firstFrameX;
    this.frameDuration = 1 / fps;
    this.dWidth = this.sWidth * scale;
    this.dHeight = this.sHeight * scale;
    this.elapsedTime = 0;
    return this;
};
CSprite.prototype.name = 'sprite';