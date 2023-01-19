/**
 * Holds animations for an entity.
 *
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes Animation Set
 * @param {ImageBitmap} spriteSheet The sprite sheet to use
 * @param {number} width            Default sprite width
 * @param {number} height           Default sprite height
 * @param {number} fps              Frames per second
 * @returns {CAnimationSet}         This animation set
 * @constructor
 */
const CAnimatedSprite = function CAnimatedSprite(spriteSheet, width, height, fps = 60) {
    Object.assign(this, { spriteSheet, width, height, fps });
    this.animations = [];
    return this;
};
CAnimatedSprite.prototype.name = 'animatedSprite';
