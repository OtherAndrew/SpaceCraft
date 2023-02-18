/**
 * Entity duration.
 *
 * @author Andrew Nguyen
 */

class CDuration {
    /**
     * Initializes CDuration component.
     * @param {number} duration How long the entity lives.
     * @return {CDuration} This CDuration component.
     */
    constructor(duration) {
        this.time = duration;
        this.name = "duration";
        return this;
    }
}