/**
 * Component to store state and animation.
 *
 * @author Andrew Nguyen
 * @version 1/19/23
 */

/**
 * Initializes CState component.
 * @param {number} frameX     X position of start frame (not pixel position!)
 * @param {number} frameY     Y position of start frame (not pixel position!)
 * @param {number} frameCount Number of frames of animation.
 * @param {string} initialState Initial state, 'idleR' by default
 * @returns {CState}            The CState component.
 * @constructor
 */
const CState = function CState(frameX, frameY, frameCount, initialState = 'idleR') {
    this.currentState = initialState;
    this.states = ["idleR", "idleL", "walkR", "walkL"];
    return this;
};
CState.prototype.name = 'state';