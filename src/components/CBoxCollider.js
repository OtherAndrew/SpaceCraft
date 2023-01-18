/**
 * Component that represents a box collider.
 * The collider should have the same dimensions as a sprite.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes Box Collider component
 * @param {Object} properties Position and size
 * @param {number} properties.x      X coordinate of collider center
 * @param {number} properties.y      Y coordinate of collider center
 * @param {number} properties.width  Collider width
 * @param {number} properties.height Collider height
 * @returns {CCircleCollider}        The box collider component
 * @constructor
 */
const CBoxCollider = function CBoxCollider({ x, y, width, height }) {
    Object.assign(this, { x, y, width, height });
    this.collisions = {};
    return this;
}
CBoxCollider.prototype.name = 'boxCollider';