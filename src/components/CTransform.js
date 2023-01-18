/**
 * Holds position and velocity data.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes CTransform component
 * @param {Object} properties             Position and velocity.
 * @param {number} properties.x           X position of object, 0 by default.
 * @param {number} properties.y           Y position of object, 0 by default.
 * @param {number} properties.velocityX   X velocity of object, 0 by default.
 * @param {number} properties.velocityY   Y velocity of object, 0 by default.
 * @param {number} properties.rotation    Rotation of object, 0 by default.
 * @param {number} properties.maxVelocity Maximum velocity value object can reach.
 * @returns {CTransform}
 * @constructor
 */
const CTransform = function CTransform({ x, y, velocityX, velocityY,
                                         rotation, maxVelocity }) {
    this.x = x || 0;
    this.y = y || 0;
    this.velocityX = velocityX || 0;
    this.velocityY = velocityY || 0;
    this.rotation = rotation || 0;
    this.maxVelocity = maxVelocity;
    return this;
}
CTransform.prototype.name = 'transform';