/**
 * Holds sprite data.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes CSprite component
 * @param {image} sprite       Sprite sheet
 * @param {number} width       Sprite width on sprite sheet
 * @param {number} height      Sprite height on sprite sheet
 * @param {number} scale       Scale factor to apply to sprite, 1 by default
 * @param {number} firstFrameX X position of first frame on sprite sheet (not pixel position!), 0 by default.
 * @param {number} lastFrameX  X position of the last frame on sprite sheet (not pixel position!), firstFrameX by default.
 * @param {number} frameY      Y position of frame on sprite sheet (not pixel position!), 0 by default.
 * @param {number} fps         Frames per second of sprite animation, 1 by default.
 * @returns {CSprite}          The CSprite component
 * @constructor
 */
const CSprite = function CSprite(sprite, width, height,
                                 { scale = 1, firstFrameX = 0, lastFrameX = firstFrameX, frameY = 0, fps = 1, } ) {
    Object.assign(this, { sprite, width, height, firstFrameX, lastFrameX, frameY  });
    this.currentFrame = this.firstFrameX;
    this.frameDuration = 1 / fps;
    this.drawWidth = this.width * scale;
    this.drawHeight = this.height * scale;
    this.elapsedTime = 0;
    return this;
};
CSprite.prototype.name = 'sprite';