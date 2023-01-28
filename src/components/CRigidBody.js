/**
 * Component for force simulation.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

class CRigidBody {
    /**
     * Initializes CRigidBody component.
     * @param {number} mass  Mass of object.
     * @returns {CRigidBody} The component.
     * @constructor
     */
    constructor(mass = 1) {
        this.name = 'rigidBody';
        this.mass = mass;
        this.isGrounded = false;
        return this;
    }
}