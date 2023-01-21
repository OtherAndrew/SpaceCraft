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
 * @param {number} x          X coordinate of collider center
 * @param {number} y          Y coordinate of collider center
 * @param {number} width      Collider width
 * @param {number} height     Collider height
 * @returns {CBoxCollider} The box collider component
 * @constructor
 */
const CBoxCollider = function CBoxCollider({ x, y, width, height }) {
    Object.assign(this, { x, y, width, height });
    this.collisions = {};
    return this;
};
CBoxCollider.prototype.name = 'boxCollider';