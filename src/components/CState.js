/**
 * Component to store state and animation.
 *
 * @author Andrew Nguyen
 * @version 1/19/23
 */

class CState {

    /**
     * Initializes CState component.
     * @returns {CState} The CState component.
     * @constructor
     */
    constructor() {
        this.name = "state";
        this.currentState = 'idleR';
        // this.input = '';
        this.direction = 'right';
        this.grounded = true;
        this.sprite = null;
        this.transform = null;
        // this.elapsedTime = 0;
        this.elapsedTime = randomInt(100);
        this.stateSequence = [];
        return this;
    }

    /**
     * Sets state and corresponding animation and movement properties if assigned.
     * @param {string} state The state to assign.
     */
    setState(state) {
        if (state !== this.currentState) {
            this.currentState = state;
            if (this.sprite) this.sprite.setAnimation(this.currentState);
            if (this.transform) this.transform.setBehavior(this.currentState);
        }
    }
}