/**
 * Component that represents a circle collider.
 *
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes Circle Collider component
 * @param {Object} properties        Position and radius
 * @param {number} properties.x      X coordinate of collider center
 * @param {number} properties.y      Y coordinate of collider center
 * @param {number} properties.radius Collider radius
 * @returns {CCircleCollider}        The circle collider component
 * @constructor
 */
const CCircleCollider = function CCircleCollider({ x, y, radius }) {
    Object.assign(this, { x, y, radius });
    this.collisions = {};
    return this;
}
CCircleCollider.prototype.name = 'circleCollider';