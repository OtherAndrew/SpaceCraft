/**
 * Entity duration.
 *
 * @author Andrew Nguyen
 */

class CDuration {
    /**
     * Initializes CDuration component.
     * @param {number} duration How long the entity lives. MOB_TIMEOUT by default.
     * @return {CDuration} This CDuration component.
     */
    constructor(duration = MOB_TIMEOUT) {
        this.time = duration;
        this.name = "duration";
        return this;
    }
}