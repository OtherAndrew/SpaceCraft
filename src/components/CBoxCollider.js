/**
 * Component that represents a box collider.
 * The collider should have the same dimensions as a sprite.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

class CBoxCollider {
    /**
     * Initializes Box Collider component
     * @param {number} x          X coordinate of collider center
     * @param {number} y          Y coordinate of collider center
     * @param {number} width      Collider width
     * @param {number} height     Collider height
     * @returns {CBoxCollider} The box collider component
     * @constructor
     */
    constructor({ x, y, width, height }) {
        Object.assign(this, { x, y, width, height });
        this.name = "boxCollider";
        this.collisions = {};
        this.last = null;
        return this;
    }

    /**
     *
     * @param {CBoxCollider} other
     * @returns {boolean}
     */
    collide(other) {
        // let futurePos = {
        //     x: a.x + (entityA.components.transform.velocityX * deltaTime),
        //     y: a.y + (entityA.components.transform.velocityY * deltaTime)
        // }
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    update(x, y) {
        this.last = this;
        this.x = x;
        this.y = y;
    }
}