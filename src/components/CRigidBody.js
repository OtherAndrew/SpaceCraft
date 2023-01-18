/**
 * Component for force simulation.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes CRigidBody component.
 * @param {number} mass  Mass of object.
 * @returns {CRigidBody} The component.
 * @constructor
 */
const CRigidBody = function CRigidBody(mass) {
    this.mass = mass;
    this.isGrounded = false;
    return this;
}
CRigidBody.prototype.name = 'rigidBody';