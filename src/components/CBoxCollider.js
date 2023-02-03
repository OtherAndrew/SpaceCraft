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

        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;

        this.last = null;


        return this;
    }

    /**
     *
     * @param {CBoxCollider} other
     * @returns {boolean}
     */
    collide(other) {
        return this.right > other.left
            && this.left < other.right
            && this.top < other.bottom
            && this.bottom > other.top;
    }

    update(x, y) {
        this.last = this;
        this.x = x;
        this.y = y;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;
    }
}