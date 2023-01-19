/**
 * Holds static sprite data. Useful for things that don't
 * have animations (like blocks).
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes CStaticSprite component
 * @param {image} sprite  Sprite sheet
 * @param {number} width  Sprite width
 * @param {number} height Sprite height
 * @param {number} scale  Scale factor to apply to sprite, 1 by default
 * @param {number} frameX X position of frame on sprite sheet (not pixel position!), 0 by default.
 * @param {number} frameY Y position of frame on sprite sheet (not pixel position!), 0 by default.
 * @returns {CStaticSprite}     The CSprite component
 * @constructor
 */
const CStaticSprite = function CStaticSprite(sprite, width, height,
                                       scale = 1, frameX = 0, frameY = 0) {
    this.sprite = sprite;
    this.spriteWidth = width;
    this.spriteHeight = height;
    this.drawWidth = this.spriteWidth * scale;
    this.drawHeight = this.spriteHeight * scale;
    this.frameX = frameX;
    this.frameY = frameY;
    return this
};
CStaticSprite.prototype.name = 'sprite';