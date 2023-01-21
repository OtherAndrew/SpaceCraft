/**
 * Holds position and velocity data.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes CTransform component
 * @param {number} x           X position of object, 0 by default.
 * @param {number} y           Y position of object, 0 by default.
 * @param {number} velocityX   Initial X velocity of object, 0 by default.
 * @param {number} velocityY   Initial Y velocity of object, 0 by default.
 * @param {number} rotation    Rotation of object, 0 by default.
 * @param {number} maxVelocity Maximum velocity value object can reach.
 * @returns {CTransform}
 * @constructor
 */
const CTransform = function CTransform({ x = 0, y = 0, velocityX = 0, velocityY = 0,
                                         rotation = 0, maxVelocity = Number.MAX_SAFE_INTEGER }) {

    Object.assign(this, {x, y, velocityX, velocityY, rotation, maxVelocity});
    return this;
};
CTransform.prototype.name = 'transform';