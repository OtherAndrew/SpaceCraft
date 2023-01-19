/**
 * Holds sprite data.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes CSprite component
 * @param {image} sprite      Sprite sheet
 * @param {number} width      Sprite width
 * @param {number} height     Sprite height
 * @param {number} scale      Scale factor to apply to sprite, 1 by default
 * @param {number} frameX     X position of frame on sprite sheet (not pixel position!), 0 by default.
 * @param {number} frameY     Y position of frame on sprite sheet (not pixel position!), 0 by default.
 * @param {number} fps        Frames per second of sprite animation, 1 by default.
 * @param {number} frameCount Number of frames of sprite animation, 1 by default.
 * @returns {CSprite}         The CSprite component
 * @constructor
 */
const CSprite = function CSprite(sprite, width, height,
                                 scale = 1, frameX = 0, frameY = 0, fps = 1, frameCount = 1) {
    this.sprite = sprite;
    this.spriteWidth = width;
    this.spriteHeight = height;
    this.drawWidth = this.spriteWidth * scale;
    this.drawHeight = this.spriteHeight * scale;
    this.frameX = frameX;
    this.frameY = frameY;
    this.frameInterval = 1 / fps;
    this.frameCount = frameCount;
    this.frameTimer = 0;
    return this
};
CSprite.prototype.name = 'sprite';